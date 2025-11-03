import { Event, AiInsight } from "@/db";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  differenceInMinutes,
  addDays,
  subDays
} from "date-fns";

export interface ScheduleMetrics {
  meetingDensity: {
    meetingsPerDay: number;
    meetingsPerWeek: number;
    averageMeetingDuration: number;
    meetingTimePercentage: number;
  };
  freeTimeRatio: {
    totalHours: number;
    scheduledHours: number;
    freeHours: number;
    freeTimePercentage: number;
  };
  focusBlocks: {
    count: number;
    totalHours: number;
    averageDuration: number;
    focusTimePercentage: number;
  };
  productivityInsights: {
    mostProductiveDay: string;
    leastProductiveDay: string;
    peakProductivityHours: string[];
    workLifeBalance: number;
  };
}

export interface AnalyticsInsight {
  type: 'schedule_optimization' | 'time_audit' | 'productivity_tip';
  insight: string;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

/**
 * Calculate comprehensive schedule analytics metrics
 */
export function calculateScheduleMetrics(events: Event[], period: 'week' | 'month' = 'week'): ScheduleMetrics {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  if (period === 'week') {
    startDate = startOfWeek(now, { weekStartsOn: 1 });
    endDate = endOfWeek(now, { weekStartsOn: 1 });
  } else {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  }

  // Filter events for the period
  const periodEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });

  // Calculate meeting density
  const meetings = periodEvents.filter(event => event.type === 'meeting' || event.type === 'work');
  const totalMeetingMinutes = meetings.reduce((total, event) => {
    const duration = differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
    return total + duration;
  }, 0);

  const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
  const meetingDensity = {
    meetingsPerDay: meetings.length / daysInPeriod.length,
    meetingsPerWeek: meetings.length,
    averageMeetingDuration: meetings.length > 0 ? totalMeetingMinutes / meetings.length : 0,
    meetingTimePercentage: 0 // Will be calculated below
  };

  // Calculate free time ratio (assuming 9 AM - 6 PM workday, 9 hours = 540 minutes)
  const workDayMinutes = 9 * 60; // 9 hours per day
  const totalWorkMinutes = daysInPeriod.length * workDayMinutes;
  const scheduledMinutes = periodEvents.reduce((total, event) => {
    return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
  }, 0);

  const freeTimeRatio = {
    totalHours: totalWorkMinutes / 60,
    scheduledHours: scheduledMinutes / 60,
    freeHours: (totalWorkMinutes - scheduledMinutes) / 60,
    freeTimePercentage: ((totalWorkMinutes - scheduledMinutes) / totalWorkMinutes) * 100
  };

  meetingDensity.meetingTimePercentage = (totalMeetingMinutes / totalWorkMinutes) * 100;

  // Calculate focus blocks
  const focusEvents = periodEvents.filter(event => event.type === 'focus');
  const totalFocusMinutes = focusEvents.reduce((total, event) => {
    return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
  }, 0);

  const focusBlocks = {
    count: focusEvents.length,
    totalHours: totalFocusMinutes / 60,
    averageDuration: focusEvents.length > 0 ? totalFocusMinutes / focusEvents.length : 0,
    focusTimePercentage: (totalFocusMinutes / totalWorkMinutes) * 100
  };

  // Calculate productivity insights
  const dailyActivity = daysInPeriod.map(day => {
    const dayEvents = periodEvents.filter(event => isSameDay(new Date(event.date), day));
    const dayMinutes = dayEvents.reduce((total, event) => {
      return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
    }, 0);
    return { day, minutes: dayMinutes, events: dayEvents.length };
  });

  const mostProductiveDay = dailyActivity.reduce((max, current) =>
    current.minutes > max.minutes ? current : max
  , dailyActivity[0] || { day: new Date(), minutes: 0, events: 0 });

  const leastProductiveDay = dailyActivity.reduce((min, current) =>
    current.minutes < min.minutes ? current : min
  , dailyActivity[0] || { day: new Date(), minutes: 0, events: 0 });

  // Calculate peak productivity hours
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
    const hourEvents = periodEvents.filter(event => {
      const startHour = new Date(event.startTime).getHours();
      const endHour = new Date(event.endTime).getHours();
      return startHour <= hour && hour < endHour;
    });
    return { hour, count: hourEvents.length };
  });

  const peakHours = hourlyActivity
    .filter(h => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(h => `${h.hour}:00-${h.hour + 1}:00`);

  // Calculate work-life balance
  const workMinutes = meetings.reduce((total, event) => {
    return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
  }, 0);

  const personalMinutes = periodEvents
    .filter(event => ['personal', 'exercise', 'break', 'meal'].includes(event.type))
    .reduce((total, event) => {
      return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime));
    }, 0);

  const totalBalanceMinutes = workMinutes + personalMinutes;
  const workLifeBalance = totalBalanceMinutes > 0 ? (personalMinutes / totalBalanceMinutes) * 100 : 50;

  const productivityInsights = {
    mostProductiveDay: format(mostProductiveDay.day, 'EEEE'),
    leastProductiveDay: format(leastProductiveDay.day, 'EEEE'),
    peakProductivityHours: peakHours,
    workLifeBalance
  };

  return {
    meetingDensity,
    freeTimeRatio,
    focusBlocks,
    productivityInsights
  };
}

