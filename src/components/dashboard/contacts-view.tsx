
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, MessageSquare, ArrowLeft, PanelLeft, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User as ContactUser, Chat, Message, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { mockUsers, mockChats } from "@/lib/mock-data";


const ContactProfile = ({ contact, chatHistory, onBack }: { contact: ContactUser, chatHistory: Message[] | undefined, onBack?: () => void }) => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                 {onBack && (
                     <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                         <ArrowLeft className="h-4 w-4" />
                     </Button>
                 )}
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{contact.name}</CardTitle>
                    <CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                            <span className={cn(
                                "block h-2 w-2 rounded-full",
                                contact.online ? "bg-green-500" : "bg-gray-400"
                            )} />
                            {contact.online ? "Online" : "Offline"}
                        </div>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Details</h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{contact.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{contact.phone}</span></div>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Agent Notes</h3>
                    <Textarea placeholder="Add a private note for this contact..." rows={3} />
                    <Button size="sm" className="mt-2">Save Note</Button>
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversation History</h3>
                    <ScrollArea className="h-64">
                         <div className="p-4 space-y-4 bg-muted/50 rounded-md">
                            {chatHistory?.length ? chatHistory.map((message) => {
                                const isMe = message.sender === 'me';
                                const sender = isMe ? null : message.sender as { name: string, avatar: string };
                                return (
                                    <div key={message.id} className={cn("flex items-end gap-2 text-sm", isMe ? "justify-end" : "justify-start")}>
                                        {!isMe && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={sender?.avatar} alt={sender?.name} data-ai-hint="person portrait" />
                                                        <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>{sender?.name}</TooltipContent>
                                            </Tooltip>
                                        )}
                                        <div className={cn("max-w-xs rounded-lg px-3 py-2", isMe ? "bg-primary text-primary-foreground" : "bg-background")}>
                                            <p>{message.text}</p>
                                            <p className={cn("text-xs mt-1 opacity-70", isMe ? "text-right" : "text-left")}>{message.timestamp}</p>
                                        </div>
                                    </div>
                                )
                            }) : <p className="text-center text-muted-foreground">No conversation history.</p>}
                        </div>
                    </ScrollArea>
                </div>

            </CardContent>
        </Card>
    )
}

const EmptyState = ({ isLoggedOut, onLogin }: { isLoggedOut: boolean; onLogin: () => void; }) => (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
        {isLoggedOut ? (
            <>
                <div className="rounded-full bg-primary/10 p-4">
                    <LogIn className="h-12 w-12 text-primary"/>
                </div>
                <h2 className="mt-4 text-xl font-semibold">Please Log In</h2>
                <p className="mt-1 text-muted-foreground">Log in to view your contacts.</p>
                <Button onClick={onLogin} className="mt-4">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                </Button>
            </>
        ) : (
            <>
                <User className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-4 text-xl font-semibold">Select a Contact</h2>
                <p className="mt-1 text-muted-foreground">Choose a contact from the list to view their profile and conversation history.</p>
            </>
        )}
    </div>
)

type ContactsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function ContactsView({ onMenuClick, user }: ContactsViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedContact, setSelectedContact] = React.useState<ContactUser | null>(null);
  
  const filteredContacts = user ? mockUsers.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  React.useEffect(() => {
    if (user && window.innerWidth >= 768) {
        setSelectedContact(mockUsers[0]);
    } else {
        setSelectedContact(null);
    }
  }, [user])

  const selectedChatHistory = mockChats.find(chat => chat.user.email === selectedContact?.email)?.messages;

  if (!user) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
              <EmptyState isLoggedOut={true} onLogin={() => {}} />
          </div>
      )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                <h1 className="text-2xl font-bold">Contacts</h1>
            </div>
            <Button>Add Contact</Button>
        </header>
        <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Contact List */}
            <div className={cn("md:col-span-1 lg:col-span-1 border-r flex-col", selectedContact ? "hidden md:flex" : "flex")}>
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search contacts..." 
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredContacts.map((contact) => (
                            <TableRow 
                                key={contact.email} 
                                onClick={() => setSelectedContact(contact)}
                                className={cn("cursor-pointer", selectedContact?.email === contact.email && "bg-muted/50")}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className={cn(
                                            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background",
                                            contact.online ? "bg-green-500" : "bg-gray-400"
                                        )} />
                                        </div>
                                        <div>
                                            <div className="font-medium">{contact.name}</div>
                                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right hidden sm:table-cell">
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="sr-only">Start Chat</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Start Chat</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            
            {/* Contact Profile */}
            <div className={cn("md:col-span-2 lg:col-span-3 overflow-auto", selectedContact ? "block" : "hidden md:block")}>
                {selectedContact ? (
                    <ContactProfile 
                        contact={selectedContact} 
                        chatHistory={selectedChatHistory} 
                        onBack={() => setSelectedContact(null)} 
                    />
                ) : (
                    <EmptyState isLoggedOut={!user} onLogin={() => {}} />
                )}
            </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
