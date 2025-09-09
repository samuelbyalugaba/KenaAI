import { ChatLayout } from "@/components/dashboard/chat-layout";
import { VerticalNav } from "@/components/dashboard/vertical-nav";

export default function Home() {
  return (
    <main className="flex">
      <VerticalNav />
      <div className="flex-1 pl-[70px]">
        <ChatLayout />
      </div>
    </main>
  );
}
