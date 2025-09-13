
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const navItems = [
  { icon: MessageSquare, label: "Chat" as View },
  { icon: BookUser, label: "Contacts" as View },
  { icon: Users, label: "Agents" as View },
  { icon: LayoutDashboard, label: "Dashboard" as View, adminOnly: true },
  { icon: Megaphone, label: "Announcements" as View },
  { icon: History, label: "History" as View },
];

const bottomNavItems = [
    { icon: Wallet, label: "Payments" as View },
    { icon: Settings, label: "Settings" as View },
    { icon: Cog, label: "System Settings" as View },
]

type VerticalNavProps = {
    activeView: View;
    setActiveView: (view: View) => void;
    userRole?: AgentRole;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export function VerticalNav({ activeView, setActiveView, userRole, isOpen, setIsOpen }: VerticalNavProps) {

  const visibleNavItems = navItems.filter(item => !item.adminOnly || userRole === 'admin');

  const NavContent = () => (
    <div className="flex h-full flex-col items-center justify-between bg-primary py-4">
        <nav className="flex flex-col items-center gap-4 px-2">
            {visibleNavItems.map((item) => (
            <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                <button
                    onClick={() => {
                        setActiveView(item.label)
                        setIsOpen(false)
                    }}
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
                    onClick={() => {
                        setActiveView(item.label)
                        setIsOpen(false)
                    }}
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
    </div>
  );

  return (
    <TooltipProvider>
        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="p-0 w-[70px] border-none">
              <SheetHeader>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
              </SheetHeader>
              <NavContent />
            </SheetContent>
        </Sheet>
        {/* Desktop Nav */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden h-full w-[70px] md:flex">
            <NavContent />
        </aside>
    </TooltipProvider>
  );
}
