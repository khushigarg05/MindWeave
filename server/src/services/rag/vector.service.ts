import { v4 as uuid } from "uuid";
import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

interface Chunk {
  pageContent: string;
}

export async function storeChunks(
  chunks: Chunk[],
  filename: string
) {
  console.log("====================================");
  console.log("GENERATING EMBEDDINGS...");
  console.log("====================================");

  const points = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await generateEmbedding(
        chunk.pageContent
      );

      return {
        id: uuid(),
        vector: embedding,
        payload: {
          text: chunk.pageContent,
          source: "uploaded-pdf",
          filename,
        },
      };
    })
  );

  console.log(`Storing ${points.length} vectors...`);

  await qdrant.upsert("mindweave", {
    wait: true,
    points: points as any,
  });

  console.log("✅ All vectors stored successfully");
}