"use client";

import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Search,
  ArrowRight,
  Brain,
} from "lucide-react";

const features = [
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
  return (
    <main className="min-h-full p-10">
      {/* Header */}

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

      {/* Overview */}

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            AI Assistant
          </p>

          <p className="mt-2 text-2xl font-bold text-cyan-400">
            Active
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Knowledge System
          </p>

          <p className="mt-2 text-2xl font-bold text-green-400">
            RAG Active
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Vector Search
          </p>

          <p className="mt-2 text-2xl font-bold text-cyan-400">
            Ready
          </p>
        </div>
      </div>

      {/* Features */}

      <div>
        <h2 className="mb-5 text-2xl font-semibold">
          MindWeave
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