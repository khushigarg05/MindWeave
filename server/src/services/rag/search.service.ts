import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

// ======================================================
// Similarity Threshold
// ======================================================

// Qdrant cosine similarity:
// Higher score = more relevant.
//
// 0.45 is a reasonable starting point.
// We can tune this after testing more questions.

const SIMILARITY_THRESHOLD = 0.45;


// ======================================================
// Search Relevant Chunks
// ======================================================

export async function searchRelevantChunks(
  query: string
) {

  // ===========================
  // Generate Query Embedding
  // ===========================

  const embedding =
    await generateEmbedding(query);

  console.log("====================================");
  console.log("SEARCH QUERY");
  console.log(query);
  console.log("Embedding Dimension:", embedding.length);
  console.log("====================================");


  // ===========================
  // Search Qdrant
  // ===========================

  const result =
    await qdrant.search("mindweave", {
      vector: embedding,
      limit: 10,
      with_payload: true,
    });


  // ===========================
  // Print Raw Results
  // ===========================

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

        console.log({
          rank: index + 1,
          score: point.score,
          filename:
            point.payload?.filename,
        });

      }
    );

  }


  console.log(
    "========================================"
  );


  // ======================================================
  // Filter Weak Results
  // ======================================================

  const filtered =
    result.filter(
      (point: any) =>
        Number(point.score) >=
        SIMILARITY_THRESHOLD
    );


  // ======================================================
  // Sort Highest Score First
  // ======================================================

  filtered.sort(
    (a: any, b: any) =>
      b.score - a.score
  );


  // ======================================================
  // Keep Maximum 5 Results
  // ======================================================

  const topResults =
    filtered.slice(0, 5);


  // ======================================================
  // Print Filtered Results
  // ======================================================

  console.log(
    "========== FILTERED RESULTS =========="
  );

  if (topResults.length === 0) {

    console.log(
      "❌ No results passed similarity threshold"
    );

  } else {

    topResults.forEach(
      (point: any, index: number) => {

        console.log({
          rank: index + 1,
          score: Number(
            Number(point.score).toFixed(4)
          ),
          filename:
            point.payload?.filename,
        });

      }
    );

  }

  console.log(
    "======================================="
  );


  // ======================================================
  // Return Results
  // ======================================================

  return topResults.map(
    (point: any) => ({

      score: Number(
        Number(point.score).toFixed(4)
      ),

      text:
        point.payload?.text ?? "",

      source:
        point.payload?.source ?? "",

      filename:
        point.payload?.filename ??
        "Unknown",

    })
  );
}