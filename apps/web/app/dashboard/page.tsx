"use client";

import {
  FileText,
  MessageSquare,
  Search,
  Database,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-full p-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Welcome to MindWeave — your AI Knowledge OS.
        </p>

      </div>

      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Knowledge Base */}

        <Link
          href="/knowledge"
          className="
            group
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-6
            transition
            hover:border-cyan-500/50
            hover:bg-zinc-900/80
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <FileText size={22} />
            </div>

            <ArrowRight
              size={18}
              className="
                text-zinc-600
                transition
                group-hover:translate-x-1
                group-hover:text-cyan-400
              "
            />

          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Knowledge Base
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Documents
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your uploaded PDFs.
          </p>

        </Link>

        {/* Chat */}

        <Link
          href="/chat"
          className="
            group
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-6
            transition
            hover:border-cyan-500/50
            hover:bg-zinc-900/80
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <MessageSquare size={22} />
            </div>

            <ArrowRight
              size={18}
              className="
                text-zinc-600
                transition
                group-hover:translate-x-1
                group-hover:text-cyan-400
              "
            />

          </div>

          <p className="mt-5 text-sm text-zinc-500">
            AI Assistant
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Chat
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Ask questions about your knowledge.
          </p>

        </Link>

        {/* Search */}

        <Link
          href="/search"
          className="
            group
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-6
            transition
            hover:border-cyan-500/50
            hover:bg-zinc-900/80
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Search size={22} />
            </div>

            <ArrowRight
              size={18}
              className="
                text-zinc-600
                transition
                group-hover:translate-x-1
                group-hover:text-cyan-400
              "
            />

          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Retrieval
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Search
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Search relevant knowledge chunks.
          </p>

        </Link>

        {/* RAG */}

        <div
          className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-6
          "
        >

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Database size={22} />
            </div>

            <span
              className="
                rounded-full
                bg-green-500/10
                px-3
                py-1
                text-xs
                font-medium
                text-green-400
              "
            >
              Active
            </span>

          </div>

          <p className="mt-5 text-sm text-zinc-500">
            AI Infrastructure
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            RAG System
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Retrieval augmented generation is running.
          </p>

        </div>

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="mb-10">

        <h2 className="mb-4 text-xl font-semibold">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <Link
            href="/knowledge"
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              p-4
              transition
              hover:border-cyan-500/50
            "
          >

            <div className="flex items-center gap-3">

              <FileText
                size={18}
                className="text-cyan-400"
              />

              <span className="text-sm text-zinc-300">
                Upload a document
              </span>

            </div>

            <ArrowRight
              size={16}
              className="text-zinc-600"
            />

          </Link>

          <Link
            href="/chat"
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              p-4
              transition
              hover:border-cyan-500/50
            "
          >

            <div className="flex items-center gap-3">

              <MessageSquare
                size={18}
                className="text-cyan-400"
              />

              <span className="text-sm text-zinc-300">
                Start a new conversation
              </span>

            </div>

            <ArrowRight
              size={16}
              className="text-zinc-600"
            />

          </Link>

          <Link
            href="/search"
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              p-4
              transition
              hover:border-cyan-500/50
            "
          >

            <div className="flex items-center gap-3">

              <Search
                size={18}
                className="text-cyan-400"
              />

              <span className="text-sm text-zinc-300">
                Search knowledge
              </span>

            </div>

            <ArrowRight
              size={16}
              className="text-zinc-600"
            />

          </Link>

        </div>

      </div>

      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        "
      >

        <div className="mb-5">

          <h2 className="text-xl font-semibold">
            System Status
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Current MindWeave services.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-4">

            <span className="text-sm text-zinc-400">
              Backend API
            </span>

            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Running
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-4">

            <span className="text-sm text-zinc-400">
              Vector Search
            </span>

            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Active
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-4">

            <span className="text-sm text-zinc-400">
              RAG Pipeline
            </span>

            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Active
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}