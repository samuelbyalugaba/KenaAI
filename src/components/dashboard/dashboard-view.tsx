
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
    Calendar as CalendarIcon,
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
    TrendingUp,
    MoreHorizontal
} from "lucide-react";
import type { UserProfile, Agent, UnansweredQuery, Chat } from "@/types";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { KenaAILogo } from "../ui/kena-ai-logo";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAgentsByCompany, getChatsByCompany } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";


const channelBreakdownConfig = {
  value: {
    label: "Conversations",
  },
  WhatsApp: {
    label: "WhatsApp",
    color: "hsl(var(--chart-1))",
  },
  Webchat: {
    label: "Webchat",
    color: "hsl(var(--chart-2))",
  },
  Instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-3))",
  },
  Facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-4))",
  },
}


const AgentPerformanceTable = ({ agents }: { agents: Agent[] }) => {
    const sortedAgents = [...agents]
        .sort((a, b) => (b.conversationsToday || 0) - (a.conversationsToday || 0))
        .slice(0, 5)
        .map((agent, index) => ({...agent, rank: index + 1}));

    if (sortedAgents.length === 0 || sortedAgents.every(a => (a.conversationsToday || 0) === 0)) {
        return <p className="text-center text-muted-foreground p-8">No agent data available.</p>;
    }

    return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Conversations</TableHead>
                <TableHead className="text-center">Avg. Response</TableHead>
                <TableHead className="text-right">CSAT</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {sortedAgents.map((perf) => (
                <TableRow key={perf.id}>
                    <TableCell className="font-bold text-lg">{perf.rank}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={perf.avatar} alt={perf.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{perf.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{perf.name}</div>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{perf.conversationsToday || 0}</TableCell>
                    <TableCell className="text-center">{perf.avgResponseTime || 'N/A'}</TableCell>
                    <TableCell className="text-right">{perf.csat ? `${perf.csat}%` : 'N/A'}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)};


type DashboardViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function DashboardView({ onMenuClick, user }: DashboardViewProps) {
  const { toast } = useToast();
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  React.useEffect(() => {
    async function fetchData() {
        if(user?.companyId) {
            setIsLoading(true);
            const [fetchedAgents, fetchedChats] = await Promise.all([
                getAgentsByCompany(user.companyId),
                getChatsByCompany(user.companyId)
            ]);
            setAgents(fetchedAgents);
            setChats(fetchedChats);
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user]);

  const handleExport = (type: 'PDF' | 'CSV') => {
      toast({
          title: "Feature Not Implemented",
          description: `This feature is for demonstration. In a real app, a ${type} file would be downloaded.`,
      });
  }

  const handleScheduleReport = () => {
      toast({
          title: "Feature Not Implemented",
          description: `This feature is for demonstration. In a real app, an email report would be scheduled.`,
      });
  }

  const kpiData = React.useMemo(() => {
    if (isLoading) return Array(5).fill({});

    const totalConversations = chats.length;
    const botConversations = chats.filter(c => c.isChatbotActive).length;
    const agentConversations = totalConversations - botConversations;
    const botPercentage = totalConversations > 0 ? (botConversations / totalConversations) * 100 : 0;
    const agentPercentage = totalConversations > 0 ? (agentConversations / totalConversations) * 100 : 0;
    
    let avgResponseTimeText = "N/A";
    let avgCsatText = "N/A";

    if (totalConversations > 0) {
        let totalSeconds = 0;
        let validAgentsForTime = 0;
        agents.forEach(agent => {
            if (agent.avgResponseTime && agent.avgResponseTime !== 'N/A' && agent.conversationsToday && agent.conversationsToday > 0) {
                const minMatch = agent.avgResponseTime.match(/(\d+)m/);
                const secMatch = agent.avgResponseTime.match(/(\d+)s/);
                let seconds = 0;
                if (minMatch) seconds += parseInt(minMatch[1]) * 60;
                if (secMatch) seconds += parseInt(secMatch[1]);
                totalSeconds += seconds;
                validAgentsForTime++;
            }
        });
        const avgSeconds = validAgentsForTime > 0 ? totalSeconds / validAgentsForTime : 0;
        const avgMinutes = Math.floor(avgSeconds / 60);
        const remainingSeconds = Math.round(avgSeconds % 60);
        avgResponseTimeText = avgSeconds > 0 ? `${avgMinutes}m ${remainingSeconds}s` : "N/A";

        let totalCsat = 0;
        let validAgentsForCsat = 0;
        agents.forEach(agent => {
            if (agent.csat && agent.conversationsToday && agent.conversationsToday > 0) {
                totalCsat += agent.csat;
                validAgentsForCsat++;
            }
        });
        const avgCsat = validAgentsForCsat > 0 ? totalCsat / validAgentsForCsat : 0;
        avgCsatText = avgCsat > 0 ? `${avgCsat.toFixed(1)}%` : "N/A";
    }

    return [
        {
            title: "Total Conversations",
            value: totalConversations.toString(),
            icon: MessageSquare,
        },
        {
            title: "Bot vs Agent",
            value: `${botPercentage.toFixed(0)}% / ${agentPercentage.toFixed(0)}%`,
            icon: Bot,
        },
        {
            title: "Average Response Time",
            value: avgResponseTimeText,
            icon: Clock,
        },
        {
            title: "Customer Satisfaction (CSAT)",
            value: avgCsatText,
            icon: Smile,
        },
        {
            title: "Agent Availability",
            value: `${agents.filter(a => a.status === 'Online').length} Active`,
            icon: UserCheck,
        },
    ]
  }, [chats, agents, isLoading]);

  const channelBreakdownData = React.useMemo(() => {
    if (chats.length === 0) return [];
    const counts = chats.reduce((acc, chat) => {
        acc[chat.channel] = (acc[chat.channel] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value], index) => ({
        name,
        value,
        fill: `hsl(var(--chart-${index + 1}))`
    }));
  }, [chats]);
  
  const conversationVolumeData = React.useMemo(() => {
      // This remains mock data as historical logging is not implemented.
      if (chats.length === 0) return [];
      return [
        { date: "Mon", conversations: 150 },
        { date: "Tue", conversations: 210 },
        { date: "Wed", conversations: 180 },
        { date: "Thu", conversations: 250 },
        { date: "Fri", conversations: 220 },
        { date: "Sat", conversations: 300 },
        { date: "Sun", conversations: 280 },
      ];
  }, [chats]);


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

  const DateRangePicker = ({className}: {className?: string}) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );

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
            <DateRangePicker className="hidden sm:flex" />
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden"><CalendarIcon className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="hidden sm:flex gap-2"><Download className="h-4 w-4" /> Export Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport('PDF')}><File className="mr-2 h-4 w-4" /> Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('CSV')}><Download className="mr-2 h-4 w-4" /> Export as CSV</DropdownMenuItem>
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
                                <Button size="sm" onClick={handleScheduleReport}>Schedule</Button>
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
                    <DropdownMenuItem onClick={() => handleExport('PDF')}><File className="mr-2 h-4 w-4" /> Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('CSV')}><Download className="mr-2 h-4 w-4" /> Export as CSV</DropdownMenuItem>
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
                                <Button size="sm" onClick={handleScheduleReport}>Schedule</Button>
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
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2"><Skeleton className="h-4 w-2/3" /></CardHeader>
                            <CardContent><Skeleton className="h-6 w-1/3 mb-2" /><Skeleton className="h-3 w-3/4" /></CardContent>
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
                            <CardDescription>Volume of conversations over the last 7 days. (Demo data)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px] w-full">
                                {isLoading || conversationVolumeData.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">No conversation data available.</div>
                                ) : (
                                    <LineChart data={conversationVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                                    </LineChart>
                                )}
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
                            <CardDescription>Ranking agents by efficiency and conversations handled.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? (
                                <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                                </div>
                            ) : (
                                <AgentPerformanceTable agents={agents} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                 {/* Chatbot Analysis */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Chatbot Analysis</h2>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Unanswered Queries</CardTitle>
                                <CardDescription>Log of queries the chatbot could not resolve.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">Unanswered query tracking feature coming soon.</p>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <div className="lg:col-span-1 space-y-8">

                 {/* Smart Alerts */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Smart Alerts</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground p-8">Real-time smart alerts feature coming soon.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Conversation Breakdown */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Conversation Sources</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Breakdown by Channel</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {isLoading || channelBreakdownData.length === 0 ? (
                                <div className="flex h-[250px] items-center justify-center text-muted-foreground">No channel data available.</div>
                            ) : (
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
                                        <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" radius={4}>
                                             {channelBreakdownData.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            )}
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
                             {chats.length === 0 ? (
                                <div className="text-center text-muted-foreground p-4">No data</div>
                             ) : (
                                <>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold">350</p>
                                        <p className="text-sm text-muted-foreground">New</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold">895</p>
                                        <p className="text-sm text-muted-foreground">Returning</p>
                                    </div>
                                </>
                             )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}

    

    