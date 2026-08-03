"use client";

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

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 whitespace-pre-wrap break-words ${
          isUser
            ? "bg-cyan-500 text-black"
            : "border border-zinc-700 bg-zinc-900 text-white"
        }`}
      >
        {/* ================= Message ================= */}

        {isUser ? (
          text
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

        {/* ================= Sources ================= */}

        {!isUser && sources && sources.length > 0 && (
          <div className="mt-5 border-t border-zinc-700 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-cyan-400">
              📄 Sources
            </h4>

            <div className="space-y-2">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-zinc-800 p-3"
                >
                  <div className="font-medium">
                    {source.filename}
                  </div>

                  <div className="mt-1 text-xs text-zinc-400">
                    Similarity Score: {source.score}
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
            <details className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950">
              <summary className="cursor-pointer px-4 py-3 font-medium text-cyan-400">
                🔍 View Retrieved Chunks
              </summary>

              <div className="space-y-4 p-4">
                {retrievedChunks.map((chunk, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-cyan-300">
                        {chunk.filename}
                      </span>

                      <span className="text-xs text-zinc-400">
                        Score: {chunk.score.toFixed(3)}
                      </span>
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-300">
                      {chunk.text}
                    </pre>
                  </div>
                ))}
              </div>
            </details>
          )}
      </div>
    </div>
  );
}