
"use client";

import * as React from "react";
import {
    MoreHorizontal,
    PlusCircle,
    Search,
    User,
    Mail,
    Phone,
    ArrowDown,
    ArrowUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Agent, UserProfile, AgentPerformance } from "@/types";
import { AddAgentDialog } from "./add-agent-dialog";
import { mockAgents as initialMockAgents } from "@/lib/mock-data";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

const statusVariantMap: Record<string, "bg-emerald-500" | "bg-amber-500" | "bg-slate-400"> = {
    Online: "bg-emerald-500",
    Busy: "bg-amber-500",
    Offline: "bg-slate-400",
};

const activityLogs = [
  { id: 'log1', timestamp: '2024-08-01 10:05:14', agent: 'Samuel Byalugaba', action: 'Login', details: 'Logged in from IP 192.168.1.10' },
  { id: 'log2', timestamp: '2024-08-01 10:07:21', agent: 'Sylvester Mayaya', action: 'Conversation Assigned', details: 'Assigned chat with Kelvin (#1)' },
  { id: 'log3', timestamp: '2024-08-01 10:15:03', agent: 'Kelvin Malisa', action: 'Role Change', details: 'Role changed from Agent to Super Agent' },
  { id: 'log4', timestamp: '2024-08-01 10:22:45', agent: 'Linaliz Ready', action: 'Message Sent', details: 'Sent message in chat with Diana' },
  { id: 'log5', timestamp: '2024-08-01 10:30:00', agent: 'Samuel Byalugaba', action: 'Logout', details: 'Session duration: 24m 46s' },
];

const mostActiveAgents = [
    { name: 'Sylvester Mayaya', conversations: 25, avatar: "https://picsum.photos/seed/sly/100/100" },
    { name: 'Kelvin Malisa', conversations: 15, avatar: "https://picsum.photos/seed/kelvin/100/100" },
    { name: 'Samuel Byalugaba', conversations: 12, avatar: "https://picsum.photos/seed/sam/100/100" },
];

const responseTimeData = [
    { name: "Samuel B.", time: 105, fill: "hsl(var(--chart-1))" },
    { name: "Kelvin M.", time: 90, fill: "hsl(var(--chart-2))" },
    { name: "Sylvester M.", time: 130, fill: "hsl(var(--chart-3))" },
    { name: "Linaliz R.", time: 185, fill: "hsl(var(--chart-4))" },
];

export function AgentsView({ onMenuClick, user }: { onMenuClick: () => void; user: UserProfile | null }) {
  const [agents, setAgents] = React.useState<Agent[]>(initialMockAgents);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };
  
  const filteredAgents = React.useMemo(() => {
    return agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              agent.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [agents, searchTerm, statusFilter]);

  if (user?.role !== 'admin' && user?.role !== 'super_agent') {
      return (
          <div className="flex h-screen w-full flex-col bg-background text-foreground">
             <header className="flex items-center justify-between p-4 border-b">
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
                            You do not have permission to view this page. This area is restricted to administrators and super agents.
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
            <h1 className="text-2xl font-bold">Agents & Team Management</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search agents..."
                    className="pl-8 sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select onValueChange={setStatusFilter} defaultValue="all">
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
            </Select>
            <AddAgentDialog onAgentAdd={handleAgentAdd} user={user} />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Agent Directory</CardTitle>
            <CardDescription>
              Manage your team of support agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Conversations</TableHead>
                  <TableHead className="text-center">Avg. Response</TableHead>
                  <TableHead className="text-center">CSAT</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{agent.role.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                           <span className={cn("h-2.5 w-2.5 rounded-full", statusVariantMap[agent.status || 'Offline'])}></span>
                           <span>{agent.status}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{agent.conversationsToday}</TableCell>
                    <TableCell className="text-center">{agent.avgResponseTime}</TableCell>
                    <TableCell className="text-center">{agent.csat}%</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div>
            <h2 className="text-2xl font-bold mb-4">Agent Performance</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Most Active Agents</CardTitle>
                        <CardDescription>Agents with the most conversations today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {mostActiveAgents.map(agent => (
                                <li key={agent.name} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={agent.avatar} alt={agent.name} />
                                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">{agent.name}</div>
                                    <div className="font-bold">{agent.conversations}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Response Time Comparison</CardTitle>
                        <CardDescription>Average response time in seconds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-64">
                            <BarChart data={responseTimeData}>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="time" radius={4}>
                                    {responseTimeData.map(entry => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <Accordion type="single" collapsible>
                <AccordionItem value="activity-logs">
                    <AccordionTrigger className="px-6">
                        <div className="flex flex-col items-start">
                            <CardTitle>Activity Logs</CardTitle>
                            <CardDescription>An audit trail of all agent actions.</CardDescription>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activityLogs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.timestamp}</TableCell>
                                        <TableCell>{log.agent}</TableCell>
                                        <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
      </main>
    </div>
  );
}
