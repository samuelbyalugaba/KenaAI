
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

export type View = "Chat" | "Contacts" | "Agents" | "Dashboard" | "Announcements" | "History" | "Language" | "Payments" | "Settings" | "System Settings";

export default function Home() {
  const [activeView, setActiveView] = React.useState<View>("Chat");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);

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

      setIsLoginDialogOpen(false); // Close dialog on successful login
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
        return <ChatLayout user={currentUser} onLogin={() => setIsLoginDialogOpen(true)} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
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
        return <ChatLayout user={currentUser} onLogin={() => setIsLoginDialogOpen(true)} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
      case "Announcements":
        return <AnnouncementsView {...props} />;
      default:
        return <ChatLayout user={currentUser} onLogin={() => setIsLoginDialogOpen(true)} onLogout={handleLogout} onMenuClick={() => setIsNavOpen(true)} />;
    }
  };

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
       <LoginDialog 
        isOpen={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen}
        onLogin={handleLogin}
      />
    </main>
  );
}
