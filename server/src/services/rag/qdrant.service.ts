import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "../../config/env";

export const qdrant = new QdrantClient({
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
});

export async function createCollection() {
  const collectionName = "mindweave";

  const collections = await qdrant.getCollections();

  const exists = collections.collections.some(
    (c) => c.name === collectionName
  );

  if (!exists) {
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log("✅ Qdrant Collection Created");
  } else {
    console.log("✅ Collection already exists");
  }

  // ==========================================
  // Create payload index for filename
  // ==========================================

  try {
    await qdrant.createPayloadIndex(collectionName, {
      field_name: "filename",
      field_schema: "keyword",
    });

    console.log("✅ Filename payload index ready");
  } catch (err: any) {
    console.log("ℹ️ Payload index already exists");
  }
}