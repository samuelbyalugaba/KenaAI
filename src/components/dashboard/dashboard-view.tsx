
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
    FileText,
    Calendar,
    MessageSquare,
    Users,
    Clock,
    Smile,
    UserCheck,
    Bot,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import type { UserProfile } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


const kpiData = [
  {
    title: "Total Conversations",
    value: "1,245",
    trend: "+15.2%",
    trendDirection: "up" as const,
    icon: MessageSquare,
  },
  {
    title: "Bot vs Agent Conversations",
    value: "70% / 30%",
    trend: "+3.1% Bot",
    trendDirection: "up" as const,
    icon: Bot,
  },
  {
    title: "Average Response Time",
    value: "2m 13s",
    trend: "-5.8%",
    trendDirection: "down" as const,
    icon: Clock,
  },
  {
    title: "Customer Satisfaction (CSAT)",
    value: "89%",
    trend: "+2.5%",
    trendDirection: "up" as const,
    icon: Smile,
  },
  {
    title: "Agent Availability",
    value: "15 Active",
    trend: "+1",
    trendDirection: "up" as const,
    icon: UserCheck,
  },
];

const conversationVolumeData = [
  { date: "Mon", conversations: 150 },
  { date: "Tue", conversations: 210 },
  { date: "Wed", conversations: 180 },
  { date: "Thu", conversations: 250 },
  { date: "Fri", conversations: 220 },
  { date: "Sat", conversations: 300 },
  { date: "Sun", conversations: 280 },
];

const channelBreakdownData = [
    { name: 'WhatsApp', value: 400, fill: 'var(--color-whatsapp)' },
    { name: 'Facebook', value: 300, fill: 'var(--color-facebook)' },
    { name: 'Instagram', value: 300, fill: 'var(--color-instagram)' },
    { name: 'Email', value: 200, fill: 'var(--color-email)' },
];

const channelBreakdownConfig = {
  whatsapp: { label: 'WhatsApp', color: '#25D366' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  instagram: { label: 'Instagram', color: '#E4405F' },
  email: { label: 'Email', color: '#EA4335' },
}

type DashboardViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function DashboardView({ onMenuClick, user }: DashboardViewProps) {
  if (user?.role !== 'admin') {
      return (
          <div className="flex h-screen w-full flex-col bg-background text-foreground">
             <header className="flex items-start sm:items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Permission Required</CardTitle>
                        <CardDescription>
                            You do not have permission to view the dashboard. This area is restricted to administrators only.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </main>
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-2xl font-bold">Analytics / Reports</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" /> Date Range</Button>
            <Button className="gap-2"><FileText className="h-4 w-4" /> Export Report</Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-4">
        {/* Section 1: Top KPI Cards */}
        <section>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {kpiData.map((kpi) => (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={cn("text-xs text-muted-foreground flex items-center", kpi.trendDirection === 'up' ? "text-emerald-500" : "text-red-500")}>
                    {kpi.trendDirection === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {kpi.trend} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Section 2: Conversation Insights */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Conversation Volume</CardTitle>
                    <CardDescription>Volume of conversations over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[250px] w-full">
                         <LineChart data={conversationVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Conversation by Source</CardTitle>
                    <CardDescription>Breakdown of conversations by channel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={channelBreakdownConfig} className="h-[250px] w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={channelBreakdownData} dataKey="value" nameKey="name" />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>

      </main>
    </div>
  );
}
