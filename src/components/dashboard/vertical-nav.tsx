
"use client";

import * as React from "react";
import {
  MessageSquare,
  BookUser,
  Settings,
  Users,
  Megaphone,
  History,
  Cog,
  Globe,
  Wallet,
  LayoutDashboard
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { View } from "@/app/page";
import type { AgentRole } from "@/types";

const navItems = [
  { icon: MessageSquare, label: "Chat" as View },
  { icon: BookUser, label: "Contacts" as View },
  { icon: Users, label: "Agents" as View },
  { icon: LayoutDashboard, label: "Dashboard" as View, adminOnly: true },
  { icon: Megaphone, label: "Announcements" as View },
  { icon: History, label: "History" as View },
];

const bottomNavItems = [
    { icon: Globe, label: "Language" as View },
    { icon: Wallet, label: "Payments" as View },
    { icon: Settings, label: "Settings" as View },
    { icon: Cog, label: "System Settings" as View },
]

type VerticalNavProps = {
    activeView: View;
    setActiveView: (view: View) => void;
    userRole?: AgentRole;
};

export function VerticalNav({ activeView, setActiveView, userRole }: VerticalNavProps) {

  const visibleNavItems = navItems.filter(item => !item.adminOnly || userRole === 'admin');

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-[70px] flex-col items-center justify-between bg-primary py-4">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2">
          {visibleNavItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveView(item.label)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary-foreground/10 hover:text-white",
                    activeView === item.label
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="flex flex-col items-center gap-4 px-2">
          {bottomNavItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveView(item.label)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary-foreground/10 hover:text-white",
                    activeView === item.label
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
