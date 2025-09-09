
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Agent, AgentRole } from "@/types";
import { AddAgentDialog } from "./add-agent-dialog";

// Mock data, in a real app this would be fetched
const mockAgents: Agent[] = [
    { id: '1', name: "Samuel Byalugaba", avatar: "https://picsum.photos/id/1/100/100", email: "samuel.b@example.com", phone: "+1-555-0201", role: "admin" },
    { id: '2', name: "Kelvin Malisa", avatar: "https://picsum.photos/id/1025/100/100", email: "kelvin.m@example.com", phone: "+1-555-0202", role: "admin" },
    { id: '3', name: "Sylvester Mayaya", avatar: "https://picsum.photos/id/40/100/100", email: "sylvester.m@example.com", phone: "+1-555-0203", role: "super_agent" },
];

const roleVariantMap: Record<AgentRole, "default" | "secondary" | "destructive"> = {
    admin: "destructive",
    super_agent: "default",
    agent: "secondary"
}

export function AgentsView() {
  const [agents, setAgents] = React.useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Agents</h1>
        <div className="flex items-center gap-4">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search agents..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <AddAgentDialog onAgentAdd={handleAgentAdd} />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle>Agent List</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
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
      </main>
    </div>
  );
}
