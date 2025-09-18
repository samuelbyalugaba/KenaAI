
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  MessageSquare,
  NotebookPen,
  PanelLeft,
  Paperclip,
  PlusCircle,
  Search,
  Send,
  Settings,
  Smile,
  Sparkles,
  Users,
  User as UserIcon,
  X,
  Bot,
} from "lucide-react";

import type { Chat, Message, Priority, UserProfile, Agent, User, Channel, Note } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { intelligentChatSummary } from "@/ai/flows/intelligent-chat-summary";
import { AddAgentDialog } from "./add-agent-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { KenaAILogo } from "@/components/ui/kena-ai-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewChatDialog } from "./new-chat-dialog";
import { getChatsByCompany, getMessagesForChat, sendMessage, setChatbotStatus, startNewChats, getContactsByCompany, addNoteToContact } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";


const ChatList = ({ chats, selectedChat, onSelectChat, isLoading }: { chats: Chat[], selectedChat: Chat | null, onSelectChat: (chat: Chat) => void, isLoading: boolean }) => (
  <ScrollArea className="flex-grow">
    <div className="flex flex-col gap-2 p-4 pt-0">
      {isLoading ? (
         Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
      ) : chats.map((chat) => (
        <button
          key={chat.id}
          className={cn(
            "flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-primary/10",
            selectedChat?.id === chat.id && "bg-primary/20"
          )}
          onClick={() => onSelectChat(chat)}
        >
          <Avatar className="h-10 w-10 border-2 border-background flex-shrink-0">
            <AvatarImage src={chat.user.avatar} alt={chat.user.name} data-ai-hint="person portrait" />
            <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{chat.user.name}</h3>
              <span className="text-xs text-muted-foreground flex-shrink-0">{chat.timestamp}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground truncate flex-grow pr-2">
                {chat.lastMessage}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {chat.isChatbotActive ? (
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {chat.isChatbotActive
                          ? "Handled by Bot"
                          : "Handled by Agent"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PriorityBadge priority={chat.priority} />
                {chat.unreadCount > 0 && (
                  <Badge className="flex h-5 w-5 items-center justify-center rounded-full p-0 bg-accent text-accent-foreground">{chat.unreadCount}</Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </ScrollArea>
);

const priorityMap: Record<Priority, string> = {
  urgent: "bg-destructive",
  high: "bg-[#4f2668]",
  normal: "bg-accent",
  low: "bg-muted-foreground",
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colorClass = priorityMap[priority];
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("h-2.5 w-2.5 rounded-full", colorClass)}></div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{priority} Priority</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Stats = ({ chats }: { chats: Chat[] }) => {
  const totalChats = chats.length;
  const openChats = chats.filter(c => c.unreadCount > 0).length;
  const closedChats = totalChats - openChats;
  const pendingChats = chats.filter(c => c.isChatbotActive).length;

  const avgResponseTime = React.useMemo(() => {
    // This is a mock calculation. In a real app, you'd calculate this from message timestamps.
    const minutes = Math.floor(Math.random() * 5);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}m ${seconds}s`;
  }, [chats]);

  const stats = [
    { title: "Total Chats", value: totalChats.toString(), icon: MessageSquare },
    { title: "Open", value: openChats.toString(), icon: Users },
    { title: "Closed", value: closedChats.toString(), icon: CheckCircle },
    { title: "Pending", value: pendingChats.toString(), icon: Clock },
    { title: "Avg. Response", value: avgResponseTime, icon: Clock },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 p-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ChatArea = ({ chat, onChatbotToggle, onSendMessage, onBack, isLoadingMessages, onNoteAdded, currentUser }: { chat: Chat; onChatbotToggle: (chatId: string, isActive: boolean) => void; onSendMessage: (chatId: string, message: string) => void; onBack: () => void; isLoadingMessages: boolean; onNoteAdded: (contactId: string, note: Note) => void; currentUser: UserProfile | null; }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat?.messages]);
  
    return (
        <div className="flex flex-1 flex-col h-full">
            <ChatHeader chat={chat} onChatbotToggle={onChatbotToggle} onBack={onBack} onNoteAdded={onNoteAdded} currentUser={currentUser} />
            <Separator />
            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="p-4 space-y-4">
                    {isLoadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                          <p>Loading messages...</p>
                        </div>
                    ) : (
                      chat.messages.map((message) => (
                          <ChatMessage key={message.id} message={message} />
                      ))
                    )}
                </div>
            </ScrollArea>
            <Separator />
            <ChatInput 
              chatId={chat.id} 
              isChatbotActive={chat.isChatbotActive}
              onSendMessage={onSendMessage}
            />
        </div>
    );
};

const ChatHeader = ({ chat, onChatbotToggle, onBack, onNoteAdded, currentUser }: { chat: Chat; onChatbotToggle: (chatId: string, isActive: boolean) => void; onBack: () => void; onNoteAdded: (contactId: string, note: Note) => void; currentUser: UserProfile | null; }) => {
    const [summary, setSummary] = React.useState<string | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);
    const [isNotesOpen, setIsNotesOpen] = React.useState(false);
    const [note, setNote] = React.useState("");
    const { toast } = useToast();

    const handleSummarize = async () => {
        setIsLoadingSummary(true);
        setSummary(null);
        try {
            const chatThread = chat.messages.map(m => `${typeof m.sender === 'string' ? 'You' : m.sender.name}: ${m.text}`).join('\n');
            const result = await intelligentChatSummary({ chatThread });
            setSummary(result.summary);
        } catch (error) {
            console.error("Failed to summarize chat:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate chat summary.",
            })
        }
        setIsLoadingSummary(false);
    }

    const handleSaveNote = async () => {
        if (!note.trim() || !currentUser) {
            toast({
                variant: "destructive",
                title: "Empty Note",
                description: "Cannot save an empty note.",
            })
            return;
        }
        const result = await addNoteToContact(chat.user.id, currentUser.id, currentUser.name, note);
        if (result.success && result.note) {
            onNoteAdded(chat.user.id, result.note);
            toast({
                title: "Note Saved",
                description: `Your note for ${chat.user.name} has been saved.`,
            });
            setNote("");
            setIsNotesOpen(false);
        } else {
             toast({ variant: 'destructive', title: "Failed to save note." });
        }
    }

    const isActionSheetOpen = !!summary || isLoadingSummary;
    const onActionSheetOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSummary(null);
        }
    }

    return (
        <div className="flex items-center p-2 px-4 gap-2 h-[61px] flex-shrink-0">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to chats</span>
            </Button>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{chat.user.name}</p>
                    <p className="text-xs text-muted-foreground">{chat.channel}</p>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
                <div className="flex items-center space-x-2">
                    <Switch id="chatbot-mode" checked={chat.isChatbotActive} onCheckedChange={(isActive) => onChatbotToggle(chat.id, isActive)} />
                    <Label htmlFor="chatbot-mode" className="hidden sm:block text-sm">{chat.isChatbotActive ? "Bot Mode" : "Manual Mode"}</Label>
                </div>
                <TooltipProvider>
                    <Sheet open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                        <SheetTrigger asChild>
                           <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setIsNotesOpen(true)}><NotebookPen className="h-5 w-5" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>Add Note</TooltipContent>
                            </Tooltip>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add Note for {chat.user.name}</SheetTitle>
                                <SheetDescription>
                                    Add a private note to this contact's profile. Only agents can see this.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4">
                                <Textarea 
                                    placeholder="e.g., Customer is interested in enterprise plan..." 
                                    rows={8}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <SheetFooter>
                                <Button variant="outline" onClick={() => setIsNotesOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveNote}>Save Note</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    
                    <Sheet open={isActionSheetOpen} onOpenChange={onActionSheetOpenChange}>
                      <SheetTrigger asChild>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleSummarize}><Sparkles className="h-5 w-5"/></Button>
                            </TooltipTrigger>
                            <TooltipContent>AI Summary</TooltipContent>
                        </Tooltip>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Intelligent Chat Summary</SheetTitle>
                          <SheetDescription>
                            An AI-generated summary of your conversation with {chat.user.name}.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          {isLoadingSummary && <p>Generating summary...</p>}
                          {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
                        </div>
                      </SheetContent>
                    </Sheet>
                </TooltipProvider>
            </div>
        </div>
    )
}

const ChatMessage = ({ message }: { message: Message }) => {
    const isMe = message.sender === 'me';
    // This is a temporary fix for rendering. The backend should return a proper User object.
    const sender = isMe ? null : (typeof message.sender === 'object' ? message.sender as { name: string, avatar: string } : { name: 'User', avatar: '' });

    return (
        <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
            {!isMe && sender && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={sender.avatar} alt={sender.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
             <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2", isMe ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                <p className="text-sm">{message.text}</p>
                <p className={cn("text-xs mt-1", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{message.timestamp}</p>
            </div>
        </div>
    )
}

const ChatInput = ({ chatId, isChatbotActive, onSendMessage }: { chatId: string; isChatbotActive: boolean; onSendMessage: (chatId: string, message: string) => void; }) => {
    const [message, setMessage] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            setIsSending(true);
            await onSendMessage(chatId, message.trim());
            setMessage("");
            setIsSending(false);
        }
    }

    return (
        <div className="p-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
            <form className="relative" onSubmit={handleSubmit}>
                <Textarea
                    placeholder={isChatbotActive ? "Chatbot is active. Turn off to send a message." : "Type a message..."}
                    className="pr-24 min-h-[48px] resize-none"
                    disabled={isChatbotActive || isSending}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" disabled={isChatbotActive || isSending}><Paperclip className="h-5 w-5" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Attach file</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" disabled={isChatbotActive || isSending}><Smile className="h-5 w-5" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Add emoji</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button type="submit" size="icon" disabled={isChatbotActive || isSending}><Send className="h-5 w-5" /></Button>
                </div>
            </form>
        </div>
    );
};

type ChatLayoutProps = {
  user: UserProfile | null;
  onMenuClick: () => void;
};

export function ChatLayout({ user, onMenuClick }: ChatLayoutProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Channel | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (user?.companyId) {
        setIsLoading(true);
        try {
          const [fetchedChats, fetchedContacts] = await Promise.all([
            getChatsByCompany(user.companyId),
            getContactsByCompany(user.companyId),
          ]);
          setChats(fetchedChats);
          setContacts(fetchedContacts);
        } catch (error) {
          console.error("Failed to fetch chat data:", error);
          toast({ variant: 'destructive', title: "Error", description: "Failed to load chat data." });
        }
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user, toast]);

  const filteredChats = React.useMemo(() => {
    return chats.filter(chat => {
        const matchesSearch = chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChannel = selectedChannel === 'all' || chat.channel === selectedChannel;
        return matchesSearch && matchesChannel;
    }).sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [chats, searchTerm, selectedChannel]);

  useEffect(() => {
    if (!user) {
        setSelectedChat(null);
    }
  }, [user]);

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    if (!chat.messages || chat.messages.length === 0) {
      setIsLoadingMessages(true);
      const messages = await getMessagesForChat(chat.id);
      
      const updatedChat = { ...chat, messages };
      setChats(prev => prev.map(c => c.id === chat.id ? updatedChat : c));
      setSelectedChat(updatedChat);
      setIsLoadingMessages(false);
    }
  }

  const handleChatbotToggle = async (chatId: string, isActive: boolean) => {
    const result = await setChatbotStatus(chatId, isActive);
    if (result.success) {
      const updatedChats = chats.map(c => 
          c.id === chatId ? { ...c, isChatbotActive: isActive } : c
      );
      setChats(updatedChats);
      if (selectedChat?.id === chatId) {
          setSelectedChat(prev => prev ? { ...prev, isChatbotActive: isActive } : null);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update chatbot status.' });
    }
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    if (!user) return;
    
    const result = await sendMessage(chatId, text, user.id);

    if (result.success && result.newMessage) {
      const newMessage = result.newMessage;
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...(chat.messages || []), newMessage],
            lastMessage: text,
            timestamp: newMessage.timestamp,
          };
        }
        return chat;
      });
  
      setChats(updatedChats);
      if (selectedChat?.id === chatId) {
        setSelectedChat(prev => prev ? { 
          ...prev, 
          messages: [...(prev.messages || []), newMessage],
          lastMessage: text,
          timestamp: newMessage.timestamp,
        } : null);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    }
  };

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
  }

  const handleStartNewChats = async (selectedUsers: User[], message: string): Promise<Chat[]> => {
    if (!user) return [];
    
    try {
      const newOrUpdatedChats = await startNewChats(selectedUsers, message, user.companyId, user.id);
      
      const newChats = newOrUpdatedChats.filter(c => !chats.some(existing => existing.id === c.id));
      const updatedChats = newOrUpdatedChats.filter(c => chats.some(existing => existing.id === c.id));

      setChats(prev => {
          let updatedState = [...prev];
          // Add new chats
          updatedState = [...newChats, ...updatedState];
          // Update existing chats
          updatedChats.forEach(updatedChat => {
              const index = updatedState.findIndex(c => c.id === updatedChat.id);
              if (index !== -1) {
                  updatedState[index] = {
                      ...updatedState[index],
                      lastMessage: updatedChat.lastMessage,
                      timestamp: updatedChat.timestamp,
                  };
              }
          });
          return updatedState;
      });

      if (newOrUpdatedChats.length === 1) {
          handleSelectChat(newOrUpdatedChats[0]);
      }

      return newOrUpdatedChats;

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to start new chat(s).' });
      return [];
    }
  }

  const handleNoteAdded = (contactId: string, note: Note) => {
      setContacts(prev => prev.map(c => 
          c.id === contactId ? { ...c, notes: [note, ...(c.notes || [])] } : c
      ));
  }

  const canAddAgent = user?.role === 'admin' || user?.role === 'super_agent';

  const MainHeader = ({ children }: { children: React.ReactNode }) => (
    <header className="flex items-center justify-between p-2 border-b h-[61px] flex-shrink-0">
        {children}
    </header>
  )

  const MobileChatListHeader = () => (
    <MainHeader>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-xl font-bold">Chats</h1>
        </div>
        <div className="flex items-center gap-2">
            <NewChatDialog contacts={contacts} onStartChat={handleStartNewChats}>
              <Button variant="ghost" size="icon">
                  <PlusCircle className="h-5 w-5" />
                  <span className="sr-only">New Chat</span>
              </Button>
            </NewChatDialog>
        </div>
    </MainHeader>
  )
  
  const renderMobileView = () => {
    if (!user) {
        return null;
    }
    
    if (selectedChat) {
      return (
        <ChatArea 
          chat={selectedChat} 
          onChatbotToggle={handleChatbotToggle} 
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedChat(null)}
          isLoadingMessages={isLoadingMessages}
          onNoteAdded={handleNoteAdded}
          currentUser={user}
        />
      );
    }
    return (
      <div className="flex flex-col h-full">
        <MobileChatListHeader />
        <SidebarContent />
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card text-card-foreground">
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedChannel} onValueChange={(value) => setSelectedChannel(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Webchat">Webchat</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <h2 className="px-4 text-lg font-semibold tracking-tight">Recent Chats</h2>
        <ChatList chats={filteredChats} selectedChat={selectedChat} onSelectChat={handleSelectChat} isLoading={isLoading} />
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      { isMobile ? (
        <div className="w-full h-full flex flex-col">
          {renderMobileView()}
        </div>
      ) : (
        <>
          <div className="md:w-80 lg:w-96 border-r h-full flex flex-col">
            <MainHeader>
                <KenaAILogo className="h-10" />
                <div />
                <div />
            </MainHeader>
            { user ? <SidebarContent /> : null }
          </div>

          <div className="flex flex-1 flex-col h-screen">
             <MainHeader>
                 <div />
                 <div className="flex items-center gap-4">
                    {user && 
                      <NewChatDialog contacts={contacts} onStartChat={handleStartNewChats}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <PlusCircle className="h-5 w-5" /> New Chat
                        </Button>
                      </NewChatDialog>
                    }
                     {canAddAgent && <div className="hidden md:flex">
                         <AddAgentDialog onAgentAdd={handleAgentAdd} user={user} />
                     </div>}
                 </div>
             </MainHeader>
            
            <div className="hidden md:block">
                {user && <Stats chats={chats} />}
                <Separator />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                 { user && selectedChat ? (
                    <ChatArea 
                        chat={selectedChat} 
                        onChatbotToggle={handleChatbotToggle} 
                        onSendMessage={handleSendMessage}
                        onBack={() => setSelectedChat(null)}
                        isLoadingMessages={isLoadingMessages}
                        onNoteAdded={handleNoteAdded}
                        currentUser={user}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                      {isLoading ? (
                        <p>Loading chats...</p>
                      ) : (
                        <>
                          <div className="rounded-full bg-primary/10 p-4">
                              <MessageSquare className="h-12 w-12 text-primary"/>
                          </div>
                          <h2 className="text-2xl font-bold">No Chat Selected</h2>
                          <p className="text-muted-foreground">Select a chat from the sidebar to start messaging.</p>
                        </>
                      )}
                    </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

