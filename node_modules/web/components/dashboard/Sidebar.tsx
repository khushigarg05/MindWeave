"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  Workflow,
  Settings,
  Plus,
} from "lucide-react";

type Conversation = {
  _id: string;
  title: string;
};

type SidebarProps = {
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
  refreshSidebar: number;
};

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Chat", icon: MessageSquare },
  { name: "Knowledge", icon: Database },
  { name: "Automation", icon: Workflow },
  { name: "Settings", icon: Settings },
];

export default function Sidebar({
  activeConversation,
  setActiveConversation,
  refreshSidebar,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function loadConversations() {
    try {
      const res = await fetch(
        "http://localhost:5000/conversation"
      );

      const data = await res.json();

      const list: Conversation[] = data.data ?? [];

      setConversations(list);

      if (!activeConversation && list.length > 0) {
        setActiveConversation(list[0]._id);
      }
    } catch (err) {
      console.error(err);
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

      const data = await res.json();

      const newConversation = data.data;

      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      setActiveConversation(newConversation._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, conversations]);

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}
      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">
          🧠 MindWeave
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          AI Knowledge OS
        </p>
      </div>

      {/* Navigation */}
      <div className="border-b border-zinc-800 p-4">

        <div className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  item.name === "Chat"
                    ? "bg-cyan-500 text-black"
                    : "hover:bg-zinc-900"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}

        </div>

      </div>

      {/* New Chat */}
      <div className="p-4">

        <button
          onClick={createConversation}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          <Plus size={18} />

          {loading ? "Creating..." : "New Chat"}
        </button>

      </div>

      {/* Search */}
      <div className="px-4 pb-4">

        <input
          placeholder="Search chats..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl bg-zinc-900 p-3 text-sm outline-none"
        />

      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">

        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Recent Chats
        </h3>

        {filteredConversations.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No conversations found.
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation._id}
              onClick={() =>
                setActiveConversation(conversation._id)
              }
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
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