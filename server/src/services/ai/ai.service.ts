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
    // Retrieve Relevant Chunks
    // ===========================

    const matches = await searchRelevantChunks(message);

    // =====================================================
    // No document match -> Normal conversation
    // =====================================================

    if (matches.length === 0) {
      const completion =
        await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content:
                "You are MindWeave AI, a helpful AI assistant. Continue conversations naturally.",
            },
            {
              role: "user",
              content: `
Previous Conversation

${history}

Current User Message

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

    // =====================================================
    // Number retrieved chunks
    // =====================================================

    const numberedChunks = matches.map(
      (chunk, index) => ({
        id: index + 1,
        filename: chunk.filename,
        score: Number(chunk.score.toFixed(3)),
        text: chunk.text,
      })
    );

    // =====================================================
    // Build Context
    // =====================================================

    const context = numberedChunks
      .map(
        (chunk) => `
[${chunk.id}]
Document : ${chunk.filename}

${chunk.text}
`
      )
      .join("\n\n-----------------------------\n\n");

    // =====================================================
    // Prompt
    // =====================================================

    const prompt = `
You are MindWeave AI.

You are provided with:

1. Previous conversation
2. Retrieved document chunks

The retrieved chunks are the ONLY source of truth.

Each chunk has an ID like:

[1]
[2]
[3]

Whenever you use information from a chunk, cite it inline.

Example:

Employees are entitled to 12 casual leaves per year [1].

Rules:

- Use ONLY retrieved context.
- Never hallucinate.
- Never invent facts.
- Never use outside knowledge.
- If multiple chunks support an answer, cite all of them.
- Answer in markdown.
- Use headings and bullet points.
- Keep answers concise.
- Never mention "retrieved context".
- Never say "according to chunk".
- Only use citations like [1], [2].

If the answer is not found, reply exactly:

"I couldn't find that information in the uploaded documents."

=========================
PREVIOUS CONVERSATION
=========================

${history}

=========================
RETRIEVED CONTEXT
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

    // =====================================================
    // LLM
    // =====================================================

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.1,
        max_tokens: 1024,
      });

    // =====================================================
    // Unique Sources
    // =====================================================

    const sources = Array.from(
      new Map(
        numberedChunks.map((chunk) => [
          chunk.filename,
          {
            filename: chunk.filename,
            score: chunk.score,
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

      retrievedChunks: numberedChunks,

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