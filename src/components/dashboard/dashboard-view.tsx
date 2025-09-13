
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
    ArrowDown,
    Activity,
    Users2,
    BarChartIcon,
    PieChartIcon,
    File,
    Download,
    Mail,
    AlertTriangle
} from "lucide-react";
import type { UserProfile, AgentPerformance } from "@/types";
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
  Legend,
  Cell
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { mockAgentPerformance } from "@/lib/mock-data";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "@/components/ui/label";


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

const AgentPerformanceTable = ({ agents }: { agents: AgentPerformance[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Conversations</TableHead>
                <TableHead className="text-center">Avg. Response</TableHead>
                <TableHead className="text-right">Resolution Rate</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {agents.map((perf) => (
                <TableRow key={perf.agent.id}>
                    <TableCell className="font-bold text-lg">{perf.rank}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={perf.agent.avatar} alt={perf.agent.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{perf.agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{perf.agent.name}</div>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{perf.conversations}</TableCell>
                    <TableCell className="text-center">{perf.avgResponseTime}</TableCell>
                    <TableCell className="text-right">{perf.resolutionRate}%</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


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
            <Card className="lg:col-span-5">
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
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Conversation by Source</CardTitle>
                    <CardDescription>Breakdown of conversations by channel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={channelBreakdownConfig} className="h-[250px] w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={channelBreakdownData} dataKey="value" nameKey="name" >
                                {channelBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Agent Performance */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Agent Performance</CardTitle>
                    <CardDescription>Leaderboard of agent efficiency and resolution rates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AgentPerformanceTable agents={mockAgentPerformance} />
                </CardContent>
            </Card>
             {/* Customer Engagement */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Engagement</CardTitle>
                    <CardDescription>Metrics on customer interaction and loyalty.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">New vs Returning Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold">350</p>
                                <p className="text-sm text-muted-foreground">New</p>
                            </div>
                             <div className="text-center">
                                <p className="text-2xl font-bold">895</p>
                                <p className="text-sm text-muted-foreground">Returning</p>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-center text-sm text-muted-foreground pt-4">Campaign & Funnel analytics coming soon.</p>
                </CardContent>
            </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Export and Reporting */}
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Export &amp; Reporting</CardTitle>
                    <CardDescription>Generate and schedule custom reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" /> CSV</Button>
                        <Button variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" /> Excel</Button>
                        <Button variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" /> PDF</Button>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                        <Label htmlFor="report-frequency">Schedule Email Reports</Label>
                        <div className="flex gap-2">
                            <Select defaultValue="weekly">
                                <SelectTrigger id="report-frequency" className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="flex-shrink-0"><Mail className="mr-2 h-4 w-4" /> Schedule</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

             {/* Smart Alerts */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Smart Alerts</CardTitle>
                    <CardDescription>Real-time notifications and AI-powered suggestions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Spike in Negative Sentiment!</AlertTitle>
                        <AlertDescription>
                            Negative customer sentiment has increased by 35% in the last hour.
                        </AlertDescription>
                    </Alert>
                    <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertTitle>Response Times Exceeding SLA</AlertTitle>
                        <AlertDescription>
                           Average response time is currently 5m 42s, exceeding the 3m target.
                        </AlertDescription>
                    </Alert>
                    <Alert>
                        <Bot className="h-4 w-4" />
                        <AlertTitle>AI Training Suggestion</AlertTitle>
                        <AlertDescription>
                            Your bot missed 28 intents related to "shipping costs" this week. Consider adding a new training phrase.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>

      </main>
    </div>
  );
}
