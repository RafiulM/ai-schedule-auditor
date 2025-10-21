"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, PieChart, Clock, TrendingUp, Target, Zap } from "lucide-react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { Event } from "@/db";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface MetricsChartProps {
  events: Event[];
}

const getEventTypeColor = (type: string) => {
  const colors = {
    meeting: "#3B82F6",
    work: "#A855F7",
    focus: "#10B981",
    break: "#F59E0B",
    exercise: "#F97316",
    meal: "#EC4899",
    personal: "#6366F1",
    other: "#6B7280",
  };
  return colors[type as keyof typeof colors] || colors.other;
};

export function MetricsChart({ events }: MetricsChartProps) {
  // Calculate total hours per event type
  const eventTypeData = events.reduce((acc, event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (!acc[event.type]) {
      acc[event.type] = { type: event.type, hours: 0, count: 0 };
    }
    acc[event.type].hours += hours;
    acc[event.type].count += 1;

    return acc;
  }, {} as Record<string, { type: string; hours: number; count: number }>);

  const pieData = Object.values(eventTypeData).map(item => ({
    name: item.type,
    value: Math.round(item.hours * 10) / 10,
    count: item.count
  }));

  // Daily hours for the past week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const dailyData = weekDays.map(day => {
    const dayEvents = events.filter(event => {
      const eventDate = parseISO(event.date.toString());
      return eventDate.toDateString() === day.toDateString();
    });

    const totalHours = dayEvents.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    return {
      day: format(day, "EEE"),
      hours: Math.round(totalHours * 10) / 10,
      events: dayEvents.length
    };
  });

  // Calculate metrics
  const totalHours = events.reduce((total, event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  const averageEventDuration = events.length > 0
    ? totalHours / events.length
    : 0;

  const mostProductiveDay = dailyData.reduce((max, day) =>
    day.hours > max.hours ? day : max, dailyData[0] || { day: "N/A", hours: 0 });

  const workLifeBalance = events.reduce((acc, event) => {
    if (event.type === 'work' || event.type === 'meeting') {
      acc.work += (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60);
    } else if (event.type === 'personal' || event.type === 'exercise' || event.type === 'break') {
      acc.personal += (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60 * 60);
    }
    return acc;
  }, { work: 0, personal: 0 });

  const totalWorkLifeHours = workLifeBalance.work + workLifeBalance.personal;
  const workPercentage = totalWorkLifeHours > 0 ? (workLifeBalance.work / totalWorkLifeHours) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-medium">Total Hours</h4>
            </div>
            <div className="text-2xl font-bold">{Math.round(totalHours * 10) / 10}h</div>
            <p className="text-xs text-muted-foreground">
              Across {events.length} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-medium">Avg Duration</h4>
            </div>
            <div className="text-2xl font-bold">{Math.round(averageEventDuration * 10) / 10}h</div>
            <p className="text-xs text-muted-foreground">
              Per event
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <h4 className="text-sm font-medium">Most Active</h4>
            </div>
            <div className="text-2xl font-bold">{mostProductiveDay.day}</div>
            <p className="text-xs text-muted-foreground">
              {mostProductiveDay.hours} hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <h4 className="text-sm font-medium">Work-Life Balance</h4>
            </div>
            <div className="space-y-2">
              <Progress value={workPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(workPercentage)}% work activities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Distribution by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Time Distribution by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}h`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getEventTypeColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </ReChartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Activity (This Week)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.some(day => day.hours > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="bg-background border rounded p-2">
                            <p className="text-sm">{`${payload[0].payload.day}: ${payload[0].value} hours`}</p>
                            <p className="text-xs text-muted-foreground">{`${payload[0].payload.events} events`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No activity recorded this week
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}