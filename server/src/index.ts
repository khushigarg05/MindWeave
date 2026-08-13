import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { createCollection } from "./services/rag/qdrant.service";

connectDB().then(async () => {
  try {
    // Create Qdrant collection if it doesn't exist
    await createCollection();

    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to initialize Qdrant:",
      error
    );

    process.exit(1);
  }
});