import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

const SIMILARITY_THRESHOLD = 0.65;

export async function searchRelevantChunks(query: string) {
  // Generate embedding for user query
  const embedding = await generateEmbedding(query);

  // Search Qdrant
  const result = await qdrant.search("mindweave", {
    vector: embedding,
    limit: 5,
    with_payload: true,
  });

  // Keep only relevant chunks
  const filtered = result.filter(
    (point: any) => point.score >= SIMILARITY_THRESHOLD
  );

  // Sort by similarity score (highest first)
  filtered.sort(
    (a: any, b: any) => b.score - a.score
  );

  return filtered.map((point: any) => ({
    score: point.score,
    text: point.payload?.text ?? "",
    source: point.payload?.source ?? "",
    filename: point.payload?.filename ?? "Unknown",
  }));
}