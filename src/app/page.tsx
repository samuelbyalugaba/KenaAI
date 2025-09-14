
"use client";

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { AgentsView } from "@/components/dashboard/agents-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { UserProfile } from "@/types";
import { AnnouncementsView } from "@/components/dashboard/announcements-view";
import { LoginDialog } from "@/components/dashboard/login-dialog";
import { mockAgents } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { SettingsDialog } from "@/components/dashboard/settings-dialog";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { CampaignsView } from "@/components/dashboard/campaigns-view";
import { MyPerformanceView } from "@/components/dashboard/my-performance-view";
import { KenaAILogo } from "@/components/ui/kena-ai-logo";

export type View = "Chat" | "Contacts" | "Agents" | "Dashboard" | "Announcements" | "History" | "Payments" | "Settings" | "System Settings" | "Campaigns" | "My Performance";

export default function Home() {
  const [activeView, setActiveView] = React.useState<View>("Chat");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleLogin = (email: string, password_unused: string) => {
    // In a real app, you'd verify the password. Here, we'll just find the user by email.
    const agent = mockAgents.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (agent) {
      setCurrentUser({
        name: agent.name,
        avatar: agent.avatar,
        role: agent.role,
        email: agent.email,
        phone: agent.phone
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
        return <ChatLayout user={currentUser} onMenuClick={() => setIsNavOpen(true)} />;
      case "Contacts":
        return <ContactsView {...props} />;
      case "Agents":
        return <AgentsView {...props} />;
      case "Dashboard":
        return <DashboardView {...props} />;
      case "Announcements":
        return <AnnouncementsView {...props} />;
      case "My Performance":
        return <MyPerformanceView {...props} />;
      case "Campaigns":
         return <CampaignsView {...props} />;
      default:
        return <ChatLayout user={currentUser} onMenuClick={() => setIsNavOpen(true)} />;
    }
  };

  if (!currentUser) {
    return (
        <ThemeProvider>
             <main className="flex h-screen w-full items-center justify-center bg-background p-4">
                <div className="w-full h-full grid lg:grid-cols-2">
                    <div className="hidden lg:flex flex-col items-center justify-center bg-secondary text-secondary-foreground p-8">
                        <KenaAILogo className="h-24" />
                        <h1 className="mt-4 text-3xl font-bold">Smarter Conversations, Simplified</h1>
                        <p className="mt-2 text-center text-secondary-foreground/80">
                            Welcome to the future of customer engagement. Manage all your channels from one powerful dashboard.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <LoginDialog onLogin={handleLogin} />
                    </div>
                </div>
            </main>
        </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
        <main className="flex h-screen bg-background">
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} user={currentUser} />
        <VerticalNav 
            activeView={activeView} 
            setActiveView={setActiveView} 
            user={currentUser}
            onLogout={handleLogout}
            isOpen={isNavOpen}
            setIsOpen={setIsNavOpen}
            onSettingsClick={() => setIsSettingsOpen(true)}
        />
        <div className="flex-1 md:pl-[70px] min-w-0">
            {renderView()}
        </div>
        </main>
    </ThemeProvider>
  );
}
