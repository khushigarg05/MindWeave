import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  MONGODB_URI: process.env.MONGODB_URI!,

  GROQ_API_KEY: process.env.GROQ_API_KEY!,

  HUGGINGFACE_API_KEY:
    process.env.HUGGINGFACE_API_KEY!,

  QDRANT_URL:
    process.env.QDRANT_URL!,

  QDRANT_API_KEY:
    process.env.QDRANT_API_KEY!,
};