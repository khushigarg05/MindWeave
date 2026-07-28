"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("http://localhost:5000/chat/history");

        const data = await res.json();

        const chats = data.data.flatMap((chat: any) => [
          {
            role: "user",
            text: chat.userMessage,
          },
          {
            role: "ai",
            text: chat.aiResponse,
          },
        ]);

        setMessages(chats);
      } catch (err) {
        console.error(err);
      }
    }

    loadHistory();
  }, []);

  // Auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.data.aiResponse,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Server error.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section className="flex h-full flex-col p-6">
      <h2 className="mb-6 text-4xl font-bold">
        Chat with MindWeave
      </h2>

      <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900">

        <div className="flex-1 overflow-y-auto space-y-4 p-6 min-h-0">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-cyan-500 text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={bottomRef} />

        </div>

        <div className="flex gap-3 border-t border-zinc-800 p-4">

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl bg-zinc-950 p-3 text-white outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>
    </section>
  );
}