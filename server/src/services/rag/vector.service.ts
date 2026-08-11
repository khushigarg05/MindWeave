import { v4 as uuid } from "uuid";
import { generateEmbedding } from "./embedding.service";
import { qdrant } from "./qdrant.service";

const COLLECTION_NAME = "mindweave";

interface Chunk {
  pageContent: string;
}

// ===============================================
// Store Chunks in Qdrant
// ===============================================

export async function storeChunks(
  chunks: Chunk[],
  filename: string
) {
  console.log("====================================");
  console.log("GENERATING EMBEDDINGS...");
  console.log(`File: ${filename}`);
  console.log(`Chunks: ${chunks.length}`);
  console.log("====================================");

  const points = await Promise.all(
    chunks.map(async (chunk, index) => {
      const text = chunk.pageContent.trim();

      // Skip empty chunks
      if (!text) {
        return null;
      }

      const embedding = await generateEmbedding(text);

      console.log(
        `Embedding ${index + 1}/${chunks.length} | Dimension: ${embedding.length}`
      );

      return {
        id: uuid(),

        vector: embedding,

        payload: {
          text,
          source: "uploaded-pdf",
          filename,
          chunkIndex: index,
        },
      };
    })
  );

  // Remove empty chunks
  const validPoints = points.filter(
    (point): point is NonNullable<typeof point> =>
      point !== null
  );

  console.log("====================================");
  console.log(
    `Storing ${validPoints.length} vectors in Qdrant...`
  );
  console.log("====================================");

  if (validPoints.length === 0) {
    console.log("❌ No valid chunks to store");
    return;
  }

  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: validPoints as any,
  });

  console.log("✅ All vectors stored successfully");

  console.log(
    `📄 File: ${filename}`
  );

  console.log(
    `📦 Vectors stored: ${validPoints.length}`
  );
}

// ===============================================
// Delete all vectors of a document
// ===============================================

export async function deleteVectorsByFilename(
  filename: string
) {
  console.log("====================================");
  console.log("DELETING DOCUMENT VECTORS");
  console.log("====================================");

  console.log(`📄 File: ${filename}`);

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