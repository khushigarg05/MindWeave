import { v4 as uuid } from "uuid";
import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

const COLLECTION_NAME = "mindweave";

interface Chunk {
  pageContent: string;
}

// ===============================================
// Store Chunks
// ===============================================

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

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: points as any,
  });

  console.log("✅ All vectors stored successfully");
}

// ===============================================
// Delete all vectors of a document
// ===============================================

export async function deleteVectorsByFilename(
  filename: string
) {
  console.log(`Deleting vectors of ${filename}...`);

  await qdrant.delete(COLLECTION_NAME, {
    wait: true,
    filter: {
      must: [
        {
          key: "filename",
          match: {
            value: filename,
          },
        },
      ],
    },
  });

  console.log("✅ Vectors deleted successfully");
}