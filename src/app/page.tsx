
"use client";

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { AgentsView } from "@/components/dashboard/agents-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { Agent, UserProfile } from "@/types";
import { AnnouncementsView } from "@/components/dashboard/announcements-view";

export type View = "Chat" | "Contacts" | "Agents" | "Dashboard" | "Announcements" | "History" | "Language" | "Payments" | "Settings" | "System Settings";

const mockAdminUser: UserProfile = {
  name: "Samuel Byalugaba",
  role: "admin",
  avatar: "https://picsum.photos/id/1/100/100",
};

export default function Home() {
  const [activeView, setActiveView] = React.useState<View>("Chat");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);

  const handleLogin = () => {
    setCurrentUser(mockAdminUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderView = () => {
    const props = { onMenuClick: () => setIsNavOpen(true) };
    switch (activeView) {
      case "Chat":
        return <ChatLayout user={currentUser} onLogin={handleLogin} onLogout={handleLogout} {...props} />;
      case "Contacts":
        return <ContactsView {...props} />;
      case "Agents":
        return <AgentsView {...props} />;
      case "Dashboard":
        return <DashboardView {...props} />;
      case "Announcements":
        return <AnnouncementsView {...props} />;
      default:
        return <ChatLayout user={currentUser} onLogin={handleLogin} onLogout={handleLogout} {...props} />;
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
    </main>
  );
}
