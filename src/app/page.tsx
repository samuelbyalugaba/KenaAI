
"use client";

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { AgentsView } from "@/components/dashboard/agents-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { Agent, User, UserProfile } from "@/types";
import { AnnouncementsView } from "@/components/dashboard/announcements-view";
import { SettingsDialog } from "@/components/dashboard/settings-dialog";
import { CampaignsView } from "@/components/dashboard/campaigns-view";
import { MyPerformanceView } from "@/components/dashboard/my-performance-view";
import { AuthForm } from "@/components/dashboard/auth-form";
import { handleLogin } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/dashboard/loading-screen";


export type View = "Chat" | "Contacts" | "Agents" | "Dashboard" | "Announcements" | "History" | "Payments" | "Settings" | "System Settings" | "Campaigns" | "My Performance";

export default function Home({ params, searchParams }: { params: {}; searchParams: {} }) {
  React.use(params);
  React.use(searchParams);
  
  const [activeView, setActiveView] = React.useState<View>("Chat");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [initialContact, setInitialContact] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
        const savedUser = localStorage.getItem('currentUser');
        const savedView = localStorage.getItem('activeView') as View | null;

        if (savedUser) {
            const user: UserProfile = JSON.parse(savedUser);
            setCurrentUser(user);

            if (savedView) {
                setActiveView(savedView);
            } else if (user.role === 'admin') {
              setActiveView('Dashboard');
            } else {
              setActiveView('Chat');
            }
        }
    } catch (error) {
        console.error("Failed to parse from localStorage", error);
        localStorage.clear(); // Clear storage on parsing error
    }
    
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Persist activeView to localStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('activeView', activeView);
    }
  }, [activeView, currentUser]);

  const onLogin = async (email: string, password_unused: string) => {
    const result = await handleLogin(email, password_unused);
    if (result.success && result.agent) {
      const agent = result.agent as Agent;
       const userProfile: UserProfile = {
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        role: agent.role,
        email: agent.email,
        phone: agent.phone,
        companyId: agent.companyId,
      };
      setCurrentUser(userProfile);
      localStorage.setItem('currentUser', JSON.stringify(userProfile));

      const viewToSet = agent.role === 'admin' ? 'Dashboard' : 'Chat';
      setActiveView(viewToSet);
      localStorage.setItem('activeView', viewToSet);
    }
    return { success: result.success, message: result.message };
  }
  

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activeView');
    setActiveView('Chat');
  };
  
  const handleUpdateUser = (updatedUser: Partial<UserProfile>) => {
    setCurrentUser(prev => {
        if (prev) {
            const newUser = { ...prev, ...updatedUser };
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return newUser;
        }
        return null;
    });
  }

  const handleNavigateToChat = (contact: User) => {
    setInitialContact(contact);
    setActiveView("Chat");
    setTimeout(() => setInitialContact(null), 100);
  }

  const renderView = () => {
    const props = { onMenuClick: () => setIsNavOpen(true), user: currentUser };
    switch (activeView) {
      case "Chat":
        return <ChatLayout {...props} initialContact={initialContact} />;
      case "Contacts":
        return <ContactsView {...props} onNavigateToChat={handleNavigateToChat} />;
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
        return <ChatLayout user={currentUser} onMenuClick={() => setIsNavOpen(true)} initialContact={initialContact} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-background p-4 overflow-hidden auth-page-background">
        <AuthForm onLogin={onLogin} />
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-background">
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
        user={currentUser}
        onUserUpdate={handleUpdateUser}
      />
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
  );
}
