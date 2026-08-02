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

    // ======================================================
    // No relevant document found -> Normal AI conversation
    // ======================================================
    if (matches.length === 0) {
      const completion =
        await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content:
                "You are MindWeave AI, a helpful AI assistant. Answer naturally and clearly.",
            },
            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.7,
          max_tokens: 1024,
        });

      return {
        success: true,
        userMessage: message,

        aiResponse:
          completion.choices[0]?.message?.content ??
          "No response generated.",

        retrievedChunks: [],

        sources: [],
      };
    }

    // ===========================
    // Build Context
    // ===========================
    const context = matches
      .map((chunk) => chunk.text)
      .join("\n\n");

    // ===========================
    // Better RAG Prompt
    // ===========================
    const prompt = `
You are MindWeave AI.

You MUST answer ONLY using the information inside the provided CONTEXT.

Rules:

- Never hallucinate.
- Never invent facts.
- Never use outside knowledge.
- If the answer isn't contained inside the context, reply exactly:

"I couldn't find that information in the uploaded documents."

When possible:
- Use bullet points.
- Keep answers concise.
- Merge information from multiple retrieved chunks.

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
    // Unique Sources
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