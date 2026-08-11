import { searchRelevantChunks } from "./search.service";
import { groq } from "../groq.service";

// =======================================================
// Ask RAG
// =======================================================

export async function askRAG(question: string) {
  // =====================================================
  // Retrieve relevant chunks
  // =====================================================

  const matches = await searchRelevantChunks(question);

  // =====================================================
  // No Context Found
  // =====================================================

  if (matches.length === 0) {
    return {
      answer:
        "I couldn't find that information in the uploaded documents.",
      matches: [],
    };
  }

  // =====================================================
  // Build Document Context
  // =====================================================

  const context = matches
    .map(
      (chunk, index) => `
SOURCE ${index + 1}
Filename: ${chunk.filename}

Content:
${chunk.text}
`
    )
    .join("\n\n");

  // =====================================================
  // Strict RAG Prompt
  // =====================================================

  const prompt = `
You are MindWeave AI, a strict document-grounded AI assistant.

Your job is to answer the user's question using ONLY the
retrieved document context provided below.

=======================================================
IMPORTANT RULES
=======================================================

1. Use ONLY information explicitly present in the context.

2. NEVER use outside knowledge or assumptions.

3. Carefully read ALL retrieved sources before answering.

4. If the answer is explicitly available in ANY retrieved
   chunk, use that information.

5. If multiple chunks contain related information, combine
   them when necessary to answer the question.

6. NEVER invent a missing number, date, duration, percentage,
   policy limit, or other value.

7. PDF extraction may sometimes produce incomplete text.
   For example:

   "maximum of per year"

   If the actual number is missing from the retrieved text,
   DO NOT guess what the number should be.

8. If the question asks for an exact value and that value is
   missing from the context, explicitly say that the exact
   value is not specified in the uploaded documents.

9. If the context contains only partial information, explain
   only what can be confirmed from the context.

10. If the answer is completely absent from the context,
    respond exactly:

    "I couldn't find that information in the uploaded documents."

11. Keep answers concise, clear, and factual.

12. Do not mention similarity scores.

13. Do not mention internal retrieval, embeddings, Qdrant,
    chunks, or RAG unless the user specifically asks about
    the system.

=======================================================
ANSWERING STYLE
=======================================================

If the answer is directly available:

Give the answer clearly and briefly.

If an exact value is missing:

State what the document confirms and clearly identify
the missing detail.

Example:

"The handbook states that office-based employees may work
remotely for a maximum period per year, but the exact number
of weeks is not visible in the uploaded document."

Do NOT replace the missing value with a guess.

=======================================================
RETRIEVED DOCUMENT CONTEXT
=======================================================

${context}

=======================================================
USER QUESTION
=======================================================

${question}

=======================================================
ANSWER
=======================================================
`;

  // =====================================================
  // Generate AI Response
  // =====================================================

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content:
          "You are a strict document-grounded RAG assistant. Never invent information that is not present in the supplied documents.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0,
  });

  // =====================================================
  // Extract Answer Safely
  // =====================================================

  const answer =
    completion.choices[0]?.message?.content?.trim() ||
    "I couldn't find that information in the uploaded documents.";

  // =====================================================
  // Return Answer + Sources
  // =====================================================

  return {
    answer,
    matches,
  };
}