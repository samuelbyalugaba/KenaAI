
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Funnel, FunnelChart, LabelList, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Users, Clock, Smile, Frown, Meh, Bot, UserCheck, DollarSign } from "lucide-react";

const chatData = [
  { name: 'Jan', chats: 4000, resolutionTime: 2400 },
  { name: 'Feb', chats: 3000, resolutionTime: 1398 },
  { name: 'Mar', chats: 2000, resolutionTime: 9800 },
  { name: 'Apr', chats: 2780, resolutionTime: 3908 },
  { name: 'May', chats: 1890, resolutionTime: 4800 },
  { name: 'Jun', chats: 2390, resolutionTime: 3800 },
  { name: 'Jul', chats: 3490, resolutionTime: 4300 },
];

const sentimentData = [
  { name: 'Positive', value: 400, fill: "hsl(var(--chart-2))" },
  { name: 'Neutral', value: 300, fill: "hsl(var(--chart-4))" },
  { name: 'Negative', value: 150, fill: "hsl(var(--chart-5))" },
];

const kpiData = [
    { title: "Total Conversations", value: "1,234", icon: MessageSquare, change: "+12.5%" },
    { title: "Avg. Resolution Time", value: "2m 15s", icon: Clock, change: "-3.2%" },
    { title: "First Response Time", value: "45s", icon: Clock, change: "+8.1%" },
    { title: "Active Agents", value: "5", icon: Users, change: "+1" },
];

const conversionData = [
    { name: 'Jan', conversions: 120 },
    { name: 'Feb', conversions: 150 },
    { name: 'Mar', conversions: 130 },
    { name: 'Apr', conversions: 180 },
    { name: 'May', conversions: 160 },
    { name: 'Jun', conversions: 210 },
];

const funnelData = [
    { value: 1000, name: 'Total Chats', fill: 'hsl(var(--chart-1))' },
    { value: 750, name: 'Chatbot Engaged', fill: 'hsl(var(--chart-2))' },
    { value: 350, name: 'Human Agent', fill: 'hsl(var(--chart-3))' },
    { value: 210, name: 'Conversion', fill: 'hsl(var(--chart-4))' },
];


const sentimentIcons = {
    Positive: <Smile className="h-6 w-6 text-green-500" />,
    Negative: <Frown className="h-6 w-6 text-red-500" />,
    Neutral: <Meh className="h-6 w-6 text-yellow-500" />,
}

export function DashboardView() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map(kpi => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Conversation Volume</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                   <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chatData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="chats" fill="hsl(var(--chart-1))" name="Total Chats" />
                            <Bar dataKey="resolutionTime" fill="hsl(var(--chart-2))" name="Avg. Resolution (s)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {sentimentData.map(item => (
                             <div key={item.name} className="flex flex-col items-center gap-2">
                                {sentimentIcons[item.name as keyof typeof sentimentIcons]}
                                <p className="font-bold text-2xl">{item.value}</p>
                                <p className="text-sm text-muted-foreground">{item.name}</p>
                            </div>
                        ))}
                    </div>
                     <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sentimentData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis type="number" hide />
                             <YAxis type="category" dataKey="name" hide />
                             <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                             <Bar dataKey="value" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Conversion Tracking</CardTitle>
                    <CardDescription>Chats that led to a successful action.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={conversionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="conversions" fill="hsl(var(--chart-5))" name="Successful Conversions" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Engagement Funnel</CardTitle>
                    <CardDescription>From chatbot interaction to human agent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            <Funnel dataKey="value" data={funnelData} isAnimationActive>
                                <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

