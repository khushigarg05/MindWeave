import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

console.log(
  "Groq Key:",
  process.env.GROQ_API_KEY?.slice(0, 10) + "..."
);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(
      `🚀 Server running at http://localhost:${env.PORT}`
    );
  });
});