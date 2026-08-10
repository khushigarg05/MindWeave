import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

// =======================================================
// Similarity Threshold
// =======================================================

const SIMILARITY_THRESHOLD = 0.45;

// =======================================================
// Search Relevant Chunks
// =======================================================

export async function searchRelevantChunks(query: string) {
  // ===========================
  // Generate Query Embedding
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
    limit: 8,
    with_payload: true,
  });

  // ===========================
  // Raw Results
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

  // =======================================================
  // Filter By Similarity
  // =======================================================

  const filtered = result.filter(
    (point: any) =>
      Number(point.score) >= SIMILARITY_THRESHOLD
  );

  // =======================================================
  // Sort Highest Score First
  // =======================================================

  filtered.sort(
    (a: any, b: any) =>
      Number(b.score) - Number(a.score)
  );

  // =======================================================
  // Remove Exact Duplicate Chunks
  // =======================================================

  const uniqueChunks: any[] = [];

  const seenTexts = new Set<string>();

  for (const point of filtered) {
    const text =
      point.payload?.text?.trim() ?? "";

    if (!text) {
      continue;
    }

    const normalizedText = text
      .replace(/\s+/g, " ")
      .toLowerCase();

    if (seenTexts.has(normalizedText)) {
      continue;
    }

    seenTexts.add(normalizedText);

    uniqueChunks.push(point);
  }

  // =======================================================
  // Limit Final Results
  // =======================================================

  const finalResults =
    uniqueChunks.slice(0, 5);

  // =======================================================
  // Final Debug Output
  // =======================================================

  console.log("========== FINAL RAG RESULTS ==========");

  finalResults.forEach(
    (point: any, index: number) => {
      console.log(
        `[${index + 1}] ${point.payload?.filename} | score: ${point.score}`
      );

      console.log(
        point.payload?.text?.substring(0, 300)
      );

      console.log("------------------------------------");
    }
  );

  console.log("=======================================");

  // =======================================================
  // Return Results
  // =======================================================

  return finalResults.map(
    (point: any) => ({
      score: Number(
        Number(point.score).toFixed(3)
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