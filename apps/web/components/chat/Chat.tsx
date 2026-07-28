"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

type ChatProps = {
  conversationId: string | null;
  onConversationUpdated: () => void;
};

export default function Chat({
  conversationId,
  onConversationUpdated,
}: ChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load selected conversation
  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/conversation/${conversationId}`
        );

        const data = await res.json();

        const formatted =
          data.data?.messages?.map((msg: any) => ({
            role: msg.role === "assistant" ? "ai" : "user",
            text: msg.content,
          })) ?? [];

        setMessages(formatted);
      } catch (error) {
        console.error("Load conversation error:", error);
      }
    }

    loadConversation();
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading || !conversationId) return;

    const userText = input;

    // Show user message immediately
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
      const res = await fetch(
        "http://localhost:5000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,
            conversationId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.data.aiResponse,
        },
      ]);

      // Refresh sidebar so updated title appears
      onConversationUpdated();
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong.",
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
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-zinc-500">
              {conversationId
                ? "Start a conversation..."
                : "Create a new chat first"}
            </div>
          )}

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
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder={
              conversationId
                ? "Ask anything..."
                : "Create a chat first"
            }
            disabled={!conversationId}
            className="flex-1 rounded-xl bg-zinc-950 p-3 text-white outline-none disabled:opacity-50"
          />

          <button
            onClick={sendMessage}
            disabled={
              loading || !conversationId
            }
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Thinking..."
              : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}