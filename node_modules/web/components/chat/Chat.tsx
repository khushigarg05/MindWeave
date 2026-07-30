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

  // ===========================
  // Load conversation messages
  // ===========================
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

        if (!data.success) {
          throw new Error(data.message);
        }

        const chatMessages: Message[] =
          data.data?.messages?.map((msg: any) => ({
            role: msg.role === "assistant" ? "ai" : "user",
            text: msg.content,
          })) ?? [];

        setMessages(chatMessages);
      } catch (error) {
        console.error("Conversation loading error:", error);
        setMessages([]);
      }
    }

    loadConversation();
  }, [conversationId]);

  // ===========================
  // Auto Scroll
  // ===========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ===========================
  // Send Message (Streaming)
  // ===========================
  async function sendMessage() {
    if (!conversationId || loading || !input.trim()) return;

    const userText = input.trim();

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
      },
      {
        role: "ai",
        text: "",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/chat/stream",
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

      if (!res.ok || !res.body) {
        throw new Error("Failed to start stream");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let aiText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          const line = event
            .split("\n")
            .find((l) => l.startsWith("data:"));

          if (!line) continue;

          const payload = line.replace("data:", "").trim();

          if (payload === "done") continue;

          try {
            const parsed = JSON.parse(payload);

            aiText += parsed.token;

            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                role: "ai",
                text: aiText,
              };

              return updated;
            });
          } catch (err) {
            console.error(err);
          }
        }
      }

      // Refresh sidebar (title may have changed)
      onConversationUpdated();
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "ai",
          text: "Something went wrong. Please try again.",
        };

        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // ===========================
  // UI
  // ===========================
  return (
    <section className="flex h-full flex-col p-6">
      <h2 className="mb-6 text-4xl font-bold">
        Chat with MindWeave
      </h2>

      <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900">
        {/* Messages */}
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
                className={`max-w-[75%] rounded-xl px-4 py-3 whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-cyan-500 text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.text}

                {loading &&
                  index === messages.length - 1 &&
                  msg.role === "ai" && (
                    <span className="animate-pulse">▋</span>
                  )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
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
            disabled={!conversationId || loading}
            placeholder={
              conversationId
                ? "Ask anything..."
                : "Create a chat first"
            }
            className="flex-1 rounded-xl bg-zinc-950 p-3 text-white outline-none disabled:opacity-50"
          />

          <button
            onClick={sendMessage}
            disabled={!conversationId || loading}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}