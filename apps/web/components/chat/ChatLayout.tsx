"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

export default function ChatLayout() {
  const [
    activeConversation,
    setActiveConversation,
  ] = useState<string | null>(null);

  const [
    refreshSidebar,
    setRefreshSidebar,
  ] = useState(0);
  console.log("ACTIVE:", activeConversation);

  return (
    <section className="flex h-screen overflow-hidden border-t border-zinc-800 bg-black">

      <Sidebar
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        refreshSidebar={refreshSidebar}
      />

      <main className="flex flex-1 min-h-0 overflow-hidden">

        <Chat
          conversationId={activeConversation}
          onConversationUpdated={() =>
            setRefreshSidebar((prev) => prev + 1)
          }
        />

      </main>

    </section>
  );
}