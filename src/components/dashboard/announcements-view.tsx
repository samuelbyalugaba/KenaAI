
"use client";

import * as React from "react";
import { PlusCircle, Search, UserCheck, Send, PanelLeft, MessageSquare, CornerDownRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement, AnnouncementCategory, UserProfile, Agent, Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { createAnnouncement, getAnnouncementsByCompany, getAgentsByCompany, markAnnouncementAsRead, addCommentToAnnouncement } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { useDebounce } from "@/hooks/use-debounce";


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

const AnnouncementForm = ({ onSubmit, form, user, isSubmitting }: { onSubmit: (data: AnnouncementFormValues) => void; form: any; user: UserProfile | null, isSubmitting: boolean }) => (
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
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        {isSubmitting ? "Publishing..." : "Publish Announcement"}
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
    </Card>
);

const AnnouncementCard = ({
    ann,
    user,
    allAgents,
    onCommentSubmit
}: {
    ann: Announcement,
    user: UserProfile,
    allAgents: Agent[],
    onCommentSubmit: (announcementId: string, content: string) => void,
}) => {
    const [newComment, setNewComment] = React.useState("");

    React.useEffect(() => {
        if (!ann.readBy.includes(user.id)) {
            markAnnouncementAsRead(ann.id, user.id);
        }
    }, [ann.id, ann.readBy, user.id]);

    const readers = allAgents.filter(agent => ann.readBy.includes(agent.id));
    const isCommentSectionOpen = ann.comments.length > 0;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onCommentSubmit(ann.id, newComment);
            setNewComment("");
        }
    };

    return (
        <Collapsible asChild>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
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
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ann.content}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center -space-x-2">
                             <TooltipProvider>
                                {readers.slice(0, 5).map(reader => (
                                     <Tooltip key={reader.id}>
                                         <TooltipTrigger asChild>
                                             <Avatar className="h-7 w-7 border-2 border-background">
                                                 <AvatarImage src={reader.avatar} alt={reader.name} />
                                                 <AvatarFallback>{reader.name.charAt(0)}</AvatarFallback>
                                             </Avatar>
                                         </TooltipTrigger>
                                         <TooltipContent><p>{reader.name}</p></TooltipContent>
                                     </Tooltip>
                                ))}
                             </TooltipProvider>
                             {readers.length > 5 && (
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground z-10 border-2 border-background">
                                    +{readers.length - 5}
                                </div>
                             )}
                              {readers.length > 0 && <span className="pl-4 text-xs text-muted-foreground">read this.</span>}
                        </div>
                        <CollapsibleTrigger asChild>
                             <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                <MessageSquare className="h-4 w-4" /> {ann.comments.length}
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="w-full space-y-4">
                        <Separator />
                        <div className="space-y-4">
                            {ann.comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-sm bg-muted p-2 rounded-lg">
                                            <p className="font-semibold">{comment.author.name}</p>
                                            <p className="text-muted-foreground">{comment.content}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form className="flex items-start gap-3" onSubmit={handleCommentSubmit}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                                <Textarea 
                                    placeholder="Write a comment..." 
                                    className="pr-10"
                                    rows={1}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </CollapsibleContent>
                </CardFooter>
            </Card>
        </Collapsible>
    )
}

const AnnouncementFeed = ({ announcements, user, allAgents, isLoading, onCommentSubmit }: { announcements: Announcement[], user: UserProfile | null, allAgents: Agent[], isLoading: boolean, onCommentSubmit: (announcementId: string, content: string) => void }) => (
    <ScrollArea className="flex-1 h-full pr-4 -mr-4">
        <div className="space-y-4">
          {isLoading ? (
            Array.from({length: 3}).map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-4 w-1/4" /><Skeleton className="h-6 w-3/4 mt-2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            ))
          ) : announcements.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No announcements yet.</div>
          ) : (
            announcements.map((ann) => user && (
              <AnnouncementCard 
                key={ann.id} 
                ann={ann} 
                user={user} 
                allAgents={allAgents}
                onCommentSubmit={onCommentSubmit}
              />
          ))
          )}
        </div>
      </ScrollArea>
);


type AnnouncementsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function AnnouncementsView({ onMenuClick, user }: AnnouncementsViewProps) {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [allAgents, setAllAgents] = React.useState<Agent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
    },
  });

  React.useEffect(() => {
    async function fetchData() {
        if (user?.companyId) {
            setIsLoading(true);
            const [fetchedAnnouncements, fetchedAgents] = await Promise.all([
                getAnnouncementsByCompany(user.companyId),
                getAgentsByCompany(user.companyId)
            ]);
            setAnnouncements(fetchedAnnouncements);
            setAllAgents(fetchedAgents);
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user]);

  const filteredAnnouncements = announcements.filter(ann =>
    ann.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  async function onSubmit(data: AnnouncementFormValues) {
    if (!user) return;
    
    setIsSubmitting(true);
    const result = await createAnnouncement({
        ...data,
        authorId: user.id,
        companyId: user.companyId
    });
    setIsSubmitting(false);

    if (result.success && result.announcement) {
        setAnnouncements(prev => [result.announcement!, ...prev]);
        toast({
          title: "Announcement Published",
          description: `"${data.title}" has been successfully published.`,
        });
        form.reset();
    } else {
        toast({
            variant: "destructive",
            title: "Failed to publish",
            description: result.message || "An unknown error occurred.",
        });
    }
  }

  const handleCommentSubmit = async (announcementId: string, content: string) => {
    if (!user) return;
    const result = await addCommentToAnnouncement(announcementId, user.id, content);
    if (result.success && result.comment) {
        const newComment = result.comment;
        setAnnouncements(prevAnns => 
            prevAnns.map(ann => 
                ann.id === announcementId 
                ? { ...ann, comments: [...ann.comments, newComment] }
                : ann
            )
        );
    } else {
        toast({ variant: 'destructive', title: "Failed to post comment." });
    }
  }

  const canCreate = user?.role === 'admin' || user?.role === 'super_agent';

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
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
        <div className="hidden md:grid md:grid-cols-3 gap-8 h-full">
            {canCreate && (
              <div className="md:col-span-1 flex flex-col h-full overflow-hidden">
                  <AnnouncementForm form={form} onSubmit={onSubmit} user={user} isSubmitting={isSubmitting} />
              </div>
            )}
            <div className={cn("overflow-hidden h-full flex flex-col", canCreate ? "md:col-span-2" : "md:col-span-3")}>
              <h2 className="text-xl font-semibold mb-4 px-1">Feed</h2>
              <AnnouncementFeed 
                announcements={filteredAnnouncements} 
                user={user} 
                allAgents={allAgents}
                isLoading={isLoading} 
                onCommentSubmit={handleCommentSubmit}
              />
            </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden h-full">
             <Tabs defaultValue="feed" className="w-full h-full flex flex-col">
                <TabsList className={cn("w-full", canCreate ? "grid grid-cols-2" : "grid grid-cols-1")}>
                    <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
                    {canCreate && <TabsTrigger value="new" className="flex-1">New</TabsTrigger>}
                </TabsList>
                <TabsContent value="feed" className="flex-1 overflow-auto mt-4">
                    <AnnouncementFeed 
                        announcements={filteredAnnouncements} 
                        user={user}
                        allAgents={allAgents}
                        isLoading={isLoading}
                        onCommentSubmit={handleCommentSubmit}
                    />
                </TabsContent>
                {canCreate && <TabsContent value="new" className="flex-1 overflow-auto mt-4">
                    <AnnouncementForm form={form} onSubmit={onSubmit} user={user} isSubmitting={isSubmitting} />
                </TabsContent>}
            </Tabs>
        </div>
      </main>
    </div>
  );
}
