
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, ShieldCheck, PanelLeft, MoreHorizontal, Star, Activity, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Agent, AgentRole, UserProfile } from "@/types";
import { AddAgentDialog } from "./add-agent-dialog";
import { cn } from "@/lib/utils";
import { mockAgents as initialMockAgents } from "@/lib/mock-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const roleVariantMap: Record<AgentRole, "default" | "secondary" | "destructive"> = {
    admin: "destructive",
    super_agent: "default",
    agent: "secondary"
}

const statusVariantMap: Record<NonNullable<Agent['status']>, "default" | "secondary" | "outline"> = {
    Online: "default",
    Busy: "secondary",
    Offline: "outline",
}

const statusColorMap: Record<NonNullable<Agent['status']>, string> = {
    Online: "bg-green-500",
    Busy: "bg-orange-500",
    Offline: "bg-gray-400",
}

type AgentsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function AgentsView({ onMenuClick, user }: AgentsViewProps) {
  const [agents, setAgents] = React.useState<Agent[]>(initialMockAgents);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
  }

  const canAddAgent = user?.role === 'admin' || user?.role === 'super_agent';

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
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, email, role..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {canAddAgent && <AddAgentDialog onAgentAdd={handleAgentAdd} />}
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Agent Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Agent</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Conversations</TableHead>
                                <TableHead className="text-center">Avg. Response</TableHead>
                                <TableHead className="text-center">CSAT</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredAgents.map((agent) => (
                                <TableRow key={agent.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="person portrait" />
                                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{agent.name}</div>
                                                <div className="text-xs text-muted-foreground">{agent.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{agent.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={roleVariantMap[agent.role]} className="capitalize">
                                            {agent.role.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2.5 w-2.5 rounded-full", statusColorMap[agent.status || "Offline"])}></div>
                                            <span>{agent.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{agent.conversationsToday}</TableCell>
                                    <TableCell className="text-center">{agent.avgResponseTime}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span>{agent.csat}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
      </main>
    </div>
  );
}
