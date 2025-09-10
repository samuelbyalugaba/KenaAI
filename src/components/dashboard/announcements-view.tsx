
"use client";

import * as React from "react";
import { PlusCircle, Search, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement, Agent, AnnouncementCategory } from "@/types";

const mockAgents: Agent[] = [
    { id: '1', name: "Samuel Byalugaba", avatar: "https://picsum.photos/id/1/100/100", email: "samuel.b@example.com", phone: "+1-555-0201", role: "admin" },
    { id: '2', name: "Kelvin Malisa", avatar: "https://picsum.photos/id/1025/100/100", email: "kelvin.m@example.com", phone: "+1-555-0202", role: "admin" },
    { id: '3', name: "Sylvester Mayaya", avatar: "https://picsum.photos/id/40/100/100", email: "sylvester.m@example.com", phone: "+1-555-0203", role: "super_agent" },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "New Quarterly Training Schedule",
    author: mockAgents[0],
    date: "2024-07-28",
    category: "Training",
    content: "Hi team, please find the updated training schedule for Q3 attached. All sessions are mandatory. We'll cover advanced chatbot handling and new CRM features. RSVP by Friday.",
    readBy: [mockAgents[2]],
  },
  {
    id: "ann2",
    title: "URGENT: Server Maintenance Tonight",
    author: mockAgents[1],
    date: "2024-07-27",
    category: "Urgent",
    content: "There will be a critical server maintenance tonight from 11:00 PM to 2:00 AM. The chat service may be intermittently unavailable. Please inform any active clients.",
    readBy: [mockAgents[0], mockAgents[2]],
  },
  {
    id: "ann3",
    title: "Team Lunch Next Wednesday!",
    author: mockAgents[0],
    date: "2024-07-26",
    category: "General",
    content: "To celebrate a great month, we're having a team lunch at 'The Corner Bistro' next Wednesday at 1 PM. See you there!",
    readBy: [mockAgents[0], mockAgents[1], mockAgents[2]],
  },
];

const categoryVariantMap: Record<AnnouncementCategory, "default" | "secondary" | "destructive"> = {
    General: "secondary",
    Urgent: "destructive",
    Training: "default"
}

export function AnnouncementsView() {
  const [announcements, setAnnouncements] = React.useState(mockAnnouncements);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredAnnouncements = announcements.filter(ann =>
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <div className="flex items-center gap-4">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search announcements..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          <Button><PlusCircle /> New Announcement</Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnouncements.map((ann) => (
            <Card key={ann.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <Badge variant={categoryVariantMap[ann.category]}>{ann.category}</Badge>
                        <div className="text-xs text-muted-foreground">{ann.date}</div>
                    </div>
                    <CardTitle className="pt-2">{ann.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={ann.author.avatar} alt={ann.author.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{ann.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{ann.author.name}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{ann.content}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserCheck className="h-4 w-4" />
                        <span>Read by:</span>
                    </div>
                    <div className="flex -space-x-2">
                        {ann.readBy.map(agent => (
                            <Avatar key={agent.id} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                     <div className="w-full pt-4">
                        <h4 className="text-sm font-semibold mb-2">Internal Discussion</h4>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={mockAgents[0].avatar} alt={mockAgents[0].name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{mockAgents[0].name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-secondary rounded-lg p-2 text-sm w-full">
                                    <span className="font-semibold">{mockAgents[0].name}: </span>
                                    <span>Great initiative! I'll be there.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                               <Avatar className="h-8 w-8">
                                    <AvatarImage src={mockAgents[2].avatar} alt={mockAgents[2].name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{mockAgents[2].name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Textarea placeholder="Add a comment..." className="flex-grow min-h-[40px]" />
                                <Button size="sm">Send</Button>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        ))}
      </main>
    </div>
  );
}
