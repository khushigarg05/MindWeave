import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${env.PORT}`);
  });
});