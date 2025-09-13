
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";
import { Search, UserPlus, ArrowLeft, Send } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";

type NewChatDialogProps = {
  children: React.ReactNode;
  contacts: User[];
  onStartChat: (users: User[], message: string) => void;
};

export function NewChatDialog({ children, contacts, onStartChat }: NewChatDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedContacts, setSelectedContacts] = React.useState<User[]>([]);
  const [newContactInput, setNewContactInput] = React.useState("");
  const [view, setView] = React.useState<'select' | 'compose'>('select');
  const [message, setMessage] = React.useState('');
  const { toast } = useToast();

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (contact: User) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts);
    } else {
      setSelectedContacts([]);
    }
  }

  const handleNext = () => {
    const allUsersToChat = [...selectedContacts];

    if (newContactInput.trim()) {
        if (newContactInput.includes('@') || /^\+?[0-9\s-]+$/.test(newContactInput)) {
            const newUser: User = {
                id: `new-${new Date().toISOString()}`,
                name: newContactInput,
                avatar: `https://picsum.photos/seed/${newContactInput}/100/100`,
                online: false,
                email: newContactInput.includes('@') ? newContactInput : undefined,
                phone: !newContactInput.includes('@') ? newContactInput : undefined,
            }
            // Avoid duplicates
            if (!allUsersToChat.some(u => u.email === newUser.email || u.phone === newUser.phone)) {
                 allUsersToChat.push(newUser);
            }
        } else {
            toast({
                variant: 'destructive',
                title: "Invalid Input",
                description: "Please enter a valid email address or phone number for the new contact.",
            })
            return;
        }
    }

    if (allUsersToChat.length === 0) {
        toast({
            variant: 'destructive',
            title: "No recipients selected",
            description: "Please select at least one contact or enter a new one.",
        })
        return;
    }
    
    setSelectedContacts(allUsersToChat);
    setView('compose');
  }

  const handleSend = () => {
    if (message.trim().length === 0) {
        toast({
            variant: 'destructive',
            title: "Empty Message",
            description: "Please write a message to send.",
        })
        return;
    }
    onStartChat(selectedContacts, message);
    resetState();
  }

  const resetState = () => {
    setOpen(false);
    setView('select');
    setSelectedContacts([]);
    setNewContactInput("");
    setSearchTerm("");
    setMessage("");
  }
  
  React.useEffect(() => {
    if(!open) {
        // Reset state when dialog is closed
        setTimeout(resetState, 300);
    }
  }, [open]);

  const numSelected = selectedContacts.length + (newContactInput.trim() ? (selectedContacts.some(c => c.name === newContactInput) ? 0 : 1) : 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col">
        {view === 'select' ? (
          <>
            <DialogHeader>
              <DialogTitle>Start New Chat</DialogTitle>
              <DialogDescription>
                Select contacts or enter a new email/phone number.
              </DialogDescription>
            </DialogHeader>
            
            <div className="pr-6">
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

            <ScrollArea className="flex-1 -mr-6 pr-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2">
                         <Checkbox 
                            id="select-all" 
                            checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="select-all" className="font-medium cursor-pointer">
                            Select All
                        </Label>
                    </div>
                    <Separator />
                    {filteredContacts.map(contact => (
                        <div key={contact.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                            <Checkbox 
                                id={`contact-${contact.id}`} 
                                checked={selectedContacts.some(c => c.id === contact.id)}
                                onCheckedChange={() => handleSelectContact(contact)}
                            />
                            <Label htmlFor={`contact-${contact.id}`} className="flex-1 flex items-center gap-3 cursor-pointer">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground">{contact.email || contact.phone}</p>
                                </div>
                            </Label>
                        </div>
                    ))}
                    {filteredContacts.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">No contacts found.</p>
                    )}
                </div>
            </ScrollArea>
            
            <div className="pr-6">
                <Separator className="my-4" />
                <Label htmlFor="new-contact" className="text-sm font-medium">New Contact</Label>
                <div className="relative mt-2">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="new-contact"
                    placeholder="Enter email or phone number..."
                    className="pl-9"
                    value={newContactInput}
                    onChange={(e) => setNewContactInput(e.target.value)}
                    />
                </div>
            </div>

            <DialogFooter className="pt-4 pr-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleNext} disabled={numSelected === 0}>
                Next ({numSelected})
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
             <DialogHeader>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setView('select')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <DialogTitle>Compose Message</DialogTitle>
                        <DialogDescription>
                            Your message will be sent to {selectedContacts.length} recipient(s).
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex flex-wrap gap-1 p-2 border rounded-md">
                {selectedContacts.map(c => (
                    <Badge key={c.id} variant="secondary">{c.name}</Badge>
                ))}
            </div>

            <Textarea 
                placeholder="Type your message here..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setView('select')}>Back</Button>
              <Button onClick={handleSend} disabled={message.trim().length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
