"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Lightbulb, Clock, TrendingUp, Users, Coffee, Activity, Utensils, User } from "lucide-react";
import { format, differenceInDays, startOfDay, endOfDay } from "date-fns";
import { Event } from "@/db";

interface SummaryCardsProps {
  events: Event[];
  weeklyEvents: Event[];
  insights: any[];
}

const getEventTypeColor = (type: string) => {
  const colors = {
    meeting: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    work: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    focus: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    break: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    exercise: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    meal: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
    personal: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  };
  return colors[type as keyof typeof colors] || colors.other;
};

const getEventTypeIcon = (type: string) => {
  const icons = {
    meeting: Users,
    work: TrendingUp,
    focus: Clock,
    break: Coffee,
    exercise: Activity,
    meal: Utensils,
    personal: User,
    other: Calendar,
  };
  return icons[type as keyof typeof icons] || Calendar;
};

export function SummaryCards({ events, weeklyEvents, insights }: SummaryCardsProps) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Calculate metrics
  const totalEvents = events.length;
  const monthlyEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfMonth && eventDate <= endOfMonth;
  }).length;

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === today.toDateString();
  }).length;

  const weeklyTotalEvents = weeklyEvents.length;
  const totalScheduledHours = weeklyEvents.reduce((total, event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  // Get most common event type
  const eventTypeCount = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonEventType = Object.entries(eventTypeCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'other';

  const MostCommonIcon = getEventTypeIcon(mostCommonEventType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            {monthlyEvents} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayEvents}</div>
          <p className="text-xs text-muted-foreground">
            Events scheduled today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyTotalEvents}</div>
          <p className="text-xs text-muted-foreground">
            {totalScheduledHours.toFixed(1)} hours scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <MostCommonIcon className="h-3 w-3" />
            <Badge className={getEventTypeColor(mostCommonEventType)}>
              {mostCommonEventType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}