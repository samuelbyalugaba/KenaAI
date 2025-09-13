
"use client";

import * as React from "react";
import { useState } from "react";
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
} from "lucide-react";

import type { Chat, Message, Priority, UserProfile, Agent, User, Channel } from "@/types";
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
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { intelligentChatSummary } from "@/ai/flows/intelligent-chat-summary";
import { chatPrioritization } from "@/ai/flows/chat-prioritization";
import { AddAgentDialog } from "./add-agent-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { KenaAILogo } from "@/components/ui/kena-ai-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewChatDialog } from "./new-chat-dialog";
import { mockUsers, mockChats as initialMockChats } from "@/lib/mock-data";


const ChatList = ({ chats, selectedChat, onSelectChat }: { chats: Chat[], selectedChat: Chat | null, onSelectChat: (chat: Chat) => void }) => (
  <ScrollArea className="flex-grow">
    <div className="flex flex-col gap-2 p-4 pt-0">
      {chats.map((chat) => (
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
                {chat.lastMessage.length > 15 ? `${chat.lastMessage.slice(0, 15)}...` : chat.lastMessage}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
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

const priorityMap = {
  urgent: "destructive",
  high: "default",
  normal: "secondary",
  low: "outline",
} as const;

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const variant = priorityMap[priority];
  return <Badge variant={variant} className="capitalize h-5">{priority}</Badge>;
};

const Stats = () => {
    const stats = [
        { title: "Total Chats", value: "4", icon: MessageSquare },
        { title: "Open", value: "1", icon: Users },
        { title: "Closed", value: "3", icon: CheckCircle },
        { title: "Pending", value: "1", icon: Clock },
        { title: "Avg. Response", value: "1m 2sc", icon: Clock },
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

const ChatArea = ({ chat, onChatbotToggle, onSendMessage, onBack }: { chat: Chat; onChatbotToggle: (chatId: string, isActive: boolean) => void; onSendMessage: (chatId: string, message: string) => void; onBack: () => void; }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat?.messages]);
  
    return (
        <div className="flex flex-1 flex-col h-full">
            <ChatHeader chat={chat} onChatbotToggle={onChatbotToggle} onBack={onBack}/>
            <Separator />
            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="p-4 space-y-4">
                    {chat.messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
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

const ChatHeader = ({ chat, onChatbotToggle, onBack }: { chat: Chat; onChatbotToggle: (chatId: string, isActive: boolean) => void; onBack: () => void }) => {
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

    const handleSaveNote = () => {
        if (!note.trim()) {
            toast({
                variant: "destructive",
                title: "Empty Note",
                description: "Cannot save an empty note.",
            })
            return;
        }
        // In a real app, you would save the note to a database.
        // For now, we just show a confirmation toast.
        console.log("Saving note for", chat.user.name, ":", note);
        toast({
            title: "Note Saved",
            description: `Your note for ${chat.user.name} has been saved.`,
        });
        setNote("");
        setIsNotesOpen(false);
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
                    <Label htmlFor="chatbot-mode" className="hidden sm:block">{chat.isChatbotActive ? "Chatbot Active" : "Manual Mode"}</Label>
                </div>
                <TooltipProvider>
                    <Sheet open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                        <SheetTrigger asChild>
                           <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground"><NotebookPen className="h-5 w-5"/></Button>
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
    const sender = isMe ? null : message.sender as { name: string, avatar: string };
    
    return (
        <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
            {!isMe && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatar} alt={sender?.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(chatId, message.trim());
            setMessage("");
        }
    }

    return (
        <div className="p-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
            <form className="relative" onSubmit={handleSubmit}>
                <Textarea
                    placeholder={isChatbotActive ? "Chatbot is active. Turn off to send a message." : "Type a message..."}
                    className="pr-24 min-h-[48px] resize-none"
                    disabled={isChatbotActive}
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
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" disabled={isChatbotActive}><Paperclip className="h-5 w-5" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Attach file</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" disabled={isChatbotActive}><Smile className="h-5 w-5" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>Add emoji</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button type="submit" size="icon" disabled={isChatbotActive}><Send className="h-5 w-5" /></Button>
                </div>
            </form>
        </div>
    );
};

type ChatLayoutProps = {
  user: UserProfile | null;
  onLogout: () => void;
  onMenuClick: () => void;
};

export function ChatLayout({ user, onLogout, onMenuClick }: ChatLayoutProps) {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedChannel, setSelectedChannel] = React.useState<Channel | "all">("all");
  const isMobile = useIsMobile();


  React.useEffect(() => {
    const prioritizeChats = async () => {
        const prioritized = await Promise.all(initialMockChats.map(async chat => {
            try {
                const result = await chatPrioritization({ chatText: chat.lastMessage });
                return { ...chat, priority: result.priority };
            } catch {
                return chat;
            }
        }));
        
        const sortedChats = prioritized.sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        setChats(sortedChats);
    }
    if (user) {
        prioritizeChats();
    } else {
        setChats([]);
    }
  }, [user]);

  const filteredChats = React.useMemo(() => {
    return chats.filter(chat => {
        const matchesSearch = chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChannel = selectedChannel === 'all' || chat.channel === selectedChannel;
        return matchesSearch && matchesChannel;
    });
  }, [chats, searchTerm, selectedChannel]);

  React.useEffect(() => {
    if (!user) {
        setSelectedChat(null);
    } else if (!isMobile) {
        // Automatically select the first chat on desktop if one isn't selected
        // if (!selectedChat && filteredChats.length > 0) {
        //     setSelectedChat(filteredChats[0]);
        // }
    } else {
        // On mobile, clear selection when switching back to chat list
        setSelectedChat(null);
    }
  }, [user, isMobile]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  }

  const handleChatbotToggle = (chatId: string, isActive: boolean) => {
    const updatedChats = chats.map(c => 
        c.id === chatId ? { ...c, isChatbotActive: isActive } : c
    );
    setChats(updatedChats);
    if (selectedChat?.id === chatId) {
        setSelectedChat(prev => prev ? { ...prev, isChatbotActive: isActive } : null);
    }
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const newMessage: Message = {
      id: new Date().toISOString(),
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    if (selectedChat?.id === chatId) {
      setSelectedChat(prev => prev ? { 
        ...prev, 
        messages: [...prev.messages, newMessage],
        lastMessage: text 
      } : null);
    }
  };

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
  }

  const handleStartNewChats = (selectedUsers: User[], message: string) => {
    const newChats: Chat[] = selectedUsers.map(user => ({
      id: new Date().toISOString() + user.id,
      user: user,
      lastMessage: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      priority: 'normal',
      channel: 'Webchat',
      messages: [{
        id: 'm-start',
        sender: 'me',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
      isChatbotActive: false,
    }));
    
    setChats(prev => [...newChats, ...prev]);

    if (newChats.length === 1) {
      setSelectedChat(newChats[0]);
    }
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
            <NewChatDialog contacts={mockUsers} onStartChat={handleStartNewChats}>
              <Button variant="ghost" size="icon">
                  <PlusCircle className="h-5 w-5" />
                  <span className="sr-only">New Chat</span>
              </Button>
            </NewChatDialog>
            <UserMenu />
        </div>
    </MainHeader>
  )

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            {user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person glasses"/>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
                <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="sr-only">User Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
         {user ? (
             <>
               <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                 <Settings className="mr-2 h-4 w-4" />
                 <span>Settings</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={onLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Log out</span>
               </DropdownMenuItem>
             </>
         ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  

  const renderMobileView = () => {
    if (!user) {
        // In mobile, login is handled by the main page.tsx which shows LoginDialog full screen
        return null;
    }
    
    if (selectedChat) {
      return (
        <ChatArea 
          chat={selectedChat} 
          onChatbotToggle={handleChatbotToggle} 
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedChat(null)}
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
        <ChatList chats={filteredChats} selectedChat={selectedChat} onSelectChat={handleSelectChat} />
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
            </MainHeader>
            { user ? <SidebarContent /> : null }
          </div>

          <div className="flex flex-1 flex-col h-screen">
             <MainHeader>
                 <div />
                 <div className="flex items-center gap-4">
                    {user && 
                      <NewChatDialog contacts={mockUsers} onStartChat={handleStartNewChats}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <PlusCircle className="h-5 w-5" /> New Chat
                        </Button>
                      </NewChatDialog>
                    }
                     {canAddAgent && <div className="hidden md:flex">
                         <AddAgentDialog onAgentAdd={handleAgentAdd} />
                     </div>}
                     <UserMenu />
                 </div>
             </MainHeader>
            
            <div className="hidden md:block">
                {user && <Stats />}
                <Separator />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                 { user && selectedChat ? (
                    <ChatArea 
                        chat={selectedChat} 
                        onChatbotToggle={handleChatbotToggle} 
                        onSendMessage={handleSendMessage}
                        onBack={() => setSelectedChat(null)}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                        { !user ? (
                            <>
                                <div className="rounded-full bg-primary/10 p-4">
                                    <LogIn className="h-12 w-12 text-primary"/>
                                </div>
                                <h2 className="text-2xl font-bold">Welcome to KenaAI Chat</h2>
                                <p className="text-muted-foreground">Please log in to view and respond to chats.</p>
                                {/* Login on desktop is handled by the main page.tsx component */}
                            </>
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
