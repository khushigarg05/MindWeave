import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

// Temporarily disable filtering for debugging
const SIMILARITY_THRESHOLD = 0.35;

export async function searchRelevantChunks(query: string) {
  // ===========================
  // Generate query embedding
  // ===========================
  const embedding = await generateEmbedding(query);

  console.log("====================================");
  console.log("SEARCH QUERY");
  console.log(query);
  console.log("Embedding Dimension:", embedding.length);
  console.log("====================================");

  // ===========================
  // Search Qdrant
  // ===========================
  const result = await qdrant.search("mindweave", {
    vector: embedding,
    limit: 5,
    with_payload: true,
  });

  // ===========================
  // Print raw search results
  // ===========================
  console.log("========== RAW SEARCH RESULTS ==========");

  if (result.length === 0) {
    console.log("❌ Qdrant returned 0 results");
  } else {
    result.forEach((point: any, index: number) => {
      console.log({
        rank: index + 1,
        score: point.score,
        filename: point.payload?.filename,
      });
    });
  }

  console.log("========================================");

  // ======================================================
  // DEBUG:
  // Return ALL results (no threshold filtering)
  // ======================================================
  const filtered = result;

  // Sort highest score first
  filtered.sort((a: any, b: any) => b.score - a.score);

  return filtered.map((point: any) => ({
    score: point.score,
    text: point.payload?.text ?? "",
    source: point.payload?.source ?? "",
    filename: point.payload?.filename ?? "Unknown",
  }));
}