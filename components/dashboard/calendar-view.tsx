"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";
import { Event } from "@/db";

interface CalendarViewProps {
  events: Event[];
}

const getEventTypeColor = (type: string) => {
  const colors = {
    meeting: "bg-blue-500",
    work: "bg-purple-500",
    focus: "bg-green-500",
    break: "bg-yellow-500",
    exercise: "bg-orange-500",
    meal: "bg-pink-500",
    personal: "bg-indigo-500",
    other: "bg-gray-500",
  };
  return colors[type as keyof typeof colors] || colors.other;
};

export function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  // Create calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = events.filter(event => {
        const eventDate = parseISO(event.date.toString());
        return isSameDay(cloneDay, eventDate);
      });

      days.push(
        <div
          className={`relative border border-border p-2 min-h-[80px] cursor-pointer transition-colors hover:bg-muted/50 ${
            !isSameMonth(day, monthStart)
              ? "bg-muted/30 text-muted-foreground"
              : "bg-background"
          } ${selectedDate && isSameDay(day, selectedDate) ? "ring-2 ring-primary" : ""}`}
          key={day.toString()}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <div className="text-sm font-medium mb-1">
            {format(day, dateFormat)}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className="text-xs p-1 rounded text-white truncate flex items-center gap-1"
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              >
                <Clock className="h-2 w-2" />
                {format(event.startTime, "HH:mm")} {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter(event => {
        const eventDate = parseISO(event.date.toString());
        return isSameDay(selectedDate, eventDate);
      })
    : [];

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-sm font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {rows}
          </div>

          {/* Selected date events */}
          {selectedDate && selectedDateEvents.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">
                {format(selectedDate, "MMMM d, yyyy")} Events
              </h4>
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-background rounded border">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEventTypeColor(event.type) }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}