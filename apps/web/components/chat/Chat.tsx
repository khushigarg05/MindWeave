"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

type Source = {
  filename: string;
  score: number;
};

type RetrievedChunk = {
  filename: string;
  score: number;
  text: string;
};

type Message = {
  role: "user" | "ai";
  text: string;
  sources?: Source[];
  retrievedChunks?: RetrievedChunk[];
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ===========================
  // Load Conversation
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
        console.error(error);
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
  // Auto Grow Textarea
  // ===========================

  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.style.height = "0px";
    inputRef.current.style.height =
      inputRef.current.scrollHeight + "px";
  }, [input]);

  // ===========================
  // Send Message
  // ===========================

  async function sendMessage() {
    if (!conversationId || loading || !input.trim()) return;

    const userText = input.trim();

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
            conversationId,
            message: userText,
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
          const lines = event.split("\n");

          const eventName =
            lines.find((l) => l.startsWith("event:"))
              ?.replace("event:", "")
              .trim() ?? "message";

          const dataLine = lines.find((l) =>
            l.startsWith("data:")
          );

          if (!dataLine) continue;

          const payload = dataLine
            .replace("data:", "")
            .trim();

          // ===========================
          // END
          // ===========================

          if (eventName === "end") {
            continue;
          }

          // ===========================
          // SOURCES
          // ===========================

          if (eventName === "sources") {
            try {
              const sources: Source[] =
                JSON.parse(payload);

              setMessages((prev) => {
                const updated = [...prev];

                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  sources,
                };

                return updated;
              });
            } catch (err) {
              console.error(err);
            }

            continue;
          }

          // ===========================
          // RETRIEVED CHUNKS
          // (Future ready)
          // ===========================

          if (eventName === "chunks") {
            try {
              const chunks: RetrievedChunk[] =
                JSON.parse(payload);

              setMessages((prev) => {
                const updated = [...prev];

                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  retrievedChunks: chunks,
                };

                return updated;
              });
            } catch (err) {
              console.error(err);
            }

            continue;
          }

          // ===========================
          // NORMAL TOKEN
          // ===========================

          try {
            const parsed = JSON.parse(payload);

            aiText += parsed.token;

            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: aiText,
              };

              return updated;
            });
          } catch (err) {
            console.error(err);
          }
        }
      }

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

  return (
    <section className="flex flex-1 h-full min-h-0 flex-col overflow-hidden p-6">
      <h2 className="mb-6 shrink-0 text-4xl font-bold">
        Chat with MindWeave
      </h2>

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div
          className="flex-1 overflow-y-auto space-y-4 p-6"
          style={{ minHeight: 0 }}
        >
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-zinc-500">
              {conversationId
                ? "Start a conversation..."
                : "Create a new chat first"}
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              text={msg.text}
              sources={msg.sources}
              retrievedChunks={msg.retrievedChunks}
            />
          ))}

          {loading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-zinc-800 bg-zinc-900 p-4">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!conversationId || loading}
              placeholder={
                conversationId
                  ? "Ask anything..."
                  : "Create a chat first"
              }
              className="flex-1 max-h-48 resize-none overflow-y-auto rounded-xl bg-zinc-950 p-3 text-white outline-none disabled:opacity-50"
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
      </div>
    </section>
  );
}