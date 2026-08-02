import Groq from "groq-sdk";
import { searchRelevantChunks } from "../rag/search.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResponse(message: string) {
  try {
    // ===========================
    // Retrieve relevant chunks
    // ===========================
    const matches = await searchRelevantChunks(message);

    const context = matches
      .map((chunk) => chunk.text)
      .join("\n\n");

    // ===========================
    // Build RAG Prompt
    // ===========================
    const prompt = `
You are MindWeave AI.

Answer ONLY using the information provided in the context below.

If the answer is not present in the context, reply exactly:

"I couldn't find that information in the uploaded documents."

Do not make up facts.
Do not use your own knowledge.

=========================
CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${message}

=========================
ANSWER
=========================
`;

    // ===========================
    // Groq
    // ===========================
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,
        max_tokens: 1024,
      });

    // ===========================
    // Extract unique sources
    // ===========================
    const sources = Array.from(
      new Map(
        matches.map((chunk) => [
          chunk.filename,
          {
            filename: chunk.filename,
            score: Number(chunk.score.toFixed(3)),
          },
        ])
      ).values()
    );

    return {
      success: true,
      userMessage: message,

      aiResponse:
        completion.choices[0]?.message?.content ??
        "No response generated.",

      retrievedChunks: matches,

      sources,
    };

  } catch (error) {

    console.error("Groq API Error:", error);

    return {
      success: false,
      userMessage: message,
      aiResponse:
        "Sorry, I am unable to answer right now.",

      retrievedChunks: [],

      sources: [],
    };
  }
}