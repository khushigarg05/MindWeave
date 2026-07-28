"use client";

import { useEffect, useState } from "react";
import { Plus, MessageSquare } from "lucide-react";

type Conversation = {
  _id: string;
  title: string;
};

type SidebarProps = {
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
  refreshSidebar: number;
};

export default function Sidebar({
  activeConversation,
  setActiveConversation,
  refreshSidebar,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadConversations() {
    try {
      const res = await fetch(
        "http://localhost:5000/conversation"
      );

      if (!res.ok) {
        throw new Error("Failed to load conversations");
      }

      const data = await res.json();

      const list: Conversation[] = data.data ?? [];

      setConversations(list);

      // Select first conversation only once
      if (!activeConversation && list.length > 0) {
        setActiveConversation(list[0]._id);
      }
    } catch (err) {
      console.error("Load Error:", err);
    }
  }

  useEffect(() => {
    loadConversations();
  }, [refreshSidebar]);

  async function createConversation() {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/conversation",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await res.json();

      const newConversation: Conversation = data.data;

      // Show immediately
      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      // Open it immediately
      setActiveConversation(newConversation._id);
    } catch (err) {
      console.error("Create Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      <div className="p-5">
        <button
          onClick={createConversation}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          {loading ? "Creating..." : "New Chat"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">

        <h3 className="mb-3 text-sm uppercase text-zinc-500">
          Recent Chats
        </h3>

        {conversations.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No conversations yet.
          </p>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation._id}
              onClick={() =>
                setActiveConversation(conversation._id)
              }
              className={`mb-2 flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                activeConversation === conversation._id
                  ? "bg-cyan-500 text-black"
                  : "hover:bg-zinc-900"
              }`}
            >
              <MessageSquare size={18} />

              <span className="truncate">
                {conversation.title}
              </span>
            </button>
          ))
        )}

      </div>

    </aside>
  );
}