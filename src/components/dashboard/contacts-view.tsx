
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, MessageSquare, ArrowLeft, PanelLeft, LogIn, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User as ContactUser, Chat, Message, UserProfile, Agent } from "@/types";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { mockUsers as initialMockUsers, mockChats, mockAgents } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


type Note = {
    id: number;
    agent: string;
    text: string;
    timestamp: string;
}

const exampleNotes: Note[] = [
    { id: 1, agent: "Sylvester Mayaya", text: "Customer is interested in the enterprise plan. Follow up next week.", timestamp: "2024-07-29 10:30 AM" },
    { id: 2, agent: "Samuel Byalugaba", text: "Had a difficult call regarding a billing issue. Offered a 10% discount on next month's invoice.", timestamp: "2024-07-28 02:45 PM" },
    { id: 3, agent: "Sylvester Mayaya", text: "Called to confirm delivery address. Everything is correct.", timestamp: "2024-07-27 11:15 AM" },
];


const ContactProfile = ({ contact, onAssign, chatHistory, onBack, user }: { contact: ContactUser, onAssign: (contactId: string, agentId: string) => void, chatHistory: Message[] | undefined, onBack?: () => void, user: UserProfile | null }) => {
    const { toast } = useToast();
    const [note, setNote] = React.useState("");
    const [notes, setNotes] = React.useState<Note[]>(exampleNotes);
    const assignedAgent = mockAgents.find(a => a.id === contact.assignedAgentId);
    
    const handleSaveNote = () => {
        if (!note.trim()) {
            toast({
                variant: "destructive",
                title: "Empty Note",
                description: "Cannot save an empty note.",
            })
            return;
        }
        
        const newNote: Note = {
            id: Date.now(),
            agent: user?.name || "Current Agent",
            text: note,
            timestamp: new Date().toLocaleString(),
        }

        setNotes(prev => [newNote, ...prev]);

        toast({
            title: "Note Saved",
            description: `Your note for ${contact.name} has been saved.`,
        });
        setNote("");
    }
    
    const handleAssignAgent = (agentId: string) => {
        onAssign(contact.id, agentId);
    }

    return (
        <Card className="h-full flex flex-col border-0 shadow-none md:border md:shadow-sm rounded-none md:rounded-lg">
            <CardHeader className="flex flex-row items-center gap-4">
                 {onBack && (
                     <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}>
                         <ArrowLeft className="h-5 w-5" />
                     </Button>
                 )}
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-2xl">{contact.name}</CardTitle>
                    <CardDescription>
                       Last active: 2 hours ago
                    </CardDescription>
                </div>
                 <Button variant="outline"><MessageSquare className="h-4 w-4 mr-2" /> Message</Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-6 pt-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{contact.email}</span></div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{contact.phone}</span></div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned Agent</h3>
                         {user?.role === 'admin' ? (
                            <Select onValueChange={handleAssignAgent} defaultValue={assignedAgent?.id}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {mockAgents.map(agent => (
                                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         ) : (
                            assignedAgent ? (
                                <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={assignedAgent.avatar} alt={assignedAgent.name} data-ai-hint="person portrait" />
                                        <AvatarFallback>{assignedAgent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {assignedAgent.name}
                                </Badge>
                            ) : <Badge variant="outline">Unassigned</Badge>
                         )}
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Agent Notes</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} alt={user?.name || ""} data-ai-hint="person portrait" />
                                <AvatarFallback>{user?.name ? user.name.charAt(0) : 'A'}</AvatarFallback>
                            </Avatar>
                             <div className="flex-1">
                                 <Textarea 
                                    placeholder="Add a private note for this contact..." 
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                 <Button size="sm" className="mt-2" onClick={handleSaveNote}>Save Note</Button>
                             </div>
                        </div>
                        <ScrollArea className="h-48">
                            <div className="space-y-4 pr-4">
                                {notes.map(note => (
                                    <div key={note.id} className="text-sm border-l-2 pl-3">
                                        <p className="font-medium">{note.text}</p>
                                        <p className="text-xs text-muted-foreground mt-1">- {note.agent} on {note.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
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
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={sender?.avatar} alt={sender?.name} data-ai-hint="person portrait" />
                                                <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
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

const EmptyState = () => (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
        <UserCheck className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Select a Contact</h2>
        <p className="mt-1 text-muted-foreground">Choose a contact from the list to view their profile and conversation history.</p>
    </div>
)

type ContactsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function ContactsView({ onMenuClick, user }: ContactsViewProps) {
  const [contacts, setContacts] = React.useState<ContactUser[]>(initialMockUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedContact, setSelectedContact] = React.useState<ContactUser | null>(null);
  const { toast } = useToast();
  
  const filteredContacts = user ? contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  React.useEffect(() => {
    if (user && window.innerWidth >= 768 && !selectedContact) {
        setSelectedContact(contacts[0]);
    } else if (!user) {
        setSelectedContact(null);
    }
  }, [user, contacts])

  const handleAssignAgent = (contactId: string, agentId: string) => {
    const updatedContacts = contacts.map(c => 
        c.id === contactId ? { ...c, assignedAgentId: agentId } : c
    );
    setContacts(updatedContacts);
    
    if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, assignedAgentId: agentId } : null);
    }

    const agent = mockAgents.find(a => a.id === agentId);
    toast({
      title: "Contact Assigned",
      description: `${selectedContact?.name} has been assigned to ${agent?.name || 'Unassigned'}.`,
    });
  };

  const selectedChatHistory = mockChats.find(chat => chat.user.email === selectedContact?.email)?.messages;

  if (!user) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
               <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <LogIn className="h-12 w-12 text-primary"/>
                    <h2 className="mt-4 text-xl font-semibold">Please Log In</h2>
                    <p className="mt-1 text-muted-foreground">Log in to view and manage your contacts.</p>
                </div>
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
            <h1 className="text-2xl font-bold">Contacts</h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search contacts..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button>Add Contact</Button>
        </div>
    </header>
    <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Contact List */}
        <div className={cn("md:col-span-1 lg:col-span-1 border-r flex flex-col", selectedContact ? "hidden md:flex" : "flex")}>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                {filteredContacts.map((contact) => (
                    <Card 
                        key={contact.email} 
                        onClick={() => setSelectedContact(contact)}
                        className={cn("cursor-pointer hover:bg-muted/50", selectedContact?.email === contact.email && "bg-muted/80")}
                    >
                        <CardHeader className="p-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{contact.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{contact.email}</div>
                                </div>
                                {contact.assignedAgentId && (
                                    <Badge variant="secondary" className="h-5 text-xs">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        Assigned
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
                </div>
            </ScrollArea>
        </div>
        
        {/* Contact Profile */}
        <div className={cn("md:col-span-2 lg:col-span-3 overflow-auto", selectedContact ? "block" : "hidden md:block")}>
            {selectedContact ? (
                <ContactProfile 
                    contact={selectedContact}
                    onAssign={handleAssignAgent}
                    chatHistory={selectedChatHistory} 
                    onBack={() => setSelectedContact(null)}
                    user={user}
                />
            ) : (
                <EmptyState />
            )}
        </div>
    </main>
    </div>
  );
}
