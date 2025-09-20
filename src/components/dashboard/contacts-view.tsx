
"use client";

import * as React from "react";
import { User as UserIcon, Phone, Mail, Search, PanelLeft, UserCheck, Upload, ArrowLeft, MoreVertical, Grip, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User as ContactUser, Chat, Message, UserProfile, Agent, Note } from "@/types";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getContactsByCompany, getAgentsByCompany, assignAgentToContact, addNoteToContact, getMessagesForChat, getChatsByCompany, importContactsFromCSV } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { AddContactDialog } from "./add-contact-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


const ContactProfile = ({ contact, agents, chatHistory, onBack, user, onNoteAdd, onAssign, onStartChat }: { 
    contact: ContactUser;
    agents: Agent[];
    chatHistory: Message[] | undefined;
    onBack: () => void;
    user: UserProfile | null;
    onNoteAdd: (contactId: string, note: Note) => void;
    onAssign: (contactId: string, agentId: string) => void;
    onStartChat: (contact: ContactUser) => void;
}) => {
    const { toast } = useToast();
    const [note, setNote] = React.useState("");
    const assignedAgent = agents.find(a => a.id === contact.assignedAgentId);
    
    const handleSaveNote = async () => {
        if (!note.trim() || !user) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Cannot save an empty note.",
            })
            return;
        }
        
        const result = await addNoteToContact(contact.id, user.id, user.name, note);

        if (result.success && result.note) {
            onNoteAdd(contact.id, result.note);
            toast({
                title: "Note Saved",
                description: `Your note for ${contact.name} has been saved.`,
            });
            setNote("");
        } else {
            toast({ variant: 'destructive', title: "Failed to save note." });
        }
    }
    
    const handleAssignAgent = (agentId: string) => {
        assignAgentToContact(contact.id, agentId);
        onAssign(contact.id, agentId);
        
        const agent = agents.find(a => a.id === agentId);
        toast({
          title: "Contact Assigned",
          description: `${contact?.name} has been assigned to ${agent?.name || 'Unassigned'}.`,
        });
    }

    return (
        <div className="h-full flex flex-col">
            <header className="flex-shrink-0 p-4 border-b flex items-center gap-4">
                 <Button variant="ghost" size="icon" className="-ml-2" onClick={onBack}>
                     <ArrowLeft className="h-5 w-5" />
                 </Button>
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{contact.name}</h2>
                    <p className="text-sm text-muted-foreground">
                       Last active: 2 hours ago
                    </p>
                </div>
                 <Button variant="outline" onClick={() => onStartChat(contact)}>
                   <Mail className="h-4 w-4 mr-2" /> Message
                 </Button>
            </header>
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{contact.email || 'No email'}</span></div>
                                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{contact.phone || 'No phone'}</span></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned Agent</h3>
                            {(user?.role === 'admin' || user?.role === 'super_agent') ? (
                                <Select onValueChange={handleAssignAgent} defaultValue={assignedAgent?.id}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                        {agents.map(agent => (
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

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Agent Notes</h3>
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
                        <ScrollArea className="space-y-4 max-h-48">
                            {contact.notes && contact.notes.map(note => (
                                <div key={note.id} className="text-sm border-l-2 pl-3 py-2">
                                    <p className="font-medium">{note.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">- {note.agentName} on {new Date(note.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Conversation History</h3>
                        <ScrollArea className="p-4 space-y-4 bg-muted/50 rounded-md max-h-72">
                            {chatHistory === undefined && <Skeleton className="h-24 w-full" />}
                            {chatHistory && chatHistory.length > 0 ? chatHistory.map((message) => {
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
                                            <p className={cn("text-xs mt-1 opacity-70", isMe ? "text-right" : "text-left")}>{new Date(message.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                )
                            }) : chatHistory && <p className="text-center text-muted-foreground">No conversation history.</p>}
                        </ScrollArea>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

const ContactCard = ({ contact, onClick }: { contact: ContactUser, onClick: () => void }) => {
    return (
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={onClick}
        >
            <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="absolute top-0 right-0 -mr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <h3 className="font-bold text-lg">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">Marketing Manager</p>
                <a href="#" className="text-sm text-primary hover:underline">Highspeed Studios</a>
                <Separator className="my-4" />
                <div className="w-full space-y-2 text-left text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-muted-foreground">{contact.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-muted-foreground">{contact.email || "N/A"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
};


type ContactsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
  onNavigateToChat: (contact: ContactUser) => void;
};

export function ContactsView({ onMenuClick, user, onNavigateToChat }: ContactsViewProps) {
  const [contacts, setContacts] = React.useState<ContactUser[]>([]);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedContact, setSelectedContact] = React.useState<ContactUser | null>(null);
  const [selectedChatHistory, setSelectedChatHistory] = React.useState<Message[] | undefined>(undefined);
  const { toast } = useToast();
  
  React.useEffect(() => {
    async function fetchData() {
        if(user?.companyId) {
            setIsLoading(true);
            const [fetchedContacts, fetchedAgents, fetchedChats] = await Promise.all([
                getContactsByCompany(user.companyId),
                getAgentsByCompany(user.companyId),
                getChatsByCompany(user.companyId),
            ]);
            setContacts(fetchedContacts);
            setAgents(fetchedAgents);
            setChats(fetchedChats);
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user]);
  
  const handleSelectContact = async (contact: ContactUser, allChats: Chat[]) => {
    setSelectedContact(contact);
    setSelectedChatHistory(undefined); // Show loading state
    const relevantChat = allChats.find(chat => chat.user.id === contact.id);
    if (relevantChat) {
      const messages = await getMessagesForChat(relevantChat.id);
      setSelectedChatHistory(messages);
    } else {
      setSelectedChatHistory([]);
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAssignAgent = (contactId: string, agentId: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, assignedAgentId: agentId } : c));
    if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, assignedAgentId: agentId } : null);
    }
  };
  
  const handleNoteAdd = (contactId: string, note: Note) => {
     setContacts(prev => prev.map(c => c.id === contactId ? { ...c, notes: [note, ...(c.notes || [])] } : c));
    if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : null);
    }
  }

  const handleContactAdd = (newContact: ContactUser) => {
    setContacts(prev => [newContact, ...prev]);
  };

  const MainView = () => (
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <header className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-6 bg-background border-b">
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <p className="text-sm text-muted-foreground">Manage your customer contacts.</p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search here..." 
                        className="pl-9 bg-muted/50 border-none focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center bg-muted/50 p-1 rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8"><Grip className="h-4 w-4" /></Button>
                </div>
                <AddContactDialog onContactAdd={handleContactAdd} user={user}>
                   <Button>New Contact</Button>
                </AddContactDialog>
            </div>
        </header>
        <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
                ) : (
                    filteredContacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} onClick={() => handleSelectContact(contact, chats)} />
                    ))
                )}
            </div>
        </ScrollArea>
      </div>
  )

  if (selectedContact) {
      return (
          <ContactProfile 
              contact={selectedContact}
              agents={agents}
              chatHistory={selectedChatHistory} 
              onBack={() => setSelectedContact(null)}
              user={user}
              onNoteAdd={handleNoteAdd}
              onAssign={handleAssignAgent}
              onStartChat={onNavigateToChat}
          />
      )
  }

  return <MainView />;
}

    