
"use client";

import * as React from "react";
import {
  MessageSquare,
  BookUser,
  Settings,
  Users,
  Megaphone,
  LayoutDashboard,
  Send,
  BarChart,
  Award,
  LogOut,
  User as UserIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { View } from "@/app/page";
import type { UserProfile } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";


const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard" as View },
  { icon: MessageSquare, label: "Chat" as View,},
  { icon: BookUser, label: "Contacts" as View },
  { icon: Users, label: "Agents" as View },
  { icon: Send, label: "Campaigns" as View },
  { icon: Megaphone, label: "Announcements" as View },
  { icon: Settings, label: "System Settings" as View },
];

const superAgentNavItems = [
  { icon: MessageSquare, label: "Chat" as View },
  { icon: BookUser, label: "Contacts" as View },
  { icon: Users, label: "Agents" as View },
  { icon: Send, label: "Campaigns" as View },
  { icon: Megaphone, label: "Announcements" as View },
  { icon: Award, label: "My Performance" as View },
];

const agentNavItems = [
  { icon: MessageSquare, label: "Chat" as View },
  { icon: BookUser, label: "Contacts" as View },
  { icon: Megaphone, label: "Announcements" as View },
  { icon: Award, label: "My Performance" as View },
];


type VerticalNavProps = {
    activeView: View;
    setActiveView: (view: View) => void;
    user: UserProfile | null;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSettingsClick: () => void;
};

export function VerticalNav({ activeView, setActiveView, user, onLogout, isOpen, setIsOpen, onSettingsClick }: VerticalNavProps) {
  
  const getNavItems = () => {
    switch(user?.role) {
        case 'admin':
            return adminNavItems;
        case 'super_agent':
            return superAgentNavItems;
        case 'agent':
        default:
            return agentNavItems;
    }
  }

  const navItems = getNavItems();

  const NavContent = () => (
    <div className="flex h-full flex-col items-center justify-between bg-primary py-4">
        <nav className="flex flex-col items-center gap-4 px-2">
            {navItems.map((item) => (
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
        <div className="flex flex-col items-center gap-4 px-2">
             <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-lg hover:bg-primary-foreground/10">
                        {user ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person glasses"/>
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <UserIcon className="h-6 w-6 text-primary-foreground" />
                        )}
                        <span className="sr-only">User Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">User Menu</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" side="right">
                 {user ? (
                     <>
                       <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={onSettingsClick}>
                         <Settings className="mr-2 h-4 w-4" />
                         <span>Settings</span>
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={onLogout}>
                         <LogOut className="mr-2 h-4 w-4" />
                         <span>Log out</span>
                       </DropdownMenuItem>
                     </>
                 ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
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
