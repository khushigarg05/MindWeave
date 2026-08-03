"use client";

import { useState } from "react";
import * as api from "@/services/api";

export function useChat() {
  const [conversationId, setConversationId] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function startConversation() {
    const res =
      await api.createConversation();

    setConversationId(
      res.data._id ?? res.data.conversationId
    );
  }

  async function send(message: string) {
    if (!conversationId) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    const res =
      await api.chat(
        conversationId,
        message
      );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.data.aiResponse,

        sources: res.data.sources,
      },
    ]);

    setLoading(false);
  }

  return {
    messages,
    loading,
    send,
    startConversation,
  };
}