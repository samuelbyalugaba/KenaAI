
"use client";

import * as React from "react";
import { PlusCircle, Search, UserCheck, Send, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement, Agent, AnnouncementCategory, UserProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockAgents, mockAdminUser } from "@/lib/mock-data";

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
};

const announcementFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.enum(["General", "Urgent", "Training"]),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

const AnnouncementForm = ({ onSubmit, form, user }: { onSubmit: (data: AnnouncementFormValues) => void; form: any; user: UserProfile | null }) => (
    <Card className="flex-1 flex flex-col h-full border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle>New Announcement</CardTitle>
          <CardDescription>Create and publish a new announcement for your team.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto px-0 md:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
                <div className="space-y-4">
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
                                </SelectTrigger>
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
                </div>
                <div className="mt-auto pt-4">
                    <Button type="submit" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Publish Announcement
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
    </Card>
);

const AnnouncementFeed = ({ announcements, user }: { announcements: Announcement[], user: UserProfile | null }) => (
    <ScrollArea className="flex-1 h-full pr-4 -mr-4">
        <div className="space-y-4">
          {announcements.map((ann) => (
              <Card key={ann.id} className="flex flex-col">
                  <CardHeader>
                      <div className="flex items-start justify-between">
                          <Badge variant={categoryVariantMap[ann.category]}>{ann.category}</Badge>
                          <div className="text-xs text-muted-foreground">{new Date(ann.date).toLocaleDateString()}</div>
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
                  <CardFooter className="flex-col items-start gap-4">
                      <div className="w-full">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserCheck className="h-4 w-4" />
                            <span>Read by ({ann.readBy.length}):</span>
                        </div>
                        <div className="flex -space-x-2 pt-2">
                            {ann.readBy.length > 0 ? ann.readBy.map(agent => (
                                <Avatar key={agent.id} className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )) : <span className="text-xs text-muted-foreground italic pl-1">No one yet</span>}
                        </div>
                      </div>
                       <div className="w-full pt-4 border-t">
                          <h4 className="text-sm font-semibold mb-2">Internal Discussion</h4>
                          <div className="space-y-4">
                              {/* Example Comment */}
                              <div className="flex gap-2">
                                  <Avatar className="h-8 w-8">
                                      <AvatarImage src={mockAgents[2].avatar} alt={mockAgents[2].name} data-ai-hint="person portrait" />
                                      <AvatarFallback>{mockAgents[2].name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="bg-secondary rounded-lg p-2 text-sm w-full">
                                      <span className="font-semibold">{mockAgents[2].name}: </span>
                                      <span>This is great news!</span>
                                  </div>
                              </div>
                              {/* Comment Input */}
                              {user && <div className="flex items-start gap-2">
                                 <Avatar className="h-8 w-8">
                                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
                                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="relative w-full">
                                      <Textarea placeholder="Add a comment..." className="flex-grow min-h-[40px] pr-12" />
                                      <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7">
                                          <Send className="h-4 w-4" />
                                      </Button>
                                  </div>
                              </div>}
                          </div>
                      </div>
                  </CardFooter>
              </Card>
          ))}
        </div>
      </ScrollArea>
);


type AnnouncementsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function AnnouncementsView({ onMenuClick, user }: AnnouncementsViewProps) {
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
    if (!user) return; // Should not happen if UI is correctly protecting form
    
    const authorAgent = mockAgents.find(a => a.name === user.name) || mockAdminUser;

    const newAnnouncement: Announcement = {
      id: new Date().toISOString(),
      author: authorAgent,
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
      variant: "default",
    });
    
    form.reset();
  }

  const canCreate = user?.role === 'admin' || user?.role === 'super_agent';

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-2xl font-bold">Announcements</h1>
        </div>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search announcements..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 h-full">
            {canCreate && (
              <div className="md:col-span-1 flex flex-col h-full overflow-hidden">
                  <AnnouncementForm form={form} onSubmit={onSubmit} user={user} />
              </div>
            )}
            <div className={cn("overflow-hidden h-full flex flex-col", canCreate ? "md:col-span-2" : "md:col-span-3")}>
              <h2 className="text-xl font-semibold mb-4 px-1">Feed</h2>
              <AnnouncementFeed announcements={filteredAnnouncements} user={user} />
            </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden h-full">
             <Tabs defaultValue="feed" className="w-full h-full flex flex-col">
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
                    {canCreate && <TabsTrigger value="new" className="flex-1">New</TabsTrigger>}
                </TabsList>
                <TabsContent value="feed" className="flex-1 overflow-auto mt-4">
                    <AnnouncementFeed announcements={filteredAnnouncements} user={user} />
                </TabsContent>
                {canCreate && <TabsContent value="new" className="flex-1 overflow-auto mt-4">
                    <AnnouncementForm form={form} onSubmit={onSubmit} user={user} />
                </TabsContent>}
            </Tabs>
        </div>
      </main>
    </div>
  );
}
