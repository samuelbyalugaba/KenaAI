
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
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";
import { getAgentsByCompany } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";

const statusVariantMap: Record<string, "bg-emerald-500" | "bg-amber-500" | "bg-slate-400"> = {
    Online: "bg-emerald-500",
    Busy: "bg-amber-500",
    Offline: "bg-slate-400",
};

export function AgentsView({ onMenuClick, user }: { onMenuClick: () => void; user: UserProfile | null }) {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  React.useEffect(() => {
    async function fetchAgents() {
        if (user?.companyId) {
            setIsLoading(true);
            const fetchedAgents = await getAgentsByCompany(user.companyId);
            setAgents(fetchedAgents);
            setIsLoading(false);
        }
    }
    fetchAgents();
  }, [user]);


  const handleAgentAdd = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };
  
  const filteredAgents = React.useMemo(() => {
    return agents.filter(agent => {
        const name = agent.name || '';
        const email = agent.email || '';
        const status = agent.status || 'Offline';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [agents, searchTerm, statusFilter]);

  const mostActiveAgents = React.useMemo(() => {
    return [...agents]
        .sort((a, b) => (b.conversationsToday || 0) - (a.conversationsToday || 0))
        .slice(0, 3);
  }, [agents]);

    const parseTimeToSeconds = (timeStr?: string): number => {
        if (!timeStr) return 0;
        let totalSeconds = 0;
        const minMatch = timeStr.match(/(\d+)m/);
        const secMatch = timeStr.match(/(\d+)s/);
        if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;
        if (secMatch) totalSeconds += parseInt(secMatch[1]);
        return totalSeconds;
    };

  const responseTimeData = React.useMemo(() => {
      const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
      return agents.map((agent, index) => ({
          name: agent.name.split(' ')[0],
          time: parseTimeToSeconds(agent.avgResponseTime),
          fill: chartColors[index % chartColors.length]
      }));
  }, [agents]);


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
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-3 w-[200px]" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-6 w-8 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-6 w-10 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredAgents.map((agent) => (
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
                           <span>{agent.status || 'Offline'}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{agent.conversationsToday || 0}</TableCell>
                    <TableCell className="text-center">{agent.avgResponseTime || 'N/A'}</TableCell>
                    <TableCell className="text-center">{agent.csat ? `${agent.csat}%` : 'N/A'}</TableCell>
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
                       {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 flex-1" />
                                        <Skeleton className="h-6 w-8" />
                                    </div>
                                ))}
                            </div>
                       ) : (
                            <ul className="space-y-4">
                                {mostActiveAgents.map(agent => (
                                    <li key={agent.id} className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={agent.avatar} alt={agent.name} />
                                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">{agent.name}</div>
                                        <div className="font-bold">{agent.conversationsToday || 0}</div>
                                    </li>
                                ))}
                            </ul>
                       )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Response Time Comparison</CardTitle>
                        <CardDescription>Average response time in seconds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Skeleton className="h-full w-full" />
                            </div>
                       ) : (
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
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );

    
