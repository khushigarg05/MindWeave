"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
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
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-6 text-4xl font-bold">
        Chat with MindWeave
      </h2>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">

        <div className="h-[400px] overflow-y-auto p-6 space-y-4">

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
            <p className="text-zinc-400">
              MindWeave is thinking...
            </p>
          )}

        </div>

        <div className="flex gap-3 border-t border-zinc-800 p-4">

          <input
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
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
          >
            Send
          </button>

        </div>

      </div>
    </section>
  );
}