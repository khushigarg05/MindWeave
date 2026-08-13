"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  FileText,
  Search,
  ArrowRight,
  Brain,
  Database,
  Activity,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mindweave-backend.onrender.com";

type Feature = {
  title: string;
  description: string;
  href: string;
  icon: typeof MessageSquare;
};

const features: Feature[] = [
  {
    title: "Chat",
    description:
      "Ask questions and get AI-powered answers from your knowledge base.",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Knowledge Base",
    description:
      "Upload and manage the documents used by the RAG system.",
    href: "/knowledge",
    icon: FileText,
  },
  {
    title: "Search",
    description:
      "Search relevant chunks from your indexed knowledge base.",
    href: "/search",
    icon: Search,
  },
];

export default function DashboardPage() {
  const [documents, setDocuments] = useState(0);
  const [conversations, setConversations] = useState(0);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Load Dashboard Data
  // ==========================================

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [documentsRes, conversationsRes] =
          await Promise.all([
            fetch(
              `${API_URL}/upload/documents`,
              {
                cache: "no-store",
              }
            ),
            fetch(
              `${API_URL}/conversation`,
              {
                cache: "no-store",
              }
            ),
          ]);

        // Documents

        if (documentsRes.ok) {
          const documentsData =
            await documentsRes.json();

          if (documentsData.success) {
            setDocuments(
              documentsData.data?.length || 0
            );
          }
        }

        // Conversations

        if (conversationsRes.ok) {
          const conversationsData =
            await conversationsRes.json();

          if (conversationsData.success) {
            setConversations(
              conversationsData.data?.length || 0
            );
          }
        }
      } catch (error) {
        console.error(
          "Dashboard Load Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="min-h-full p-10">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-10">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Brain size={26} />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="mt-1 text-zinc-400">
              Welcome to MindWeave AI Knowledge OS.
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          Overview
      ========================================== */}

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-4">

        {/* Documents */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              Documents
            </p>

            <FileText
              size={20}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            {loading ? "..." : documents}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Knowledge base documents
          </p>

        </div>

        {/* Conversations */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              Conversations
            </p>

            <MessageSquare
              size={20}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            {loading ? "..." : conversations}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            AI conversations
          </p>

        </div>

        {/* RAG */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              Knowledge System
            </p>

            <Database
              size={20}
              className="text-green-400"
            />

          </div>

          <p className="mt-3 text-2xl font-bold text-green-400">
            {documents > 0
              ? "RAG Active"
              : "Empty"}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Retrieval augmented generation
          </p>

        </div>

        {/* System */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              System
            </p>

            <Activity
              size={20}
              className="text-green-400"
            />

          </div>

          <p className="mt-3 text-2xl font-bold text-green-400">
            Online
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            MindWeave services
          </p>

        </div>

      </div>

      {/* ==========================================
          Quick Access
      ========================================== */}

      <div>

        <h2 className="mb-5 text-2xl font-semibold">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-cyan-500/50 hover:bg-zinc-800/60"
              >

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Icon size={22} />
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan-400">

                  Open

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </Link>
            );

          })}

        </div>

      </div>

    </main>
  );
}