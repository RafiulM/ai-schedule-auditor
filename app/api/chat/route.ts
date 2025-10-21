import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, event, chatMessage, aiInsight } from '@/db';
import { eq, and, desc } from 'drizzle-orm';

// Schema for extracting schedule events from user messages
const scheduleEventSchema = z.object({
    title: z.string().describe('The title/name of the event or activity'),
    description: z.string().optional().describe('A brief description of the event'),
    startTime: z.string().describe('The start time in HH:MM format'),
    endTime: z.string().describe('The end time in HH:MM format'),
    date: z.string().describe('The date in YYYY-MM-DD format'),
    type: z.enum(['meeting', 'work', 'focus', 'break', 'exercise', 'meal', 'personal', 'other']).describe('The type of event')
});

// Schema for generating AI insights
const insightSchema = z.object({
    insights: z.array(z.object({
        type: z.enum(['schedule_optimization', 'time_audit', 'productivity_tip']),
        insight: z.string().describe('A specific, actionable insight or recommendation'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority level of this insight')
    })).describe('Array of insights and recommendations')
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // Verify authentication
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return new Response('Unauthorized', { status: 401 });
        }

        const userId = session.user.id;
        const { messages } = await req.json();

        // Get the latest user message
        const userMessage = messages[messages.length - 1];
        if (!userMessage || userMessage.role !== 'user') {
            return new Response('Invalid message format', { status: 400 });
        }

        // Store user message in database
        await db.insert(chatMessage).values({
            userId,
            message: userMessage.content,
            role: 'user',
            timestamp: new Date(),
        });

        // Get recent chat history for context
        const recentMessages = await db
            .select()
            .from(chatMessage)
            .where(eq(chatMessage.userId, userId))
            .orderBy(desc(chatMessage.timestamp))
            .limit(10);

        // Get user's recent events for context
        const recentEvents = await db
            .select()
            .from(event)
            .where(eq(event.userId, userId))
            .orderBy(desc(event.date))
            .limit(20);

        const systemPrompt = `You are an AI time management assistant and productivity coach. Your goal is to help users optimize their daily schedules and build better time management habits.

Key responsibilities:
1. Extract and organize schedule events from natural language descriptions
2. Provide actionable insights about time management and productivity
3. Help users identify patterns, time leaks, and optimization opportunities
4. Suggest improvements to daily routines and schedules

When users describe their schedule or activities:
- Look for specific events with times and dates
- Extract structured data when possible
- Provide feedback on time allocation
- Suggest optimizations based on productivity best practices

Recent user events for context:
${recentEvents.map(event =>
    `- ${event.title} on ${event.date} from ${event.startTime} to ${event.endTime} (${event.type})`
).join('\n')}

Be encouraging, constructive, and focused on practical improvements. Always consider the user's existing schedule patterns when making suggestions.`;

        const result = streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages: messages,
            temperature: 0.7,
            tools: {
                extractScheduleEvent: {
                    description: 'Extract a schedule event from the user message',
                    parameters: scheduleEventSchema,
                    execute: async (extractedEvent) => {
                        try {
                            // Store the extracted event in database
                            await db.insert(event).values({
                                userId,
                                title: extractedEvent.title,
                                description: extractedEvent.description,
                                startTime: new Date(`${extractedEvent.date}T${extractedEvent.startTime}`),
                                endTime: new Date(`${extractedEvent.date}T${extractedEvent.endTime}`),
                                date: new Date(extractedEvent.date),
                                type: extractedEvent.type,
                            });

                            return `✅ I've added "${extractedEvent.title}" to your schedule for ${extractedEvent.date} from ${extractedEvent.startTime} to ${extractedEvent.endTime}.`;
                        } catch (error) {
                            console.error('Error storing event:', error);
                            return '❌ Sorry, I had trouble saving that event to your schedule.';
                        }
                    },
                },
                generateInsights: {
                    description: 'Generate time management insights based on the user\'s schedule patterns',
                    parameters: insightSchema,
                    execute: async (insights) => {
                        try {
                            // Store insights in database
                            for (const insight of insights.insights) {
                                await db.insert(aiInsight).values({
                                    userId,
                                    insight: insight.insight,
                                    insightType: insight.type,
                                    date: new Date(),
                                });
                            }

                            return insights.insights.map(insight =>
                                `${insight.priority === 'high' ? '🔴' : insight.priority === 'medium' ? '🟡' : '🟢'} **${insight.type.replace('_', ' ')}**: ${insight.insight}`
                            ).join('\n\n');
                        } catch (error) {
                            console.error('Error storing insights:', error);
                            return '❌ Sorry, I had trouble saving those insights.';
                        }
                    },
                },
            },
            onFinish: async ({ text }) => {
                // Store assistant response in database
                await db.insert(chatMessage).values({
                    userId,
                    message: text,
                    role: 'assistant',
                    timestamp: new Date(),
                });
            },
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}