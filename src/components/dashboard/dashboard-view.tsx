
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
    Bot
} from "lucide-react";
import type { UserProfile } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


const kpiData = [
  {
    title: "Total Conversations",
    value: "1,245",
    trend: "+15.2%",
    trendColor: "text-emerald-500",
    icon: MessageSquare,
  },
  {
    title: "Bot vs Agent Conversations",
    value: "70% / 30%",
    trend: "+3.1%",
    trendColor: "text-emerald-500",
    icon: Bot,
  },
  {
    title: "Average Response Time",
    value: "2m 13s",
    trend: "-5.8%",
    trendColor: "text-red-500",
    icon: Clock,
  },
  {
    title: "Customer Satisfaction (CSAT)",
    value: "89%",
    trend: "+2.5%",
    trendColor: "text-emerald-500",
    icon: Smile,
  },
  {
    title: "Agent Availability",
    value: "15 Active",
    trend: "+1",
    trendColor: "text-emerald-500",
    icon: UserCheck,
  },
];


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
                  <p className={cn("text-xs text-muted-foreground", kpi.trendColor)}>
                    {kpi.trend} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Other sections will be built here */}
      </main>
    </div>
  );
}
