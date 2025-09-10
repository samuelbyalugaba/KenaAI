
"use client";

import * as React from "react";
import { User, Phone, Mail, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { User as ContactUser } from "@/types";
import { cn } from "@/lib/utils";

const mockContacts: ContactUser[] = [
    { name: "Kelvin", avatar: "https://picsum.photos/id/1011/100/100", online: true, email: "kelvin@example.com", phone: "+1-555-0101" },
    { name: "Sylvester", avatar: "https://picsum.photos/id/1025/100/100", online: false, email: "sylvester@example.com", phone: "+1-555-0102" },
    { name: "Linaliz", avatar: "https://picsum.photos/id/1027/100/100", online: true, email: "linaliz@example.com", phone: "+1-555-0103" },
    { name: "Glory", avatar: "https://picsum.photos/id/103/100/100", online: false, email: "glory@example.com", phone: "+1-555-0104" },
    { name: "John Doe", avatar: "https://picsum.photos/id/10/100/100", online: true, email: "john.d@example.com", phone: "+1-555-0105" },
    { name: "Jane Smith", avatar: "https://picsum.photos/id/20/100/100", online: false, email: "jane.s@example.com", phone: "+1-555-0106" },
];

export function ContactsView() {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <div className="flex items-center gap-4">
              <div className="relative w-64">
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
        <main className="flex-1 overflow-auto p-4">
          <Card>
              <CardHeader>
                  <CardTitle>Contact List</CardTitle>
              </CardHeader>
              <CardContent>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                      <Table>
                          <TableHeader>
                          <TableRow>
                              <TableHead className="w-[250px]">Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone Number</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody>
                          {filteredContacts.map((contact) => (
                              <TableRow key={contact.email}>
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
                                          <div className="font-medium">{contact.name}</div>
                                      </div>
                                  </TableCell>
                                  <TableCell>{contact.email}</TableCell>
                                  <TableCell>{contact.phone}</TableCell>
                                  <TableCell className="text-right">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                              <MessageSquare className="h-4 w-4" />
                                              <span className="sr-only">Start Chat</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Start Chat</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                              <Mail className="h-4 w-4" />
                                              <span className="sr-only">Send Email</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Send Email</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                              <Phone className="h-4 w-4" />
                                              <span className="sr-only">Call</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Call</TooltipContent>
                                      </Tooltip>
                                  </TableCell>
                              </TableRow>
                          ))}
                          </TableBody>
                      </Table>
                  </ScrollArea>
              </CardContent>
          </Card>
        </main>
      </div>
    </TooltipProvider>
  );
}
