
"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    PanelLeft,
    ArrowUp,
    ArrowDown,
    Calendar,
    MessageSquare,
    Clock,
    CheckCircle,
    Star,
    Flame,
    BarChart,
    PieChart,
    Download
} from "lucide-react";
import type { UserProfile } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { KenaAILogo } from "../ui/kena-ai-logo";

const kpiData = [
  {
    title: "Conversations Handled",
    value: "52",
    description: "conversations today",
    trend: "+12%",
    trendDirection: "up" as const,
    icon: MessageSquare,
  },
  {
    title: "Avg. Response Time",
    value: "12s",
    description: "on average ⏱️",
    trend: "-3.5%",
    trendDirection: "down" as const,
    icon: Clock,
  },
  {
    title: "Resolution Rate",
    value: "88%",
    description: "conversations resolved ✅",
    trend: "+2.1%",
    trendDirection: "up" as const,
    icon: CheckCircle,
  },
  {
    title: "CSAT Score",
    value: "4.6/5",
    description: "from 15 ratings ⭐",
    trend: "+0.2",
    trendDirection: "up" as const,
    icon: Star,
  },
];

const conversationData = [
  { date: "Mon", conversations: 8 },
  { date: "Tue", conversations: 12 },
  { date: "Wed", conversations: 7 },
  { date: "Thu", conversations: 15 },
  { date: "Fri", conversations: 11 },
  { date: "Sat", conversations: 5 },
  { date: "Sun", conversations: 9 },
];

const responseTimeByChannelData = [
    { channel: "WhatsApp", time: 10, fill: 'hsl(var(--chart-1))' },
    { channel: "Facebook", time: 15, fill: 'hsl(var(--chart-2))' },
    { channel: "Instagram", time: 8, fill: 'hsl(var(--chart-3))' },
    { channel: "Email", time: 35, fill: 'hsl(var(--chart-4))' },
];


type MyPerformanceViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function MyPerformanceView({ onMenuClick, user }: MyPerformanceViewProps) {

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold">Hi, {user?.name.split(" ")[0]} 👋 Here’s your performance</h1>
                <p className="text-sm text-muted-foreground">Welcome to your personal performance dashboard.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
             <Button variant="outline" size="sm">Today</Button>
             <Button variant="ghost" size="sm">This Week</Button>
             <Button variant="ghost" size="sm">This Month</Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        <Alert className="bg-accent/20 border-accent/50 text-accent-foreground">
            <Flame className="h-4 w-4" />
            <AlertTitle className="font-semibold">You're on fire! 🔥</AlertTitle>
            <AlertDescription>
                You're in the top 3 fastest responders this week! Keep up the great work.
            </AlertDescription>
        </Alert>
        
        {/* Section 1: Key Metrics */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Today's Stats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.description}</p>
                         <p className={cn("text-xs mt-2 flex items-center", kpi.trendDirection === 'up' ? "text-emerald-500" : "text-red-500")}>
                            {kpi.trendDirection === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {kpi.trend} from yesterday
                        </p>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>

        {/* Section 2: Performance Insights */}
        <div className="space-y-4">
             <h2 className="text-xl font-bold">Performance Insights</h2>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Conversation Volume</CardTitle>
                        <CardDescription>Your conversation volume over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <LineChart data={conversationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                        </LineChart>
                    </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Response Speed by Channel</CardTitle>
                        <CardDescription>Average response time (seconds).</CardDescription>
                    </CardHeader>
                     <CardContent>
                           <ChartContainer config={{}} className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={responseTimeByChannelData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="channel" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                        <Bar dataKey="time" radius={5}>
                                            {responseTimeByChannelData.map((entry) => (
                                                <Cell key={`cell-${entry.channel}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                </Card>
             </div>
        </div>

        {/* Section 3: Leaderboard and Feedback */}
         <div className="space-y-4">
             <h2 className="text-xl font-bold">Team & Feedback</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Team Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-center text-sm text-muted-foreground p-8">Leaderboard coming soon!</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Customer Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-center text-sm text-muted-foreground p-8">Customer feedback section coming soon!</p>
                    </CardContent>
                </Card>
             </div>
         </div>


      </main>
    </div>
  );
}
