import { v4 as uuid } from "uuid";
import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

interface Chunk {
  pageContent: string;
}

export async function storeChunks(chunks: Chunk[]) {
  const points: {
    id: string;
    vector: number[];
    payload: {
      text: string;
    };
  }[] = [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.pageContent);

    points.push({
      id: uuid(),
      vector: embedding,
      payload: {
        text: chunk.pageContent,
      },
    });
  }

  await qdrant.upsert("mindweave", {
    wait: true,
    points,
  });

  console.log(`✅ Stored ${points.length} chunks`);
}