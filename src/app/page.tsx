
"use client";

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";
import { ContactsView } from "@/components/dashboard/contacts-view";
import { AgentsView } from "@/components/dashboard/agents-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import type { Agent, UserProfile } from "@/types";

export type View = "Chat" | "Contacts" | "Agents" | "Dashboard";

const adminUser: UserProfile = {
  name: "Samuel Byalugaba",
  role: "admin",
  avatar: "https://picsum.photos/id/1/100/100",
};

export default function Home() {
  const [activeView, setActiveView] = React.useState<View>("Chat");

  const renderView = () => {
    switch (activeView) {
      case "Chat":
        return <ChatLayout user={adminUser} />;
      case "Contacts":
        return <ContactsView />;
      case "Agents":
        return <AgentsView />;
      case "Dashboard":
        return <DashboardView />;
      default:
        return <ChatLayout user={adminUser} />;
    }
  };

  return (
    <main className="flex">
      <VerticalNav activeView={activeView} setActiveView={setActiveView} userRole={adminUser.role} />
      <div className="flex-1 md:pl-[70px]">
        {renderView()}
      </div>
    </main>
  );
}
