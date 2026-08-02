import { searchRelevantChunks } from "./search.service";
import { groq } from "../groq.service";

export async function askRAG(question: string) {
  // Retrieve relevant chunks
  const matches = await searchRelevantChunks(question);

  const context = matches
    .map((chunk) => chunk.text)
    .join("\n\n");

  const prompt = `
You are MindWeave AI.

Answer ONLY using the provided context.

If the answer is not present in the context, reply:

"I couldn't find that information in the uploaded documents."

Context:
${context}

Question:
${question}

Answer:
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return {
    answer:
      completion.choices[0].message.content,
    matches,
  };
}