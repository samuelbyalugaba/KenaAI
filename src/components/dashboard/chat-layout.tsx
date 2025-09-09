"use client";

import * as React from "react";
import Image from "next/image";
import {
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Info,
  MessageSquare,
  Paperclip,
  Phone,
  PlusCircle,
  Search,
  Send,
  Settings,
  Smile,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import type { Chat, Message, Priority } from "@/types";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// MOCK DATA
const mockChats: Chat[] = [
  {
    id: "1",
    user: { name: "Alice", avatar: "https://picsum.photos/id/1011/100/100", online: true },
    lastMessage: "I'm having trouble with my subscription. Can you help?",
    timestamp: "10:40 AM",
    unreadCount: 2,
    priority: "urgent",
    messages: [
      { id: "m1", sender: { name: "Alice", avatar: "https://picsum.photos/id/1011/100/100", online: true }, text: "Hello?", timestamp: "10:38 AM" },
      { id: "m2", sender: "me", text: "Hi Alice, how can I help you today?", timestamp: "10:39 AM" },
      { id: "m3", sender: { name: "Alice", avatar: "https://picsum.photos/id/1011/100/100", online: true }, text: "I'm having trouble with my subscription. Can you help?", timestamp: "10:40 AM" },
    ],
  },
  {
    id: "2",
    user: { name: "Bob", avatar: "https://picsum.photos/id/1025/100/100", online: false },
    lastMessage: "Thanks for your help! Everything is working now.",
    timestamp: "9:30 AM",
    unreadCount: 0,
    priority: "low",
    messages: [
      { id: "m4", sender: { name: "Bob", avatar: "https://picsum.photos/id/1025/100/100", online: false }, text: "I need to reset my password.", timestamp: "9:25 AM" },
      { id: "m5", sender: "me", text: "Sure, I've sent a reset link to your email.", timestamp: "9:28 AM" },
      { id: "m6", sender: { name: "Bob", avatar: "https://picsum.photos/id/1025/100/100", online: false }, text: "Thanks for your help! Everything is working now.", timestamp: "9:30 AM" },
    ],
  },
  {
    id: "3",
    user: { name: "Charlie", avatar: "https://picsum.photos/id/1027/100/100", online: true },
    lastMessage: "What are your business hours?",
    timestamp: "Yesterday",
    unreadCount: 0,
    priority: "normal",
    messages: [
      { id: "m7", sender: { name: "Charlie", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "What are your business hours?", timestamp: "Yesterday" },
    ],
  },
  {
    id: "4",
    user: { name: "Diana", avatar: "https://picsum.photos/id/103/100/100", online: false },
    lastMessage: "My order hasn't arrived yet, and it's been 3 weeks.",
    timestamp: "Yesterday",
    unreadCount: 1,
    priority: "high",
    messages: [
        { id: "m8", sender: { name: "Diana", avatar: "https://picsum.photos/id/103/100/100", online: false }, text: "My order hasn't arrived yet, and it's been 3 weeks.", timestamp: "Yesterday" },
    ]
  },
];

const KenaAILogo = () => (
  <div className="font-headline text-2xl font-bold tracking-tighter text-accent">
    KenaAI
  </div>
);

// SUB-COMPONENTS
const ChatList = ({ chats, selectedChat, onSelectChat }: { chats: Chat[], selectedChat: Chat | null, onSelectChat: (chat: Chat) => void }) => (
  <ScrollArea className="flex-grow">
    <div className="flex flex-col gap-2 p-4 pt-0">
      {chats.map((chat) => (
        <button
          key={chat.id}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-primary/10",
            selectedChat?.id === chat.id && "bg-primary/20"
          )}
          onClick={() => onSelectChat(chat)}
        >
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src={chat.user.avatar} alt={chat.user.name} data-ai-hint="person portrait" />
            <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
            {chat.user.online && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />}
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{chat.user.name}</h3>
              <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              <div className="flex items-center gap-2">
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

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const variant: "destructive" | "default" | "secondary" | "outline" = {
    urgent: "destructive",
    high: "default",
    normal: "secondary",
    low: "outline",
  }[priority];
  
  return <Badge variant={variant} className="capitalize h-5">{priority}</Badge>;
}

const Stats = () => {
    const stats = [
        { title: "Total Chats", value: "1,254", icon: MessageSquare },
        { title: "Open", value: "40", icon: Users },
        { title: "Closed", value: "1,200", icon: CheckCircle },
        { title: "Pending", value: "14", icon: Clock },
        { title: "Avg. Response", value: "5m 32s", icon: Clock },
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

const ChatArea = ({ chat }: { chat: Chat | null }) => {
    if (!chat) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                <div className="rounded-full bg-primary/10 p-4">
                    <MessageSquare className="h-12 w-12 text-primary"/>
                </div>
                <h2 className="text-2xl font-bold">Welcome to KenaAI</h2>
                <p className="text-muted-foreground">Select a chat to start messaging.</p>
            </div>
        )
    }
  
    return (
        <div className="flex flex-1 flex-col">
            <ChatHeader chat={chat} />
            <Separator />
            <ScrollArea className="flex-grow">
                <div className="p-4 space-y-4">
                    {chat.messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                </div>
            </ScrollArea>
            <Separator />
            <ChatInput />
        </div>
    );
};

const ChatHeader = ({ chat }: { chat: Chat }) => {
    const [summary, setSummary] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleSummarize = async () => {
        setIsLoading(true);
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
        setIsLoading(false);
    }

    return (
        <div className="flex items-center p-2 px-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{chat.user.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", chat.user.online ? "bg-green-500" : "bg-gray-400")}></span>
                        {chat.user.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground"><Phone className="h-5 w-5"/></Button>
                        </TooltipTrigger>
                        <TooltipContent>Voice Call</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground"><Video className="h-5 w-5"/></Button>
                        </TooltipTrigger>
                        <TooltipContent>Video Call</TooltipContent>
                    </Tooltip>

                    <Sheet open={!!summary || isLoading} onOpenChange={(isOpen) => !isOpen && setSummary(null)}>
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
                          {isLoading && <p>Generating summary...</p>}
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

const ChatInput = () => (
    <div className="p-4 bg-background/80 backdrop-blur-sm">
        <form className="relative">
            <Textarea
                placeholder="Type a message..."
                className="pr-24 min-h-[48px] resize-none"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground"><Paperclip className="h-5 w-5" /></Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground"><Smile className="h-5 w-5" /></Button>
                        </TooltipTrigger>
                        <TooltipContent>Add emoji</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
            </div>
        </form>
    </div>
);


// MAIN LAYOUT
export function ChatLayout() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);

  React.useEffect(() => {
    // Simulate fetching chats and getting their priority
    const prioritizeChats = async () => {
        const prioritized = await Promise.all(mockChats.map(async chat => {
            try {
                const result = await chatPrioritization({ chatText: chat.lastMessage });
                return { ...chat, priority: result.priority };
            } catch {
                return chat; // Fallback to original priority
            }
        }));
        setChats(prioritized);
        if (prioritized.length > 0) {
            setSelectedChat(prioritized[0]);
        }
    }
    prioritizeChats();
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 lg:w-96 border-r bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <KenaAILogo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <PlusCircle className="h-5 w-5" /> New Chat
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all-channels">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-channels">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-agents">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-agents">All Agents</SelectItem>
                <SelectItem value="alex">Alex Turner</SelectItem>
                <SelectItem value="bob">Bob Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="px-4 text-lg font-semibold tracking-tight">Recent Chats</h2>

        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />

        <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://picsum.photos/id/1/100/100" alt="Alex Turner" data-ai-hint="person glasses"/>
                    <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold">Alex Turner</p>
                    <p className="text-sm text-muted-foreground">Super Agent</p>
                </div>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5 text-muted-foreground"/>
                </Button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-4 border-b">
            <h1 className="text-2xl font-bold">Chats</h1>
            <AddAgentDialog />
        </header>
        <Stats />
        <Separator />
        <ChatArea chat={selectedChat} />
      </div>
    </div>
  );
}
