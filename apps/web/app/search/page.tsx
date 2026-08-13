"use client";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

type SearchResult = {
  filename: string;
  score: number;
  text: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] =
    useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  async function handleSearch() {
    if (!query.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResults([]);

      const response = await fetch(
        "`${API_URL}/search`",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query: query.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Search failed"
        );
      }

      setResults(data.matches ?? []);
    } catch (error) {
      console.error("Search Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to perform search."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-full p-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Search Knowledge
        </h1>

        <p className="mt-2 text-zinc-400">
          Search through the documents stored in
          your MindWeave knowledge base.
        </p>

      </div>

      {/* =================================================
          SEARCH BOX
      ================================================= */}

      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

        <div className="flex gap-3">

          <div className="relative flex-1">

            <Search
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-zinc-500
              "
            />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search your knowledge base..."
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                py-3
                pl-12
                pr-4
                text-white
                outline-none
                transition
                focus:border-cyan-500
              "
            />

          </div>

          <button
            onClick={handleSearch}
            disabled={
              loading ||
              !query.trim()
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Searching...
              </>
            ) : (
              <>
                <Search size={18} />

                Search
              </>
            )}

          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            p-4
            text-sm
            text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          RESULTS HEADER
      ================================================= */}

      {results.length > 0 && (
        <div className="mb-4">

          <h2 className="text-xl font-semibold">
            Search Results
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Found {results.length} relevant chunks.
          </p>

        </div>
      )}

      {/* =================================================
          RESULTS
      ================================================= */}

      <div className="space-y-4">

        {results.map((result, index) => (

          <div
            key={index}
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900
              p-5
              transition
              hover:border-cyan-500/50
            "
          >

            {/* ---------------------------------------------
                RESULT HEADER
            --------------------------------------------- */}

            <div className="mb-4 flex items-start justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-400
                  "
                >
                  <FileText size={20} />
                </div>

                <div className="min-w-0">

                  <h3 className="truncate font-semibold text-white">
                    {result.filename}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Retrieved chunk #{index + 1}
                  </p>

                </div>

              </div>

              {/* -------------------------------------------
                  SCORE
              ------------------------------------------- */}

              <div className="shrink-0 text-right">

                <div className="text-sm font-semibold text-cyan-400">
                  {(result.score * 100).toFixed(1)}%
                </div>

                <div className="text-xs text-zinc-500">
                  Similarity
                </div>

              </div>

            </div>

            {/* ---------------------------------------------
                SCORE BAR
            --------------------------------------------- */}

            <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="
                  h-full
                  rounded-full
                  bg-cyan-400
                "
                style={{
                  width: `${Math.min(
                    result.score * 100,
                    100
                  )}%`,
                }}
              />

            </div>

            {/* ---------------------------------------------
                RETRIEVED TEXT
            --------------------------------------------- */}

            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950
                p-4
              "
            >

              <p
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-7
                  text-zinc-300
                "
              >
                {result.text}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* =================================================
          NO RESULTS
      ================================================= */}

      {!loading &&
        !error &&
        query &&
        results.length === 0 && (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900
              p-12
              text-center
            "
          >

            <Search
              size={42}
              className="mb-4 text-zinc-700"
            />

            <h3 className="text-lg font-semibold text-zinc-300">
              No results found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try using different keywords.
            </p>

          </div>

        )}

      {/* =================================================
          INITIAL STATE
      ================================================= */}

      {!query &&
        results.length === 0 && (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900
              p-12
              text-center
            "
          >

            <Search
              size={42}
              className="mb-4 text-zinc-700"
            />

            <h3 className="text-lg font-semibold text-zinc-300">
              Search your knowledge base
            </h3>

            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Enter a question or keyword to find
              relevant information from your
              uploaded documents.
            </p>

          </div>

        )}

    </main>
  );
}