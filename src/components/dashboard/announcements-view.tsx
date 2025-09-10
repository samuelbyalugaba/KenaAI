
"use client";

import * as React from "react";
import { PlusCircle, Search, UserCheck, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement, Agent, AnnouncementCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const mockAdminUser: Agent = { id: '1', name: "Samuel Byalugaba", avatar: "https://picsum.photos/id/1/100/100", email: "samuel.b@example.com", phone: "+1-555-0201", role: "admin" };

const mockAgents: Agent[] = [
    mockAdminUser,
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

const announcementFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.enum(["General", "Urgent", "Training"]),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export function AnnouncementsView() {
  const [announcements, setAnnouncements] = React.useState(mockAnnouncements);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
    },
  });

  const filteredAnnouncements = announcements.filter(ann =>
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  function onSubmit(data: AnnouncementFormValues) {
    const newAnnouncement: Announcement = {
      id: new Date().toISOString(),
      author: mockAdminUser,
      date: new Date().toISOString().split('T')[0],
      readBy: [],
      title: data.title,
      content: data.content,
      category: data.category as AnnouncementCategory,
    };
    
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    toast({
      title: "Announcement Published",
      description: `"${data.title}" has been successfully published.`,
    });
    form.reset();
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search announcements..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </header>
      <main className="flex-1 overflow-hidden grid md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Announcement</CardTitle>
              <CardDescription>Create and publish a new announcement for your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Q3 All-Hands Meeting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your announcement here..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Training">Training</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Publish Announcement
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 overflow-auto">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
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
                              <span>Read by ({ann.readBy.length}):</span>
                          </div>
                          <div className="flex -space-x-2">
                              {ann.readBy.length > 0 ? ann.readBy.map(agent => (
                                  <Avatar key={agent.id} className="h-8 w-8 border-2 border-background">
                                      <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="person portrait" />
                                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                              )) : <span className="text-xs text-muted-foreground italic pl-1">No one yet</span>}
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
                                          <AvatarImage src={mockAdminUser.avatar} alt={mockAdminUser.name} data-ai-hint="person portrait" />
                                          <AvatarFallback>{mockAdminUser.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="relative w-full">
                                          <Textarea placeholder="Add a comment..." className="flex-grow min-h-[40px] pr-12" />
                                          <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7">
                                              <Send className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </div>
                              </div>
                          </div>
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
