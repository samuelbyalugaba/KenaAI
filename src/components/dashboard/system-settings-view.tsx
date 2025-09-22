
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";
import type { UserProfile } from "@/types";

type SystemSettingsViewProps = {
  onMenuClick: () => void;
  user: UserProfile | null;
};

export function SystemSettingsView({ onMenuClick, user }: SystemSettingsViewProps) {

  if (user?.role !== 'admin') {
      return (
          <div className="flex h-screen w-full flex-col bg-background text-foreground">
             <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Permission Required</CardTitle>
                        <CardDescription>
                            You do not have permission to view this page. This area is restricted to administrators.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </main>
          </div>
      )
  }
  
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Botpress Integration</CardTitle>
                <CardDescription>Manage your Botpress connection settings here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground p-8">
                    Botpress management UI coming soon.
                </p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
