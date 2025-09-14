
"use client";

import * as React from "react";
import {
    MoreHorizontal,
    PlusCircle,
    Search,
    User,
    Mail,
    Phone,
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
import type { Agent, UserProfile } from "@/types";
import { AddAgentDialog } from "./add-agent-dialog";
import { mockAgents as initialMockAgents } from "@/lib/mock-data";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const statusVariantMap: Record<string, "bg-emerald-500" | "bg-amber-500" | "bg-slate-400"> = {
    Online: "bg-emerald-500",
    Busy: "bg-amber-500",
    Offline: "bg-slate-400",
};

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
             <AddAgentDialog onAgentAdd={handleAgentAdd}>
                <Button className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Add New Agent</span>
                </Button>
            </AddAgentDialog>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
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
      </main>
    </div>
  );
}
