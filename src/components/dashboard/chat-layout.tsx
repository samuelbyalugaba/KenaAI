
"use client";

import * as React from "react";
import { useState } from "react";
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

import type { Chat, Message, Priority, UserProfile, Agent } from "@/types";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// MOCK DATA
const mockChats: Chat[] = [
  {
    id: "1",
    user: { name: "Kelvin", avatar: "https://picsum.photos/id/1011/100/100", online: true, email: "kelvin@example.com", phone: "+1-555-0101" },
    lastMessage: "Absolutely 🎨 We provide ful...",
    timestamp: "10:41 AM",
    unreadCount: 0,
    priority: "urgent",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: { name: "Kelvin", avatar: "https://picsum.photos/id/1011/100/100", online: true }, text: "Hello 👋 What services do you offer?", timestamp: "10:38 AM" },
      { id: "m2", sender: "me", text: "Hi Kelvin! 🚀 We offer web app development, mobile app solutions, and AI-powered chatbots.", timestamp: "10:39 AM" },
      { id: "m3", sender: { name: "Kelvin", avatar: "https://picsum.photos/id/1011/100/100", online: true }, text: "Nice! Do you also handle design?", timestamp: "10:40 AM" },
      { id: "m4", sender: "me", text: "Absolutely 🎨 We provide full-stack design: UI/UX, branding, and even responsive front-end with React.", timestamp: "10:41 AM" },
    ],
  },
  {
    id: "2",
    user: { name: "Sylvester", avatar: "https://picsum.photos/id/1025/100/100", online: false, email: "sylvester@example.com", phone: "+1-555-0102" },
    lastMessage: "Sure thing! 💡 I’ll schedule...",
    timestamp: "9:20 AM",
    unreadCount: 0,
    priority: "low",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "Hi there 👋 Can you help me set up an online store?", timestamp: "09:15 AM" },
      { id: "m2", sender: "me", text: "Hello Sylvester! 🌟 Yes, we specialize in e-commerce platforms with secure payments and inventory management.", timestamp: "09:16 AM" },
      { id: "m3", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "That sounds great! Do you also integrate delivery tracking?", timestamp: "09:17 AM" },
      { id: "m4", sender: "me", text: "Absolutely 🚚 We can integrate real-time tracking and automated notifications for your customers.", timestamp: "09:18 AM" },
      { id: "m5", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "Perfect 🙌 I’d love a demo of how it works.", timestamp: "09:19 AM" },
      { id: "m6", sender: "me", text: "Sure thing! 💡 I’ll schedule a quick demo for you this afternoon.", timestamp: "09:20 AM" }
    ],
  },
  {
    id: "3",
    user: { name: "Linaliz", avatar: "https://picsum.photos/id/1027/100/100", online: true, email: "linaliz@example.com", phone: "+1-555-0103" },
    lastMessage: "Anytime, Linaliz! Let me k...",
    timestamp: "Yesterday",
    unreadCount: 0,
    priority: "normal",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Hello 👋 Could you tell me your business hours?", timestamp: "Yesterday" },
      { id: "m2", sender: "me", text: "Hi Linaliz! 🌸 Yes, we’re open Monday to Friday, from 9:00 AM to 6:00 PM.", timestamp: "11:06 AM" },
      { id: "m3", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Great, are you available on weekends too?", timestamp: "Yesterday" },
      { id: "m4", sender: "me", text: "On Saturdays we’re open from 10:00 AM to 2:00 PM ⏰. Sundays we’re closed, but support is still available online.", timestamp: "Yesterday" },
      { id: "m5", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Perfect, thanks for clarifying 🙌", timestamp: "Yesterday" },
      { id: "m6", sender: "me", text: "Anytime, Linaliz! Let me know if you’d like me to book you a slot during business hours.", timestamp: "Yesterday" }
    ],
  },
  {
    id: "4",
    user: { name: "Glory", avatar: "https://picsum.photos/id/103/100/100", online: false, email: "glory@example.com", phone: "+1-555-0104" },
    lastMessage: "My order hasn't arri...",
    timestamp: "Yesterday",
    unreadCount: 0,
    priority: "high",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Hi, I placed an order three weeks ago but it still hasn’t arrived 😟", timestamp: "02:15 PM" },
      { id: "m2", sender: "me", text: "Hello Glory! 🤖 I’m checking your order details. Please provide your order number.", timestamp: "02:16 PM" },
      { id: "m3", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Sure, it’s #ORD4582", timestamp: "02:17 PM" },
      { id: "m4", sender: "me", text: "Thanks! 🔍 This looks like it may need special assistance. Transferring you to a human support agent...", timestamp: "02:18 PM" },
      { id: "m5", sender: "me", text: "Hi Glory, this is Alex from support 👋 I’ll personally look into your order.", timestamp: "02:19 PM" },
      { id: "m6", sender: "me", text: "I see your package was delayed at the courier’s end 🚚. I’ll escalate this and request priority shipping.", timestamp: "02:20 PM" },
      { id: "m7", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Okay, I really hope it arrives soon. I’ve been waiting a long time.", timestamp: "02:21 PM" },
      { id: "m8", sender: "me", text: "I totally understand 💙 I’ll also email you the latest tracking update today and apply a 10% discount voucher for the delay.", timestamp: "02:22 PM" },
      { id: "m9", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Thanks, that’s really helpful 🙏", timestamp: "02:23 PM" }
    ]
  },
];

const KenaAILogo: React.FC = () => {
    return (
      <div className="flex items-center gap-2">
         <Image src="https://picsum.photos/seed/kena-logo/40/40" width={40} height={40} alt="KenaAI Logo" className="rounded-md" data-ai-hint="logo" />
        <span className="font-headline text-2xl font-bold tracking-tighter text-accent">KenaAI</span>
      </div>
    );
  };

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

const ChatArea = ({ chat, onChatbotToggle, onSendMessage }: { chat: Chat | null; onChatbotToggle: (chatId: string, isActive: boolean) => void; onSendMessage: (chatId: string, message: string) => void; }) => {
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
            <ChatHeader chat={chat} onChatbotToggle={onChatbotToggle} />
            <Separator />
            <ScrollArea className="flex-grow">
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

const ChatHeader = ({ chat, onChatbotToggle }: { chat: Chat; onChatbotToggle: (chatId: string, isActive: boolean) => void }) => {
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
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Switch id="chatbot-mode" checked={chat.isChatbotActive} onCheckedChange={(isActive) => onChatbotToggle(chat.id, isActive)} />
                    <Label htmlFor="chatbot-mode">{chat.isChatbotActive ? "Chatbot Active" : "Manual Mode"}</Label>
                </div>
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
        <div className="p-4 bg-background/80 backdrop-blur-sm">
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

export function ChatLayout({ user }: { user: UserProfile }) {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  // This state would normally be fetched, but we'll add it here for the dialog
  const [agents, setAgents] = React.useState<Agent[]>([]);

  React.useEffect(() => {
    const prioritizeChats = async () => {
        const prioritized = await Promise.all(mockChats.map(async chat => {
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
        if (sortedChats.length > 0) {
            setSelectedChat(sortedChats[0]);
        }
    }
    prioritizeChats();
  }, []);

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
                <SelectItem value="email">WhatsApp</SelectItem>
                <SelectItem value="whatsapp">Webchat</SelectItem>
                <SelectItem value="whatsapp">Instagram</SelectItem>
                <SelectItem value="whatsapp">Facebook</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-agents">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-agents">All Agents</SelectItem>
                <SelectItem value="Samuel">Samuel Byalugaba</SelectItem>
                <SelectItem value="sylvester">sylvester Kelvin Malisa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="px-4 text-lg font-semibold tracking-tight">Recent Chats</h2>

        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />

        <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person glasses"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
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
            <div className="flex items-center gap-4">
                <AddAgentDialog onAgentAdd={handleAgentAdd} />
            </div>
        </header>
        <Stats />
        <Separator />
        <ChatArea 
          chat={selectedChat} 
          onChatbotToggle={handleChatbotToggle} 
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
