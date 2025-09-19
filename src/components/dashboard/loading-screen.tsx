
"use client";

import { KenaAILogo } from "@/components/ui/kena-ai-logo";

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="animate-pulse">
        <KenaAILogo className="h-100" />
      </div>
    </div>
  );
}
