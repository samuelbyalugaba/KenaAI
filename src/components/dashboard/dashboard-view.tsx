
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
    BarChartIcon,
    PieChartIcon,
    File,
    Download,
    Mail,
    AlertTriangle,
    Star,
    TrendingUp
} from "lucide-react";
import type { UserProfile, AgentPerformance } from "@/types";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { mockAgentPerformance } from "@/lib/mock-data";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { KenaAILogo } from "../ui/kena-ai-logo";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";


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
    { name: 'WhatsApp', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Facebook', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Instagram', value: 300, fill: 'hsl(var(--chart-3))' },
    { name: 'Email', value: 200, fill: 'hsl(var(--chart-4))' },
];

const channelBreakdownConfig = {
  value: {
    label: "Conversations",
  },
  WhatsApp: {
    label: "WhatsApp",
    color: "hsl(var(--chart-1))",
  },
  Facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-2))",
  },
  Instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-3))",
  },
  Email: {
    label: "Email",
    color: "hsl(var(--chart-4))",
  },
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
      <header className="flex items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <KenaAILogo className="h-8 hidden sm:block" />
            <h1 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex gap-2"><Calendar className="h-4 w-4" /> Date Range</Button>
            <Button variant="outline" size="icon" className="sm:hidden"><Calendar className="h-4 w-4" /></Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="hidden sm:flex gap-2"><Download className="h-4 w-4" /> Export Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><File className="mr-2 h-4 w-4" /> Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Export as CSV</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <div className="px-2 py-1.5">
                            <Label htmlFor="report-email" className="text-xs font-semibold">Schedule Email Report</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="report-email" type="email" placeholder="your@email.com" className="h-8 flex-1" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Select defaultValue="weekly">
                                    <SelectTrigger className="h-8 flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button size="sm">Schedule</Button>
                            </div>
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" className="sm:hidden"><Download className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><File className="mr-2 h-4 w-4" /> Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Export as CSV</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <div className="px-2 py-1.5">
                            <Label htmlFor="report-email-mobile" className="text-xs font-semibold">Schedule Email Report</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="report-email-mobile" type="email" placeholder="your@email.com" className="h-8 flex-1" />
                            </div>
                             <div className="flex items-center gap-2 mt-2">
                                <Select defaultValue="weekly">
                                    <SelectTrigger className="h-8 flex-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button size="sm">Schedule</Button>
                            </div>
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">

        {/* Section 1: Key Metrics */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Key Metrics</h2>
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
        </div>

        {/* Section 2: Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            <div className="lg:col-span-2 space-y-8">
                {/* Conversation Insights */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Conversation Insights</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Conversation Volume</CardTitle>
                            <CardDescription>Volume of conversations over the last 7 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                <LineChart data={conversationVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Agent Performance */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Agent Performance</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Agent Leaderboard</CardTitle>
                            <CardDescription>Ranking agents by efficiency and resolution rates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AgentPerformanceTable agents={mockAgentPerformance} />
                        </CardContent>
                    </Card>
                </div>

                 {/* Chatbot Analysis */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Chatbot Analysis</h2>
                     <Card>
                        <CardHeader>
                            <CardTitle>Unanswered Queries</CardTitle>
                            <CardDescription>Log of queries the chatbot could not resolve.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">Unanswered queries log is under construction.</p>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <div className="lg:col-span-1 space-y-8">

                 {/* Smart Alerts */}
                <div>
                <h2 className="text-2xl font-bold mb-4">Smart Alerts</h2>
                <div className="space-y-3">
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
                </div>
                </div>

                {/* Conversation Breakdown */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Conversation Sources</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Breakdown by Channel</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ChartContainer config={channelBreakdownConfig} className="h-[250px] w-full">
                                <BarChart data={channelBreakdownData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickMargin={10}
                                        tickFormatter={(value) => channelBreakdownConfig[value as keyof typeof channelBreakdownConfig]?.label}
                                    />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" radius={4}>
                                         {channelBreakdownData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer Engagement */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Customer Engagement</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>New vs Returning</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-3xl font-bold">350</p>
                                <p className="text-sm text-muted-foreground">New</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">895</p>
                                <p className="text-sm text-muted-foreground">Returning</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}
