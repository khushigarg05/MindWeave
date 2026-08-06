"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

type Source = {
  filename: string;
  score: number;
};

type RetrievedChunk = {
  filename: string;
  score: number;
  text: string;
};

type Props = {
  role: "user" | "ai";
  text: string;
  sources?: Source[];
  retrievedChunks?: RetrievedChunk[];
};

export default function MessageBubble({
  role,
  text,
  sources = [],
  retrievedChunks = [],
}: Props) {
  const isUser = role === "user";

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[78%] rounded-2xl px-6 py-5 break-words shadow-sm transition-all ${
          isUser
            ? "bg-cyan-500 text-black"
            : "border border-zinc-700 bg-zinc-900 text-white"
        }`}
      >
        {/* ================= AI Header ================= */}

        {!isUser && (
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-400">
            🤖 MindWeave AI
          </div>
        )}

        {/* ================= Message ================= */}

        {isUser ? (
          <div className="whitespace-pre-wrap leading-7">
            {text}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-700 prose-pre:bg-black prose-code:text-cyan-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}

        {/* ================= Toolbar ================= */}

        {!isUser && (
          <div className="mt-5 flex items-center gap-3 border-t border-zinc-700 pt-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        )}

        {/* ================= Sources ================= */}

        {!isUser && sources.length > 0 && (
          <div className="mt-6 border-t border-zinc-700 pt-5">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-400">
              <FileText size={16} />
              Sources
            </h4>

            <div className="space-y-3">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 transition hover:border-cyan-500"
                >
                  <div className="font-medium">
                    {source.filename}
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-700">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          source.score * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 text-xs text-zinc-400">
                    Similarity Score
                    <span className="ml-2 font-medium text-cyan-300">
                      {(source.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= Retrieved Chunks ================= */}

        {!isUser && retrievedChunks.length > 0 && (
          <details className="mt-6 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
            <summary className="cursor-pointer px-5 py-4 font-medium text-cyan-400 transition hover:bg-zinc-900">
              🔍 Retrieved Context ({retrievedChunks.length})
            </summary>

            <div className="space-y-5 p-5">
              {retrievedChunks.map((chunk, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-700 bg-zinc-900"
                >
                  <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
                    <div className="font-medium text-cyan-300">
                      📄 {chunk.filename}
                    </div>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {(chunk.score * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto p-4">
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                      {chunk.text}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}