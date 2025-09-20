

"use client";

import * as React from "react";
import { User, Phone, Mail, Search, MessageSquare, ArrowLeft, PanelLeft, LogIn, UserCheck, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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


const ContactProfile = ({ contact, agents, chatHistory, onBack, user, onNoteAdd, onAssign, onStartChat }: { 
    contact: ContactUser;
    agents: Agent[];
    chatHistory: Message[] | undefined;
    onBack?: () => void;
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
                 <Button variant="outline" onClick={() => onStartChat(contact)}><MessageSquare className="h-4 w-4 mr-2" /> Message</Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-6 pt-0 flex flex-col">
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

                <div className="flex flex-col flex-1 min-h-0">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Agent Notes</h3>
                    <div className="space-y-4 flex flex-col flex-1 min-h-0">
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
                        <ScrollArea className="flex-1">
                            <div className="space-y-4 pr-4">
                                {contact.notes && contact.notes.map(note => (
                                    <div key={note.id} className="text-sm border-l-2 pl-3">
                                        <p className="font-medium">{note.text}</p>
                                        <p className="text-xs text-muted-foreground mt-1">- {note.agentName} on {new Date(note.timestamp).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col flex-1 min-h-0">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversation History</h3>
                    <ScrollArea className="flex-1">
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
  onNavigateToChat: (contact: ContactUser) => void;
};

export function ContactsView({ onMenuClick, user, onNavigateToChat }: ContactsViewProps) {
  const [contacts, setContacts] = React.useState<ContactUser[]>([]);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isImporting, setIsImporting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedContact, setSelectedContact] = React.useState<ContactUser | null>(null);
  const [selectedChatHistory, setSelectedChatHistory] = React.useState<Message[] | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

            if (fetchedContacts.length > 0 && window.innerWidth >= 768) {
                handleSelectContact(fetchedContacts[0], fetchedChats);
            }
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user]);
  
  const handleSelectContact = async (contact: ContactUser, allChats: Chat[]) => {
    setSelectedContact(contact);
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
    setContacts(prev => prev.map(c => 
        c.id === contactId ? { ...c, assignedAgentId: agentId } : c
    ));
    if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, assignedAgentId: agentId } : null);
    }
  };
  
  const handleNoteAdd = (contactId: string, note: Note) => {
     setContacts(prev => prev.map(c => 
        c.id === contactId ? { ...c, notes: [note, ...(c.notes || [])] } : c
    ));
    if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : null);
    }
  }

  const handleContactAdd = (newContact: ContactUser) => {
    setContacts(prev => [newContact, ...prev]);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseCSV(file);
    }
    event.target.value = '';
  };

  const csvToArray = (text: string) => {
    let p = '', row: string[] = [''], ret: string[][] = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            ret.push(row = []);
            i = 0;
        } else row[i] += l;
        p = l;
    }
    if (row.length === 1 && row[0] === '') ret.pop();
    return ret;
  };
  
  const findHeaderIndex = (headers: string[], possibleNames: string[]): number => {
    for (const name of possibleNames) {
        const index = headers.findIndex(h => h.toLowerCase().trim() === name.toLowerCase());
        if (index !== -1) {
            return index;
        }
    }
    return -1;
  };

  const parseCSV = (file: File) => {
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      
      const data = csvToArray(text);
      if (data.length < 2) {
          toast({ variant: "destructive", title: "Invalid CSV", description: "File is empty or not formatted correctly." });
          setIsImporting(false);
          return;
      }

      const headers = data[0].map(h => h.trim().toLowerCase());
      
      const headerMap = {
          name: findHeaderIndex(headers, ['name']),
          givenName: findHeaderIndex(headers, ['given name']),
          familyName: findHeaderIndex(headers, ['family name']),
          email: findHeaderIndex(headers, ['e-mail 1 - value', 'email', 'email address']),
          phone: findHeaderIndex(headers, ['phone 1 - value', 'phone', 'phone number']),
      };

      const requiredColumnsFound = headerMap.name !== -1 || (headerMap.givenName !== -1 || headerMap.familyName !== -1);

      if (!requiredColumnsFound) {
        toast({
            variant: "destructive",
            title: "Invalid CSV format",
            description: "Could not find a required 'Name' column (or 'Given Name'/'Family Name').",
        });
        setIsImporting(false);
        return;
      }
      
      const rows = data.slice(1);
      const contactsData = rows.map(row => {
        let name = '';
        if (headerMap.name !== -1 && row[headerMap.name]) {
            name = row[headerMap.name];
        } else if (headerMap.givenName !== -1 || headerMap.familyName !==-1) {
            const firstName = (headerMap.givenName !== -1 && row[headerMap.givenName]) ? row[headerMap.givenName] : '';
            const lastName = (headerMap.familyName !== -1 && row[headerMap.familyName]) ? row[headerMap.familyName] : '';
            name = `${firstName} ${lastName}`.trim();
        }

        const email = (headerMap.email !== -1 && row[headerMap.email]) ? row[headerMap.email] : '';
        const phone = (headerMap.phone !== -1 && row[headerMap.phone]) ? row[headerMap.phone] : '';
        
        if (!name) return null;

        return { name, email, phone };
      }).filter(Boolean) as { name: string; email: string; phone: string }[];

      if (contactsData.length === 0) {
        toast({ variant: "destructive", title: "No contacts found", description: "The CSV file appears to be empty or in an unsupported format." });
        setIsImporting(false);
        return;
      }

      if (!user?.companyId) {
        toast({ variant: "destructive", title: "Error", description: "Company context not found." });
        setIsImporting(false);
        return;
      }

      const result = await importContactsFromCSV(contactsData, user.companyId);
      if (result.success) {
        setContacts(prev => [...result.newContacts, ...prev]);
        toast({
          title: "Import Successful",
          description: result.message,
        });
      } else {
        toast({ variant: "destructive", title: "Import Failed", description: result.message });
      }
      setIsImporting(false);
    };
    reader.readAsText(file);
  };


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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv"
            />
            <Button variant="outline" onClick={handleImportClick} disabled={isImporting}>
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Importing..." : "Import"}
            </Button>
            <AddContactDialog onContactAdd={handleContactAdd} user={user} />
        </div>
    </header>
    <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Contact List */}
        <div className={cn("md:col-span-1 lg:col-span-1 border-r flex flex-col", selectedContact ? "hidden md:flex" : "flex")}>
            <ScrollArea className="flex-1 h-full">
                {isLoading ? (
                    <div className="p-2 space-y-1">
                        {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-[68px] w-full" />)}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 p-2">
                    {filteredContacts.map((contact) => (
                        <Card 
                            key={contact.id} 
                            onClick={() => handleSelectContact(contact, chats)}
                            className={cn("cursor-pointer hover:bg-muted/50", selectedContact?.id === contact.id && "bg-muted/80")}
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
                )}
            </ScrollArea>
        </div>
        
        {/* Contact Profile */}
        <div className={cn("md:col-span-2 lg:col-span-3 flex flex-col", selectedContact ? "flex" : "hidden md:flex")}>
            {selectedContact ? (
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
            ) : (
                <EmptyState />
            )}
        </div>
    </main>
    </div>
  );
}
