import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { event, chatMessage, aiInsight } from "@/db/schema/schedule";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { MetricsChart } from "@/components/dashboard/metrics-chart";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";

async function getUserScheduleData(userId: string) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const weekAgo = subDays(today, 7);

  try {
    // Get events for current month
    const monthlyEvents = await db
      .select()
      .from(event)
      .where(
        and(
          eq(event.userId, userId),
          gte(event.date, monthStart),
          lte(event.date, monthEnd)
        )
      )
      .orderBy(desc(event.date), desc(event.startTime));

    // Get events from last week for analytics
    const weeklyEvents = await db
      .select()
      .from(event)
      .where(
        and(
          eq(event.userId, userId),
          gte(event.date, weekAgo)
        )
      )
      .orderBy(desc(event.date), desc(event.startTime));

    // Get recent chat messages
    const recentMessages = await db
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.userId, userId))
      .orderBy(desc(chatMessage.timestamp))
      .limit(10);

    // Get recent AI insights
    const recentInsights = await db
      .select()
      .from(aiInsight)
      .where(eq(aiInsight.userId, userId))
      .orderBy(desc(aiInsight.createdAt))
      .limit(5);

    return {
      monthlyEvents,
      weeklyEvents,
      recentMessages,
      recentInsights,
    };
  } catch (error) {
    console.error("Error fetching user schedule data:", error);
    return {
      monthlyEvents: [],
      weeklyEvents: [],
      recentMessages: [],
      recentInsights: [],
    };
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const scheduleData = await getUserScheduleData(userId);

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and analyze your daily schedule and time management
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        events={scheduleData.monthlyEvents}
        weeklyEvents={scheduleData.weeklyEvents}
        insights={scheduleData.recentInsights}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <CalendarView events={scheduleData.monthlyEvents} />

        {/* Metrics Chart */}
        <MetricsChart events={scheduleData.weeklyEvents} />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Chat Messages */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Chat History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {scheduleData.recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No chat history yet</p>
            ) : (
              scheduleData.recentMessages.map((message) => (
                <div key={message.id} className="flex gap-3 text-sm">
                  <div className={`font-medium ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                    {message.role === 'user' ? 'You:' : 'AI:'}
                  </div>
                  <div className="flex-1 text-muted-foreground line-clamp-2">
                    {message.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {scheduleData.recentInsights.length === 0 ? (
              <p className="text-muted-foreground text-sm">No insights yet. Start chatting with the AI!</p>
            ) : (
              scheduleData.recentInsights.map((insight) => (
                <div key={insight.id} className="border-l-2 border-blue-500 pl-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {format(insight.createdAt, "MMM d, yyyy")}
                  </div>
                  <div className="text-sm">{insight.insight}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}