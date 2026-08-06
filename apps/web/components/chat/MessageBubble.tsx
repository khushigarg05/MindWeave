"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
  sources,
  retrievedChunks,
}: Props) {
  const isUser = role === "user";

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
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
        className={`max-w-[75%] rounded-2xl px-5 py-4 break-words ${
          isUser
            ? "bg-cyan-500 text-black"
            : "border border-zinc-700 bg-zinc-900 text-white"
        }`}
      >
        {/* ================= AI Header ================= */}

        {!isUser && (
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-400">
            🤖 MindWeave
          </div>
        )}

        {/* ================= Message ================= */}

        {isUser ? (
          <div className="whitespace-pre-wrap">
            {text}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
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
          <div className="mt-4 flex items-center gap-2 border-t border-zinc-700 pt-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
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

        {!isUser &&
          sources &&
          sources.length > 0 && (
            <div className="mt-6 border-t border-zinc-700 pt-4">
              <h4 className="mb-3 text-sm font-semibold text-cyan-400">
                📄 Sources
              </h4>

              <div className="space-y-3">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 transition hover:border-cyan-500"
                  >
                    <div className="font-medium">
                      {source.filename}
                    </div>

                    <div className="mt-2 text-xs text-zinc-400">
                      Similarity Score:{" "}
                      <span className="text-cyan-300">
                        {(source.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* ================= Retrieved Chunks ================= */}

        {!isUser &&
          retrievedChunks &&
          retrievedChunks.length > 0 && (
            <details className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950">
              <summary className="cursor-pointer px-4 py-3 font-medium text-cyan-400 hover:bg-zinc-900">
                🔍 View Retrieved Chunks ({retrievedChunks.length})
              </summary>

              <div className="space-y-4 p-4">
                {retrievedChunks.map(
                  (chunk, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-medium text-cyan-300">
                          📄 {chunk.filename}
                        </span>

                        <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                          {(chunk.score * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="max-h-60 overflow-y-auto rounded-lg bg-black/30 p-3">
                        <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                          {chunk.text}
                        </pre>
                      </div>
                    </div>
                  )
                )}
              </div>
            </details>
          )}
      </div>
    </div>
  );
}