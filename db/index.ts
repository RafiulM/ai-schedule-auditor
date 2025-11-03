import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as scheduleSchema from './schema/schedule';
import * as apiKeysSchema from './schema/api-keys';

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: { ...authSchema, ...scheduleSchema, ...apiKeysSchema },
});

// Export all schema models
export const { user, session, account, verification } = authSchema;
export const { event, chatMessage, aiInsight, eventTypeEnum } = scheduleSchema;
export const { apiKey } = apiKeysSchema;

// Export types
export type { Event, NewEvent, ChatMessage, NewChatMessage, AiInsight, NewAiInsight } from './schema/schedule';
export type { ApiKey, NewApiKey } from './schema/api-keys';