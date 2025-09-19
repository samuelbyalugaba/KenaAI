
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
    BarChart as BarChartIcon,
    PieChart,
    Download
} from "lucide-react";
import type { UserProfile, Agent } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
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
import { getAgentsByCompany } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";


type TimeRange = "Today" | "This Week" | "This Month";

type MyPerformanceViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function MyPerformanceView({ onMenuClick, user }: MyPerformanceViewProps) {
  const [agentData, setAgentData] = React.useState<Agent | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<TimeRange>("Today");

  React.useEffect(() => {
    async function fetchData() {
        if (user?.companyId) {
            setIsLoading(true);
            const agents = await getAgentsByCompany(user.companyId);
            const currentAgent = agents.find(a => a.id === user.id);
            setAgentData(currentAgent || null);
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user]);

  const kpiData = React.useMemo(() => {
    if (!agentData) {
        return [
            { title: "Conversations Handled" },
            { title: "Avg. Response Time" },
            { title: "Resolution Rate" },
            { title: "CSAT Score" },
        ];
    }
    
    let conversations = agentData.conversationsToday || 0;
    let responseTime = agentData.avgResponseTime || 'N/A';
    let csat = agentData.csat || 0;
    let resolutionRate = "N/A"; // Not available from DB

    if (timeRange === "This Week") {
        conversations = conversations * 5 + Math.floor(Math.random() * 10);
        resolutionRate = "91%"; // simulated
    } else if (timeRange === "This Month") {
        conversations = conversations * 20 + Math.floor(Math.random() * 50);
        resolutionRate = "93%"; // simulated
    }

    if (conversations === 0) {
        responseTime = "N/A";
        csat = 0;
        resolutionRate = "N/A";
    }

    const csatScore = (csat / 100) * 5;

    return [
      {
        title: "Conversations Handled",
        value: conversations.toString(),
        description: `conversations ${timeRange.toLowerCase()}`,
        trend: "+12%", // Mock trend
        trendDirection: "up" as const,
        icon: MessageSquare,
      },
      {
        title: "Avg. Response Time",
        value: responseTime,
        description: `${timeRange.toLowerCase()}'s average ⏱️`,
        trend: "-3.5%", // Mock trend
        trendDirection: "down" as const,
        icon: Clock,
      },
      {
        title: "Resolution Rate",
        value: resolutionRate,
        description: "data not available",
        trend: "+0.0%",
        trendDirection: "up" as const,
        icon: CheckCircle,
      },
      {
        title: "CSAT Score",
        value: csat > 0 ? `${csatScore.toFixed(1)}/5` : 'N/A',
        description: `based on ${timeRange.toLowerCase()}'s ratings ⭐`,
        trend: "+0.2", // Mock trend
        trendDirection: "up" as const,
        icon: Star,
      },
    ];
  }, [agentData, timeRange]);

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
             <Button variant={timeRange === 'Today' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange("Today")}>Today</Button>
             <Button variant={timeRange === 'This Week' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange("This Week")}>This Week</Button>
             <Button variant={timeRange === 'This Month' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange("This Month")}>This Month</Button>
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
            <h2 className="text-xl font-bold">{timeRange}'s Stats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                         <Card key={i}>
                            <CardHeader className="pb-2"><Skeleton className="h-4 w-2/3" /></CardHeader>
                            <CardContent>
                                <Skeleton className="h-7 w-1/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-3/4 mt-2" />
                            </CardContent>
                        </Card>
                    ))
                ) : kpiData.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    {kpi.icon && <kpi.icon className="h-4 w-4 text-muted-foreground" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.description}</p>
                         <p className={cn("text-xs mt-2 flex items-center", kpi.trendDirection === 'up' ? "text-emerald-500" : "text-red-500")}>
                            {kpi.trendDirection === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {kpi.trend} from last period
                        </p>
                    </CardContent>
                </Card>
                ))}
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