/**
 * Generate actionable insights based on schedule metrics
 */
export function generateScheduleInsights(metrics: ScheduleMetrics): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = [];

  // Meeting density insights
  if (metrics.meetingDensity.meetingTimePercentage > 60) {
    insights.push({
      type: 'schedule_optimization',
      insight: `Your schedule is ${metrics.meetingDensity.meetingTimePercentage.toFixed(0)}% meetings. Consider blocking focus time to maintain productivity.`,
      priority: 'high',
      data: { meetingTimePercentage: metrics.meetingDensity.meetingTimePercentage }
    });
  }

  if (metrics.meetingDensity.averageMeetingDuration > 90) {
    insights.push({
      type: 'time_audit',
      insight: `Average meeting duration is ${Math.round(metrics.meetingDensity.averageMeetingDuration)} minutes. Consider shorter meetings to free up time.`,
      priority: 'medium',
      data: { averageMeetingDuration: metrics.meetingDensity.averageMeetingDuration }
    });
  }

  // Free time insights
  if (metrics.freeTimeRatio.freeTimePercentage < 20) {
    insights.push({
      type: 'schedule_optimization',
      insight: `You only have ${metrics.freeTimeRatio.freeTimePercentage.toFixed(0)}% free time. Consider decluttering your schedule to avoid burnout.`,
      priority: 'high',
      data: { freeTimePercentage: metrics.freeTimeRatio.freeTimePercentage }
    });
  } else if (metrics.freeTimeRatio.freeTimePercentage > 50) {
    insights.push({
      type: 'productivity_tip',
      insight: `You have ${metrics.freeTimeRatio.freeTimePercentage.toFixed(0)}% free time. Consider using some of this time for skill development or strategic planning.`,
      priority: 'low',
      data: { freeTimePercentage: metrics.freeTimeRatio.freeTimePercentage }
    });
  }

  // Focus time insights
  if (metrics.focusBlocks.focusTimePercentage < 15) {
    insights.push({
      type: 'schedule_optimization',
      insight: `Only ${metrics.focusBlocks.focusTimePercentage.toFixed(0)}% of your time is dedicated to focused work. Block more uninterrupted time for deep work.`,
      priority: 'high',
      data: { focusTimePercentage: metrics.focusBlocks.focusTimePercentage }
    });
  }

  if (metrics.focusBlocks.count < 3) {
    insights.push({
      type: 'productivity_tip',
      insight: `You have only ${metrics.focusBlocks.count} focus blocks this week. Try scheduling at least 3-4 focus blocks for better productivity.`,
      priority: 'medium',
      data: { focusBlockCount: metrics.focusBlocks.count }
    });
  }

  // Work-life balance insights
  if (metrics.productivityInsights.workLifeBalance < 30) {
    insights.push({
      type: 'time_audit',
      insight: `Work-life balance is low (${metrics.productivityInsights.workLifeBalance.toFixed(0)}% personal time). Schedule more breaks and personal activities.`,
      priority: 'high',
      data: { workLifeBalance: metrics.productivityInsights.workLifeBalance }
    });
  } else if (metrics.productivityInsights.workLifeBalance > 70) {
    insights.push({
      type: 'time_audit',
      insight: `Great work-life balance! You're dedicating ${metrics.productivityInsights.workLifeBalance.toFixed(0)}% of time to personal activities.`,
      priority: 'low',
      data: { workLifeBalance: metrics.productivityInsights.workLifeBalance }
    });
  }

  // Productivity insights
  if (metrics.productivityInsights.peakProductivityHours.length > 0) {
    insights.push({
      type: 'productivity_tip',
      insight: `Your most productive hours are ${metrics.productivityInsights.peakProductivityHours.join(', ')}. Schedule important tasks during these times.`,
      priority: 'medium',
      data: { peakHours: metrics.productivityInsights.peakProductivityHours }
    });
  }

  return insights;
}

/**
 * Store computed insights in the database
 */
export async function storeInsights(
  userId: string,
  insights: AnalyticsInsight[],
  date: string = new Date().toISOString().split('T')[0]
): Promise<void> {
  // This would typically be called from an API route or server action
  // The actual database insertion would be handled by the calling function
  // since this utility function doesn't have direct database access

  const insightsToStore = insights.map(insight => ({
    userId,
    insight: insight.insight,
    insightType: insight.type,
    date,
    priority: insight.priority,
    data: insight.data
  }));

  return insightsToStore;
}

/**
 * Get analytics summary for dashboard display
 */
export function getAnalyticsSummary(events: Event[]): {
  totalEvents: number;
  totalHours: number;
  averageEventsPerDay: number;
  meetingDensity: number;
  focusTimeRatio: number;
  freeTimeRatio: number;
} {
  const weekMetrics = calculateScheduleMetrics(events, 'week');

  return {
    totalEvents: events.length,
    totalHours: events.reduce((total, event) => {
      return total + differenceInMinutes(new Date(event.endTime), new Date(event.startTime)) / 60;
    }, 0),
    averageEventsPerDay: weekMetrics.meetingDensity.meetingsPerDay,
    meetingDensity: weekMetrics.meetingDensity.meetingTimePercentage,
    focusTimeRatio: weekMetrics.focusBlocks.focusTimePercentage,
    freeTimeRatio: weekMetrics.freeTimeRatio.freeTimePercentage
  };
}