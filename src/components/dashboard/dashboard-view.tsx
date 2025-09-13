
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Funnel, FunnelChart, LabelList, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Users, Clock, Smile, Frown, Meh, Bot, UserCheck, DollarSign, Award, TrendingUp, TrendingDown, CheckCircle, Target, GitBranch, AlertCircle, Timer, PanelLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { AgentPerformance, UserProfile } from "@/types";
import { Button } from "../ui/button";
import { mockAgents, mockAgentPerformance } from "@/lib/mock-data";

const chatData = [
  { name: 'Jan', conversations: 4000, resolutionTime: 24 },
  { name: 'Feb', conversations: 3000, resolutionTime: 14 },
  { name: 'Mar', conversations: 2000, resolutionTime: 98 },
  { name: 'Apr', conversations: 2780, resolutionTime: 39 },
  { name: 'May', conversations: 1890, resolutionTime: 48 },
  { name: 'Jun', conversations: 2390, resolutionTime: 38 },
  { name: 'Jul', conversations: 3490, resolutionTime: 43 },
];

const sentimentData = [
  { name: 'Positive', value: 400, fill: "hsl(var(--chart-2))", icon: Smile },
  { name: 'Neutral', value: 300, fill: "hsl(var(--chart-4))", icon: Meh },
  { name: 'Negative', value: 150, fill: "hsl(var(--chart-5))", icon: Frown },
];

const kpiData = [
    { title: "Total Conversations", value: "1,234", icon: MessageSquare, change: "+12.5%", changeType: "increase" as const },
    { title: "Avg. Resolution Time", value: "2m 15s", icon: Clock, change: "-3.2%", changeType: "decrease" as const },
    { title: "First Response Time", value: "45s", icon: Clock, change: "+8.1%", changeType: "increase" as const },
    { title: "Resolution Rate", value: "89%", icon: CheckCircle, change: "+5.0%", changeType: "increase" as const },
];

const chatbotKpiData = [
    { title: "Bot Resolution Rate", value: "78%", icon: Target, change: "+5.2%", changeType: "increase" as const },
    { title: "Handoff to Agent Rate", value: "22%", icon: GitBranch, change: "-1.5%", changeType: "decrease" as const },
    { title: "Fallback Rate", value: "8%", icon: AlertCircle, change: "+0.5%", changeType: "increase" as const },
    { title: "Avg. Bot Response Time", value: "2.1s", icon: Timer, change: "-0.2s", changeType: "decrease" as const },
];

const popularIntentsData = [
  { name: 'Track Order', count: 580, fill: "hsl(var(--chart-1))" },
  { name: 'Payment Issue', count: 420, fill: "hsl(var(--chart-2))" },
  { name: 'Return Policy', count: 350, fill: "hsl(var(--chart-3))" },
  { name: 'Product Info', count: 280, fill: "hsl(var(--chart-4))" },
  { name: 'Business Hours', count: 190, fill: "hsl(var(--chart-5))" },
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
      <header className="flex items-start sm:items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-2xl font-bold">Dashboard & Analytics</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agent-performance">Agent Performance</TabsTrigger>
            <TabsTrigger value="chatbot-analytics">Chatbot Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map(kpi => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className={`text-xs flex items-center gap-1 ${kpi.changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {kpi.changeType === 'increase' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {kpi.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Conversation Volume</CardTitle>
                        <CardDescription>Monthly conversations and average resolution time (in minutes).</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chatData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                    }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="conversations" fill="hsl(var(--chart-1))" name="Conversations" />
                                <Bar yAxisId="right" dataKey="resolutionTime" fill="hsl(var(--chart-2))" name="Avg. Resolution (min)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                        <CardDescription>Overall sentiment of customer messages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                    }}
                                />
                                <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
          <TabsContent value="agent-performance" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Agent Leaderboard</CardTitle>
                    <CardDescription>Top performing agents based on key metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>Agent</TableHead>
                                <TableHead className="text-center">Conversations Handled</TableHead>
                                <TableHead className="text-center">Avg. Response Time</TableHead>
                                <TableHead className="text-center">Resolution Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAgentPerformance.map(data => (
                                <TableRow key={data.agent.id}>
                                    <TableCell className="text-center text-lg font-bold">{data.rank === 1 ? <Award className="text-yellow-500 h-6 w-6 mx-auto" /> : data.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={data.agent.avatar} alt={data.agent.name} data-ai-hint="person portrait" />
                                                <AvatarFallback>{data.agent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{data.agent.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">{data.conversations}</TableCell>
                                    <TableCell className="text-center">{data.avgResponseTime}</TableCell>
                                    <TableCell className="text-center text-emerald-600 font-semibold">{data.resolutionRate}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
          </TabsContent>
          <TabsContent value="chatbot-analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {chatbotKpiData.map(kpi => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className={`text-xs flex items-center gap-1 ${kpi.changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {kpi.changeType === 'increase' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {kpi.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Intents</CardTitle>
                        <CardDescription>Top queries handled by the chatbot.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={popularIntentsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} tickLine={false} axisLine={false}/>
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))' }}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                    }}
                                />
                                <Bar dataKey="count" name="Times Triggered" fill="hsl(var(--chart-1))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Chatbot Engagement</CardTitle>
                        <CardDescription>A summary of how users interact with the bot.</CardDescription>
                    </CardHeader>
                     <CardContent className="text-center text-muted-foreground pt-8">
                        <p>Engagement funnel chart coming soon.</p>
                        <p>(Will be implemented without a funnel chart component as requested).</p>
                    </CardContent>
                </Card>
              </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

    