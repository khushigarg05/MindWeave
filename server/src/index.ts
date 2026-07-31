import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { createCollection } from "./services/rag/qdrant.service";

console.log(
  "Groq Key:",
  process.env.GROQ_API_KEY?.slice(0, 10) + "..."
);

connectDB().then(async () => {
  try {
    // Create Qdrant collection if it doesn't exist
    await createCollection();

    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server running at http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to initialize Qdrant:", error);
    process.exit(1);
  }
});