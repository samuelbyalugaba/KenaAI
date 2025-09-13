
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, ShieldCheck, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const roleVariantMap: Record<AgentRole, "default" | "secondary" | "destructive"> = {
    admin: "destructive",
    super_agent: "default",
    agent: "secondary"
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
    agent.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-bold">Agents</h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search agents..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {canAddAgent && <AddAgentDialog onAgentAdd={handleAgentAdd} />}
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        {/* Desktop View */}
        <div className="hidden md:block">
            <Card>
                <CardHeader>
                    <CardTitle>Agent List</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-220px)]">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Role</TableHead>
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
                                            <div className="font-medium">{agent.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{agent.email}</TableCell>
                                    <TableCell>{agent.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={roleVariantMap[agent.role]} className="capitalize">
                                            {agent.role.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <User className="h-4 w-4" />
                                            <span className="sr-only">View Profile</span>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Mail className="h-4 w-4" />
                                            <span className="sr-only">Send Email</span>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Phone className="h-4 w-4" />
                                            <span className="sr-only">Call</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="space-y-4">
                {filteredAgents.map((agent) => (
                    <Card key={agent.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{agent.name}</CardTitle>
                                    <Badge variant={roleVariantMap[agent.role]} className="capitalize mt-1">
                                        {agent.role.replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {agent.email}</p>
                            <p className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {agent.phone}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" /> Email
                            </Button>
                            <Button size="sm">
                                <Phone className="h-4 w-4 mr-2" /> Call
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                </div>
            </ScrollArea>
        </div>
      </main>
    </div>
  );
}
