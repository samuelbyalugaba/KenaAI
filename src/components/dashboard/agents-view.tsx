
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PanelLeft } from "lucide-react";
import type { UserProfile } from "@/types";

type AgentsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function AgentsView({ onMenuClick, user }: AgentsViewProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                <h1 className="text-2xl font-bold">Agents & Team Management</h1>
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Page Cleared</CardTitle>
                </CardHeader>
            </Card>
        </main>
    </div>
  );
}
