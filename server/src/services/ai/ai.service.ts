import Groq from "groq-sdk";
import { searchRelevantChunks } from "../rag/search.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResponse(
  message: string,
  history: string
) {
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
                "You are MindWeave AI, a helpful AI assistant. Continue the conversation naturally using the previous conversation when relevant.",
            },
            {
              role: "user",
              content: `
Previous Conversation:

${history}

Current User Message:

${message}
`,
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
    // RAG Prompt
    // ===========================
    const prompt = `
You are MindWeave AI.

You are given:

1. Previous conversation
2. Retrieved document context

Always use the retrieved context as the primary source of truth.

Conversation history helps you understand follow-up questions.

Rules:

- Answer ONLY using the retrieved context.
- Never hallucinate.
- Never invent facts.
- Never use outside knowledge.
- If the answer isn't present in the context, reply exactly:

"I couldn't find that information in the uploaded documents."

Use concise bullet points whenever appropriate.

=========================
PREVIOUS CONVERSATION
=========================

${history}

=========================
RETRIEVED CONTEXT
=========================

${context}

=========================
CURRENT QUESTION
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