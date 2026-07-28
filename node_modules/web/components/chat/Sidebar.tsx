"use client";

import { Plus, MessageSquare } from "lucide-react";

export default function Sidebar() {
  const chats = [
    "Welcome Chat",
    "MongoDB Setup",
    "MindWeave Roadmap",
  ];

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">

      <div className="p-5">

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400">
          <Plus size={18} />
          New Chat
        </button>

      </div>

      <div className="flex-1 overflow-y-auto px-4">

        <h3 className="mb-3 text-sm uppercase text-zinc-500">
          Recent Chats
        </h3>

        {chats.map((chat) => (
          <button
            key={chat}
            className="mb-2 flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-zinc-900"
          >
            <MessageSquare size={18} />
            <span className="truncate">{chat}</span>
          </button>
        ))}

      </div>

    </aside>
  );
}