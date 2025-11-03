"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, Calendar, BarChart3, LogIn, UserPlus, Clock, Target, Zap, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <ThemeToggle />
          </div>

          {/* Hero Section */}
          <div className="text-center px-4 pt-16 pb-20 sm:pt-24 sm:pb-32">
            {/* Animated icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Main title with enhanced typography */}
            <div className="max-w-4xl mx-auto mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent leading-tight">
                  Master Your Time
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight">
                  with AI
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  AI Schedule Auditor
                </h2>
              </div>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Transform chaos into clarity. Your AI-powered time management assistant analyzes patterns, optimizes schedules, and helps you reclaim precious hours.
              </p>

              {/* Stats bar */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">10+</div>
                  <div className="text-sm text-muted-foreground">Hours Saved Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">85%</div>
                  <div className="text-sm text-muted-foreground">Productivity Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Assistant</div>
                </div>
              </div>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild size="lg" className="text-base px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link href="/sign-up">
                    <UserPlus className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 py-4 border-2 hover:bg-accent transition-all duration-300">
                  <Link href="/sign-in">
                    <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                No credit card required • Setup in 2 minutes • Cancel anytime
              </p>
            </div>
          </div>

          {/* Enhanced Features Section */}
          <main className="container mx-auto px-4 sm:px-6 pb-20 max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Everything you need to master your schedule</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful AI-driven tools that work together to transform how you manage time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">AI Chat Assistant</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Natural conversation</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Simply tell your AI assistant about your day, goals, and challenges. Get personalized insights and actionable recommendations to optimize your time management.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span>Available 24/7</span>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Smart Calendar</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Intelligent scheduling</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  View your schedule with intuitive color-coding and smart patterns. Automatically identify time conflicts, optimize meeting blocks, and find pockets of productive time.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Target className="w-4 h-4" />
                  <span>Goal-oriented planning</span>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Time Analytics</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Data-driven insights</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Get comprehensive analytics on how you spend your time. Track productivity trends, meeting efficiency, and discover opportunities to reclaim hours in your week.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <Zap className="w-4 h-4" />
                  <span>Real-time optimization</span>
                </div>
              </Card>
            </div>

            {/* Trust indicators */}
            <div className="text-center py-12 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by professionals who value their time
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">1000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Enterprise Ready</span>
                </div>
              </div>
            </div>
          </main>
        </div>
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