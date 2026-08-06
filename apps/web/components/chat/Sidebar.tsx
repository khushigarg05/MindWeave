"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
} from "lucide-react";

type Conversation = {
  _id: string;
  title: string;
};

type SidebarProps = {
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  refreshSidebar: number;
};

export default function Sidebar({
  activeConversation,
  setActiveConversation,
  refreshSidebar,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Load Conversations
  // ==========================

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

  // ==========================
  // Create Chat
  // ==========================

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

      const conversation = data.data;

      setConversations((prev) => [
        conversation,
        ...prev,
      ]);

      setActiveConversation(conversation._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // Delete Chat
  // ==========================

  async function deleteConversation(
    id: string,
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    const ok = confirm(
      "Delete this conversation?"
    );

    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:5000/conversation/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      const updated = conversations.filter(
        (c) => c._id !== id
      );

      setConversations(updated);

      if (activeConversation === id) {
        if (updated.length > 0) {
          setActiveConversation(updated[0]._id);
        } else {
          setActiveConversation(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Unable to delete conversation.");
    }
  }

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Header */}

      <div className="border-b border-zinc-800 p-5">
        <button
          onClick={createConversation}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          <Plus size={18} />

          {loading
            ? "Creating..."
            : "New Chat"}
        </button>
      </div>

      {/* Conversation List */}

      <div className="flex-1 overflow-y-auto px-4 py-4">

        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Recent Chats
        </h3>

        {conversations.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No conversations yet.
          </p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`mb-2 flex items-center rounded-xl transition ${
                activeConversation === conversation._id
                  ? "bg-cyan-500 text-black"
                  : "hover:bg-zinc-900 text-white"
              }`}
            >
              <button
                onClick={() =>
                  setActiveConversation(
                    conversation._id
                  )
                }
                className="flex flex-1 items-center gap-3 p-3 text-left"
              >
                <MessageSquare
                  size={18}
                  className="shrink-0"
                />

                <span className="truncate">
                  {conversation.title}
                </span>
              </button>

              <button
                onClick={(e) =>
                  deleteConversation(
                    conversation._id,
                    e
                  )
                }
                className="mr-2 rounded-lg p-2 transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}