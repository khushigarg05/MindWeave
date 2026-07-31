import dotenv from "dotenv";

const result = dotenv.config();

console.log("dotenv result:", result);

console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);

export const env = {
  PORT: process.env.PORT || "5000",
  MONGODB_URI: process.env.MONGODB_URI!,
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY!,
};