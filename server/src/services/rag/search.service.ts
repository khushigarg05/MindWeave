import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

export async function searchRelevantChunks(query: string) {
  const embedding = await generateEmbedding(query);

  const result = await qdrant.search("mindweave", {
    vector: embedding,
    limit: 5,
    with_payload: true,
  });

  return result.map((point: any) => ({
    score: point.score,
    text: point.payload?.text,
    source: point.payload?.source,
    filename: point.payload?.filename,
  }));
}