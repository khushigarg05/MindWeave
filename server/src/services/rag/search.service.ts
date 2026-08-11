import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";



// =======================================================
// Similarity Threshold
// =======================================================

const SIMILARITY_THRESHOLD = 0.40;



// =======================================================
// Search Relevant Chunks
// =======================================================

export async function searchRelevantChunks(
  query: string
) {

  // =======================================================
  // Generate Query Embedding
  // =======================================================

  const embedding =
    await generateEmbedding(query);


  console.log(
    "===================================="
  );

  console.log(
    "SEARCH QUERY"
  );

  console.log(
    query
  );

  console.log(
    "Embedding Dimension:",
    embedding.length
  );

  console.log(
    "===================================="
  );


  // =======================================================
  // Search Qdrant
  // =======================================================

  const result =
    await qdrant.search(
      "mindweave",
      {
        vector: embedding,

        // Retrieve more candidates
        // before filtering.

        limit: 10,

        with_payload: true,
      }
    );


  // =======================================================
  // Raw Results
  // =======================================================

  console.log(
    "========== RAW SEARCH RESULTS =========="
  );


  if (result.length === 0) {

    console.log(
      "❌ Qdrant returned 0 results"
    );

  } else {

    result.forEach(
      (point: any, index: number) => {

        const text =
          typeof point.payload?.text === "string"
            ? point.payload.text
            : "";

        const filename =
          typeof point.payload?.filename === "string"
            ? point.payload.filename
            : "Unknown";


        console.log(
          `\n[${index + 1}] ${filename} | score: ${Number(point.score).toFixed(3)}`
        );


        console.log(
          text.substring(
            0,
            500
          )
        );


        console.log(
          "------------------------------------"
        );

      }
    );

  }


  console.log(
    "========================================"
  );


  // =======================================================
  // Query Keywords
  // =======================================================

  const queryWords =
    query
      .toLowerCase()
      .replace(
        /[^a-z0-9\s]/g,
        " "
      )
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2
      );


  // =======================================================
  // Filter By Similarity
  // =======================================================

  const filtered =
    result.filter(
      (point: any) => {

        return (
          Number(point.score) >=
          SIMILARITY_THRESHOLD
        );

      }
    );


  // =======================================================
  // Relevance Boosting
  // =======================================================

  const scoredResults =
    filtered.map(
      (point: any) => {

        const rawText =
          typeof point.payload?.text === "string"
            ? point.payload.text
            : "";

        const text =
          rawText.toLowerCase();


        // Count how many query words
        // appear inside the chunk.

        let keywordMatches = 0;


        queryWords.forEach(
          (word) => {

            if (
              text.includes(word)
            ) {

              keywordMatches++;

            }

          }
        );


        // Small keyword boost.
        //
        // Semantic similarity remains
        // the main ranking factor.

        const keywordBoost =
          keywordMatches *
          0.02;


        const finalScore =
          Number(point.score) +
          keywordBoost;


        return {
          ...point,

          keywordMatches,

          finalScore,
        };

      }
    );


  // =======================================================
  // Sort By Combined Relevance
  // =======================================================

  scoredResults.sort(
    (a: any, b: any) => {

      return (
        Number(b.finalScore) -
        Number(a.finalScore)
      );

    }
  );


  // =======================================================
  // Remove Duplicate Chunks
  // =======================================================

  const uniqueChunks: any[] =
    [];

  const seenTexts =
    new Set<string>();


  for (
    const point of scoredResults
  ) {

    const rawText =
      point.payload?.text;


    // Make sure text is a string.

    const text =
      typeof rawText === "string"
        ? rawText.trim()
        : "";


    if (!text) {
      continue;
    }


    // =====================================================
    // Normalize Text
    // =====================================================

    const normalizedText =
      text
        .replace(
          /\s+/g,
          " "
        )
        .toLowerCase();


    // =====================================================
    // Skip Exact Duplicate Chunks
    // =====================================================

    if (
      seenTexts.has(
        normalizedText
      )
    ) {

      continue;

    }


    seenTexts.add(
      normalizedText
    );


    uniqueChunks.push(
      point
    );

  }


  // =======================================================
  // Limit Final Results
  // =======================================================

  const finalResults =
    uniqueChunks.slice(
      0,
      3
    );


  // =======================================================
  // Final Debug Output
  // =======================================================

  console.log(
    "========== FINAL RAG RESULTS =========="
  );


  if (
    finalResults.length === 0
  ) {

    console.log(
      "❌ No relevant chunks found"
    );

  }


  finalResults.forEach(
    (
      point: any,
      index: number
    ) => {

      const text =
        typeof point.payload?.text === "string"
          ? point.payload.text
          : "";


      const filename =
        typeof point.payload?.filename === "string"
          ? point.payload.filename
          : "Unknown";


      console.log(
        `[${index + 1}] ${filename} | similarity: ${Number(point.score).toFixed(3)} | final: ${Number(point.finalScore).toFixed(3)} | keywords: ${point.keywordMatches}`
      );


      console.log(
        text.substring(
          0,
          800
        )
      );


      console.log(
        "------------------------------------"
      );

    }
  );


  console.log(
    "======================================="
  );


  // =======================================================
  // Return Results
  // =======================================================

  return finalResults.map(
    (point: any) => {

      const rawText =
        point.payload?.text;


      const rawSource =
        point.payload?.source;


      const rawFilename =
        point.payload?.filename;


      return {

        score:
          Number(
            Number(
              point.score
            ).toFixed(3)
          ),


        text:
          typeof rawText === "string"
            ? rawText
            : "",


        source:
          typeof rawSource === "string"
            ? rawSource
            : "",


        filename:
          typeof rawFilename === "string"
            ? rawFilename
            : "Unknown",

      };

    }
  );

}