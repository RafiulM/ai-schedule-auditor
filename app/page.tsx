"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, Calendar, BarChart3, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { MyAssistant } from "@/components/chat-assistant";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isPending || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center py-12 sm:py-16 relative px-4">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <ThemeToggle />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              AI Schedule Auditor
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mb-8">
            Transform your daily routine with AI-powered time management. Chat with your personal assistant to audit, optimize, and master your schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-base px-8 py-3">
              <Link href="/sign-up">
                <UserPlus className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-3">
              <Link href="/sign-in">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-8 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-lg">AI Chat Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Tell your AI assistant about your schedule and daily activities. Get personalized insights and recommendations to optimize your time.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-lg">Smart Calendar</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View your daily schedule with color-coded events. See how your time is allocated and identify patterns in your routine.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200/50 dark:border-purple-700/30">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-lg">Time Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get detailed insights about how you spend your time. Track productivity, meeting density, and find opportunities for improvement.
              </p>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // If user is authenticated, show the chat interface
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">AI Schedule Auditor</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <Calendar className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-8rem)] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Your AI Time Management Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Tell me about your schedule, daily activities, or time management goals. I&apos;ll help you optimize your routine!
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <MyAssistant />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}