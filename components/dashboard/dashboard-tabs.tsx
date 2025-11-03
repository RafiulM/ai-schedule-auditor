"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { MetricsChart } from "@/components/dashboard/metrics-chart";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { Event } from "@/db";
import { Calendar, BarChart3, Key, MessageSquare, Lightbulb } from "lucide-react";
import { format } from "date-fns";

interface DashboardTabsProps {
  monthlyEvents: Event[];
  weeklyEvents: Event[];
  recentMessages: Array<{ id: string; message: string; role: string; timestamp: Date }>;
  recentInsights: Array<{ id: string; insight: string; createdAt: Date }>;
}

export function DashboardTabs({
  monthlyEvents,
  weeklyEvents,
  recentMessages,
  recentInsights
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="api-keys" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Keys
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar View */}
          <CalendarView events={monthlyEvents} />

          {/* Recent Activity Section */}
          <div className="space-y-6">
            {/* Recent Chat Messages */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Chat History
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentMessages.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No chat history yet</p>
                ) : (
                  recentMessages.map((message) => (
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
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Insights
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentInsights.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No insights yet. Start chatting with the AI!</p>
                ) : (
                  recentInsights.map((insight) => (
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
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <MetricsChart events={weeklyEvents} />
      </TabsContent>

      <TabsContent value="api-keys" className="space-y-6">
        <ApiKeyManager />
      </TabsContent>
    </Tabs>
  );
}