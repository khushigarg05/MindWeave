import { InferenceClient } from "@huggingface/inference";
import { env } from "../../config/env";

const client = new InferenceClient(env.HUGGINGFACE_API_KEY);

export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const embedding = await client.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // Convert SDK output to a plain number[]
  return Array.from(embedding as Iterable<number>);
}