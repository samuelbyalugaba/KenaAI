
"use client";

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { AgentsView } from "@/components/dashboard/agents-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { Agent, UserProfile } from "@/types";
import { AnnouncementsView } from "@/components/dashboard/announcements-view";
import { LoginDialog } from "@/components/dashboard/login-dialog";
import { mockAgents } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export type View = "Chat" | "Contacts" | "Agents" | "Dashboard" | "Announcements" | "History" | "Payments" | "Settings" | "System Settings" | "Campaigns" | "Analytics" | "My Performance";

const PlaceholderView = ({ title, onMenuClick }: { title: string, onMenuClick: () => void }) => (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Coming Soon!</CardTitle>
                </CardHeader>
            </Card>
        </main>
    </div>
);


export default function Home() {
  const [activeView, setActiveView] = React.useState<View>("Chat");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);

  const handleLogin = (email: string, password_unused: string) => {
    // In a real app, you'd verify the password. Here, we'll just find the user by email.
    const agent = mockAgents.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (agent) {
      setCurrentUser({
        name: agent.name,
        avatar: agent.avatar,
        role: agent.role,
      });

      // Role-based landing page logic
      if (agent.role === 'admin') {
        setActiveView('Dashboard');
      } else {
        setActiveView('Chat');
      }

      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('Chat'); // Default to chat view on logout
  };

  const renderView = () => {
    const props = { onMenuClick: () => setIsNavOpen(true), user: currentUser };
    switch (activeView) {
      case "Chat":
        return <ChatLayout user={currentUser} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
      case "Contacts":
        return <ContactsView {...props} />;
      case "Agents":
        return <AgentsView {...props} />;
      case "Dashboard":
        // Protect dashboard view
        if (currentUser?.role === 'admin') {
          return <DashboardView {...props} />;
        }
        // Redirect or show access denied for non-admins
        return <ChatLayout user={currentUser} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
      case "Announcements":
        return <AnnouncementsView {...props} />;
      case "My Performance":
        return <PlaceholderView title="My Performance" {...props} />;
      case "Campaigns":
         return <PlaceholderView title="Campaigns" {...props} />;
       case "Analytics":
         return <PlaceholderView title="Analytics" {...props} />;
      default:
        return <ChatLayout user={currentUser} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
    }
  };

  if (!currentUser) {
    return (
        <main className="flex h-screen w-full items-center justify-center bg-background p-4">
            <LoginDialog onLogin={handleLogin} />
        </main>
    )
  }

  return (
    <main className="flex h-screen bg-background">
      <VerticalNav 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userRole={currentUser?.role} 
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
      />
      <div className="flex-1 md:pl-[70px] min-w-0">
        {renderView()}
      </div>
    </main>
  );
}
