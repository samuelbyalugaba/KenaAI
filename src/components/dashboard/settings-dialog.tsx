"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ActivityLog, Agent, UserProfile } from "@/types"
import { useTheme } from "@/hooks/use-theme"
import { Camera, User, Settings as SettingsIcon, MessageSquare, Bot, Link, Shield, Users, HelpCircle, Log, CreditCard, Puzzle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Textarea } from "../ui/textarea"
import { getActivityLogs } from "@/app/actions"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserProfile | null
  onUserUpdate: (user: Partial<UserProfile>) => void
}

type SettingsSection = "profile" | "integrations" | "chatbot" | "help"

const settingsNavItems = (user: UserProfile | null) => {
    const allItems = [
        { id: "profile", label: "Profile & Account", icon: User, forAll: true },
        { id: "integrations", label: "Platform Integrations", icon: Link, forAll: false },
        { id: "chatbot", label: "Chatbot Settings", icon: Bot, forAll: false },
        { id: "help", label: "Help & Support", icon: HelpCircle, forAll: true },
    ];
    if (user?.role === 'admin') {
        return allItems;
    }
    return allItems.filter(item => item.forAll);
}

const SettingsNav = ({ activeSection, setActiveSection, user }: { activeSection: SettingsSection, setActiveSection: (section: SettingsSection) => void, user: UserProfile | null }) => (
    <nav className="flex flex-col gap-1 p-2 border-b md:border-b-0 md:border-r">
        {settingsNavItems(user).map(item => (
            <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="justify-start gap-3"
                onClick={() => setActiveSection(item.id as SettingsSection)}
            >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:inline">{item.label}</span>
            </Button>
        ))}
    </nav>
);

// --- Setting Section Components ---

const ProfileSettings = ({ user }: { user: UserProfile }) => {
    const { theme, setTheme } = useTheme();
    return (
        <Tabs defaultValue="personal" className="h-full">
            <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 hover:bg-background hidden">
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Change Photo</span>
                          </Button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"> <Label htmlFor="name">Name</Label> <Input id="name" defaultValue={user.name} /> </div>
                            <div className="space-y-1"> <Label htmlFor="email">Email Address</Label> <Input id="email" type="email" defaultValue={user.email} /> </div>
                        </div>
                        <div className="space-y-1"> <Label htmlFor="phone">Phone Number</Label> <Input id="phone" type="tel" defaultValue={user.phone} /> </div>
                    </div>
                     <div className="space-y-4 border-t pt-6">
                        <h4 className="font-semibold">Change Password</h4>
                        <div className="space-y-2"> <Label htmlFor="current-password">Current Password</Label> <Input id="current-password" type="password" /> </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"> <Label htmlFor="new-password">New Password</Label> <Input id="new-password" type="password" /> </div>
                            <div className="space-y-2"> <Label htmlFor="confirm-password">Confirm Password</Label> <Input id="confirm-password" type="password" /> </div>
                        </div>
                    </div>
                     <div className="flex justify-end pt-6"> <Button>Save Changes</Button> </div>
                  </div>
            </TabsContent>
            <TabsContent value="notifications">
                 <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">In-App Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive alerts directly within the dashboard.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                       <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Get summaries and important alerts sent to your email.</p>
                        </div>
                        <Switch />
                      </div>
                       <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive urgent alerts via text message.</p>
                        </div>
                        <Switch />
                      </div>
                       <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">Get browser notifications for new messages.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                 </div>
                 <div className="flex justify-end pt-6"> <Button>Save Preferences</Button> </div>
            </TabsContent>
            <TabsContent value="appearance">
                 <div className="space-y-6">
                     <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex items-center space-x-2">
                            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en-us">
                          <SelectTrigger id="language"> <SelectValue /> </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-us">English (United States)</SelectItem>
                            <SelectItem value="es-es">Español (España)</SelectItem>
                            <SelectItem value="fr-fr">Français (France)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="est">
                          <SelectTrigger id="timezone"> <SelectValue /> </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>
                  <div className="flex justify-end pt-6"> <Button>Save Settings</Button> </div>
            </TabsContent>
        </Tabs>
    )
}

const IntegrationSettings = () => {
    const integrations = [
        { name: "WhatsApp", connected: true, icon: MessageSquare, description: "Engage with customers on WhatsApp." },
        { name: "Facebook", connected: false, icon: MessageSquare, description: "Connect with your Facebook audience." },
        { name: "Instagram", connected: true, icon: MessageSquare, description: "Manage your Instagram DMs." },
        { name: "HubSpot", comingSoon: true, icon: Puzzle, description: "Sync contacts and leads with HubSpot." },
        { name: "Salesforce", comingSoon: true, icon: Puzzle, description: "Integrate with your Salesforce CRM." },
        { name: "Billing", comingSoon: true, icon: CreditCard, description: "Manage your subscription and view invoices." },
    ];

    return (
        <div className="space-y-4">
            {integrations.map(int => (
                <Card key={int.name}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <int.icon className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <CardTitle className="text-base">{int.name} {int.comingSoon && <Badge variant="outline" className="ml-2">Coming Soon</Badge>}</CardTitle>
                                <CardDescription className="text-xs">{int.description}</CardDescription>
                            </div>
                        </div>
                        <Button variant={int.connected ? "destructive" : "default"} disabled={int.comingSoon}>
                            {int.connected ? "Disconnect" : "Connect"}
                        </Button>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};

const ChatbotSettings = () => (
    <Card>
        <CardHeader><CardTitle>Chatbot &amp; Conversation</CardTitle></CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="greeting">Default Greeting</Label>
                <Input id="greeting" placeholder="Welcome to our support! How can I help you today?" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="fallback">Fallback Response</Label>
                <Input id="fallback" placeholder="I'm sorry, I didn't understand. Let me get a human for you." />
            </div>
            <div className="space-y-2">
                <Label>Knowledge Base</Label>
                 <Input id="picture" type="file" />
                 <p className="text-xs text-muted-foreground">Upload FAQs or training data to improve bot accuracy.</p>
            </div>
        </CardContent>
    </Card>
);

const HelpSettings = () => (
    <div className="space-y-4">
        <Card>
            <CardHeader><CardTitle>Help Center</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Find articles, tutorials, and answers to common questions.</p>
                <Button variant="outline" className="mt-4">Visit Help Center</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Contact Support</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Can't find what you're looking for? Chat with our support team.</p>
                <Button className="mt-4">Start Live Chat</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Submit Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <Textarea placeholder="Share your suggestions or report a bug..."/>
                 <Button>Submit</Button>
            </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">App Version: 1.0.0</p>
    </div>
);


export function SettingsDialog({ open, onOpenChange, user, onUserUpdate }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("profile");

  if (!user) return null

  const renderSection = () => {
      switch (activeSection) {
          case 'profile':
              return <ProfileSettings user={user} />;
          case 'integrations':
              return <IntegrationSettings />;
          case 'chatbot':
              return <ChatbotSettings />;
          case 'help':
              return <HelpSettings />;
          default:
              return <ProfileSettings user={user} />;
      }
  }
  
  const sectionTitles: Record<SettingsSection, string> = {
      profile: "Profile & Account",
      integrations: "Platform Integrations",
      chatbot: "Chatbot Settings",
      help: "Help & Support"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-xl">{sectionTitles[activeSection]}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] flex-1 overflow-hidden">
            <SettingsNav activeSection={activeSection} setActiveSection={setActiveSection} user={user} />
            <ScrollArea className="flex-1">
                <div className="p-6">
                    {renderSection()}
                </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
