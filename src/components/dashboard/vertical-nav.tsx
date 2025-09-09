
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: MessageSquare, label: "Chat", active: true },
  { icon: BookUser, label: "Contacts" },
  { icon: Settings, label: "Settings" },
  { icon: Users, label: "Agents" },
  { icon: Megaphone, label: "Announcements" },
  { icon: History, label: "History" },
  { icon: Cog, label: "System Settings" },
  { icon: Globe, label: "Language" },
  { icon: Wallet, label: "Payments" },
];

export function VerticalNav() {
  const [activeItem, setActiveItem] = React.useState("Chat");

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-[70px] flex-col items-center justify-center bg-primary">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveItem(item.label)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary-foreground/10 hover:text-white",
                    activeItem === item.label
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
