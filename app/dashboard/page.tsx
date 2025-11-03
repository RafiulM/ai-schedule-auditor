import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { event, chatMessage, aiInsight } from "@/db/schema/schedule";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";
import { headers } from "next/headers";

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
            Manage your schedule, analyze time patterns, and configure API access
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        events={scheduleData.monthlyEvents}
        weeklyEvents={scheduleData.weeklyEvents}
        insights={scheduleData.recentInsights}
      />

      {/* Dashboard Tabs */}
      <DashboardTabs
        monthlyEvents={scheduleData.monthlyEvents}
        weeklyEvents={scheduleData.weeklyEvents}
        recentMessages={scheduleData.recentMessages}
        recentInsights={scheduleData.recentInsights}
      />
    </div>
  );
}