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

  // =====================================================
  // LOAD CONVERSATION
  // =====================================================

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

        if (!res.ok) {
          throw new Error("Failed to load conversation");
        }

        const data = await res.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load conversation"
          );
        }

        const chatMessages: Message[] =
          data.data?.messages?.map((msg: any) => ({
            role:
              msg.role === "assistant"
                ? "ai"
                : "user",

            text: msg.content,

            sources:
              msg.sources ?? [],

            retrievedChunks:
              msg.retrievedChunks ?? [],
          })) ?? [];

        setMessages(chatMessages);
      } catch (error) {
        console.error(
          "Load Conversation Error:",
          error
        );

        setMessages([]);
      }
    }

    loadConversation();
  }, [conversationId]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // AUTO GROW TEXTAREA
  // =====================================================

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.style.height = "0px";

    inputRef.current.style.height =
      inputRef.current.scrollHeight + "px";
  }, [input]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  async function sendMessage() {
    if (
      !conversationId ||
      loading ||
      !input.trim()
    ) {
      return;
    }

    const userText = input.trim();

    // ===================================================
    // Add user message immediately
    // ===================================================

    setMessages((prev) => [
      ...prev,

      {
        role: "user",
        text: userText,
      },

      {
        role: "ai",
        text: "",
        sources: [],
        retrievedChunks: [],
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      // =================================================
      // STREAM REQUEST
      // =================================================

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

      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status}`
        );
      }

      if (!res.body) {
        throw new Error(
          "Streaming response not available."
        );
      }

      // =================================================
      // READ STREAM
      // =================================================

      const reader =
        res.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";
      let aiText = "";

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        // =================================================
        // SSE EVENTS
        // =================================================

        const events =
          buffer.split("\n\n");

        buffer =
          events.pop() || "";

        for (const event of events) {
          if (!event.trim()) {
            continue;
          }

          const lines =
            event.split("\n");

          // =============================================
          // EVENT NAME
          // =============================================

          let eventName = "message";

          const eventLine =
            lines.find((line) =>
              line.startsWith("event:")
            );

          if (eventLine) {
            eventName =
              eventLine
                .replace("event:", "")
                .trim();
          }

          // =============================================
          // DATA
          // =============================================

          const dataLine =
            lines.find((line) =>
              line.startsWith("data:")
            );

          if (!dataLine) {
            continue;
          }

          const payload =
            dataLine
              .replace("data:", "")
              .trim();

          // =============================================
          // END EVENT
          // =============================================

          if (eventName === "end") {
            continue;
          }

          // =============================================
          // SOURCES
          // =============================================

          if (eventName === "sources") {
            try {
              const sources: Source[] =
                JSON.parse(payload);

              setMessages((prev) => {
                const updated =
                  [...prev];

                const lastIndex =
                  updated.length - 1;

                if (lastIndex < 0) {
                  return prev;
                }

                updated[lastIndex] = {
                  ...updated[lastIndex],
                  sources,
                };

                return updated;
              });
            } catch (error) {
              console.error(
                "Sources Parse Error:",
                error
              );
            }

            continue;
          }

          // =============================================
          // RETRIEVED CHUNKS
          // =============================================

          if (eventName === "chunks") {
            try {
              const chunks: RetrievedChunk[] =
                JSON.parse(payload);

              setMessages((prev) => {
                const updated =
                  [...prev];

                const lastIndex =
                  updated.length - 1;

                if (lastIndex < 0) {
                  return prev;
                }

                updated[lastIndex] = {
                  ...updated[lastIndex],
                  retrievedChunks:
                    chunks,
                };

                return updated;
              });
            } catch (error) {
              console.error(
                "Chunks Parse Error:",
                error
              );
            }

            continue;
          }

          // =============================================
          // AI TOKEN
          // =============================================

          try {
            const parsed =
              JSON.parse(payload);

            if (
              parsed.token !== undefined
            ) {
              aiText += parsed.token;

              setMessages((prev) => {
                const updated =
                  [...prev];

                const lastIndex =
                  updated.length - 1;

                if (lastIndex < 0) {
                  return prev;
                }

                updated[lastIndex] = {
                  ...updated[lastIndex],

                  text: aiText,
                };

                return updated;
              });
            }
          } catch (error) {
            console.error(
              "Token Parse Error:",
              error
            );
          }
        }
      }

      // =================================================
      // STREAM FINISHED
      // =================================================

      setMessages((prev) => {
        const updated = [...prev];

        const lastIndex =
          updated.length - 1;

        if (lastIndex >= 0) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: aiText,
          };
        }

        return updated;
      });

      // =================================================
      // REFRESH SIDEBAR
      // =================================================

      onConversationUpdated();
    } catch (error) {
      console.error(
        "Chat Stream Error:",
        error
      );

      // =================================================
      // SHOW ERROR MESSAGE
      // =================================================

      setMessages((prev) => {
        const updated = [...prev];

        const lastIndex =
          updated.length - 1;

        if (lastIndex >= 0) {
          updated[lastIndex] = {
            role: "ai",

            text:
              "Something went wrong while generating the response. Please try again.",

            sources: [],

            retrievedChunks: [],
          };
        }

        return updated;
      });
    } finally {
      setLoading(false);

      inputRef.current?.focus();
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden p-6">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="mb-6 shrink-0 text-4xl font-bold">
        Chat with MindWeave
      </h2>

      {/* =================================================
          CHAT CONTAINER
      ================================================= */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">

        {/* =================================================
            MESSAGES
        ================================================= */}

        <div
          className="flex-1 space-y-4 overflow-y-auto p-6"
          style={{
            minHeight: 0,
          }}
        >

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-zinc-500">
              {conversationId
                ? "Start a conversation..."
                : "Create a chat first"}
            </div>
          )}

          {/* =================================================
              MESSAGE LIST
          ================================================= */}

          {messages.map(
            (msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                text={msg.text}
                sources={msg.sources}
                retrievedChunks={
                  msg.retrievedChunks
                }
              />
            )
          )}

          {/* =================================================
              TYPING INDICATOR
          ================================================= */}

          {loading && (
            <TypingIndicator />
          )}

          <div ref={bottomRef} />

        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="shrink-0 border-t border-zinc-800 bg-zinc-900 p-4">

          <div className="flex gap-3">

            <textarea
              ref={inputRef}
              rows={1}
              value={input}

              onChange={(e) =>
                setInput(e.target.value)
              }

              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  sendMessage();
                }
              }}

              disabled={
                !conversationId ||
                loading
              }

              placeholder={
                conversationId
                  ? "Ask anything..."
                  : "Create a chat first"
              }

              className="max-h-48 flex-1 resize-none overflow-y-auto rounded-xl bg-zinc-950 p-3 text-white outline-none disabled:opacity-50"
            />

            {/* =================================================
                SEND BUTTON
            ================================================= */}

            <button
              onClick={sendMessage}

              disabled={
                !conversationId ||
                loading
              }

              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Send"}
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}