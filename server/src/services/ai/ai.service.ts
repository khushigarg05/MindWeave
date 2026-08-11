import Groq from "groq-sdk";
import { searchRelevantChunks } from "../rag/search.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// Remove unresolved template placeholders
// =====================================================

function cleanTemplatePlaceholders(
  text: string
): string {

  return (
    text

      // =================================================
      // Remove slash-separated placeholders
      // Examples:
      // [Business/ Business Casual/ Smart Casual/ Casual]
      // [3/5/7] days
      // [2/3] weeks
      // =================================================

      .replace(
        /\[[^\]]*\/[^\]]*\]/g,
        ""
      )

      // =================================================
      // Remove remaining text placeholders
      //
      // IMPORTANT:
      // Keep [1], [2], [3] because these are citations.
      // =================================================

      .replace(
        /\[(?!\d+\])[^\]]+\]/g,
        ""
      )

      // =================================================
      // Remove common leftover punctuation
      // =================================================

      .replace(
        /,\s*\./g,
        "."
      )

      .replace(
        /([.!?])\s*[,;:]+/g,
        "$1"
      )

      // =================================================
      // Remove spaces before punctuation
      // =================================================

      .replace(
        /\s+([,.!?;:])/g,
        "$1"
      )

      // =================================================
      // Remove excessive spaces
      // =================================================

      .replace(
        /[ \t]{2,}/g,
        " "
      )

      // =================================================
      // Remove spaces at beginning of lines
      // =================================================

      .replace(
        /\n[ \t]+/g,
        "\n"
      )

      // =================================================
      // Remove excessive blank lines
      // =================================================

      .replace(
        /\n{3,}/g,
        "\n\n"
      )

      .trim()
  );
}

// =====================================================
// Generate AI Response
// =====================================================

export async function generateResponse(
  message: string,
  history: string
) {

  try {

    // ===================================================
    // Retrieve Relevant Chunks
    // ===================================================

    const matches =
      await searchRelevantChunks(
        message
      );

    console.log(
      "===================================="
    );

    console.log(
      "RAG SEARCH"
    );

    console.log(
      "Query:",
      message
    );

    console.log(
      "Matches:",
      matches.length
    );

    console.log(
      "===================================="
    );

    // ===================================================
    // No Relevant Document Found
    // ===================================================

    if (
      matches.length === 0
    ) {

      return {

        success: true,

        userMessage:
          message,

        aiResponse:
          "I couldn't find that information in the uploaded documents.",

        retrievedChunks: [],

        sources: [],

      };
    }

    // ===================================================
    // Prepare Retrieved Chunks
    // ===================================================

    const numberedChunks =
      matches.map(
        (
          chunk,
          index
        ) => ({

          id:
            index + 1,

          filename:
            chunk.filename,

          score:
            Number(
              Number(
                chunk.score
              ).toFixed(3)
            ),

          // Clean document text before:
          // 1. Sending to Groq
          // 2. Returning to frontend

          text:
            cleanTemplatePlaceholders(
              chunk.text
            ),

        })
      );

    // ===================================================
    // Remove Empty Chunks
    // ===================================================

    const validChunks =
      numberedChunks.filter(
        (chunk) =>
          chunk.text.trim().length > 0
      );

    // ===================================================
    // Debug Retrieved Chunks
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "RETRIEVED CHUNKS"
    );

    console.log(
      "===================================="
    );

    validChunks.forEach(
      (chunk) => {

        console.log(
          `[${chunk.id}] ${chunk.filename} | score: ${chunk.score}`
        );

        console.log(
          chunk.text.substring(
            0,
            500
          )
        );

        console.log(
          "------------------------------------"
        );

      }
    );

    // ===================================================
    // Build Document Context
    // ===================================================

    const context =
      validChunks
        .map(
          (chunk) => `
[${chunk.id}]
SOURCE: ${chunk.filename}

${chunk.text}
`
        )
        .join(
          "\n\n====================================\n\n"
        );

    // ===================================================
    // RAG Prompt
    // ===================================================

    const prompt = `
You are MindWeave AI, a document-based AI assistant.

Your job is to answer the user's question using ONLY
the information contained in the uploaded document
context below.

IMPORTANT RULES:

1. Use ONLY the uploaded document context.

2. Do NOT use outside knowledge.

3. Do NOT guess.

4. Do NOT invent missing information.

5. Do NOT treat incomplete document text as a confirmed value.

6. If the exact answer is not present in the documents,
   say:

"I couldn't find that information in the uploaded documents."

7. If the document discusses the topic but the exact
   value is missing, clearly say that the exact value
   is not specified.

8. Prefer the most relevant source when multiple sources
   contain information about the same question.

9. Keep the answer concise and factual.

10. Answer using Markdown.

11. Cite factual statements using [1], [2], [3], etc.

12. Do NOT mention:
    - chunks
    - embeddings
    - vectors
    - Qdrant
    - similarity search
    - RAG
    - retrieval
    - internal system details

=====================================================
IMPORTANT PLACEHOLDER RULE
=====================================================

The uploaded documents may contain unresolved
template placeholders.

Examples:

[Business/ Business Casual/ Smart Casual/ Casual]

[slacks/ loafers/ blouses/ boots]

[3/5/7] days

[2/3] weeks

These placeholders are NOT confirmed information.

NEVER:

- choose one option
- guess the intended option
- reproduce the placeholder
- treat the placeholder as an actual value

If the answer depends on a missing placeholder value,
say:

"The exact value is not specified in the uploaded document."

You may still explain confirmed information
surrounding that missing value.

=====================================================
IMPORTANT CITATION RULE
=====================================================

Use the source number provided before each document.

For example:

[1] = first retrieved source
[2] = second retrieved source
[3] = third retrieved source

Every factual statement taken from the documents
should include the appropriate citation.

Example:

### Overtime Pay

Non-exempt employees are entitled to overtime pay
of one and a half times their wage [1].

Example:

### Remote Working Policy

The document states that office-based employees may
work remotely for a maximum period per year, but the
exact number is not specified in the uploaded document
[1].

Employees must submit remote-working requests in
advance [1].

DO NOT invent missing values.

=====================================================
CONVERSATION HISTORY
=====================================================

Previous Conversation:

${history}

=====================================================
UPLOADED DOCUMENT CONTEXT
=====================================================

${context}

=====================================================
CURRENT USER QUESTION
=====================================================

${message}

=====================================================
ANSWER
=====================================================

Answer now using ONLY the uploaded document context.
Use [1], [2], [3] citations for factual statements.
`;

    // ===================================================
    // Generate AI Response
    // ===================================================

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "system",

            content:
              "You are MindWeave AI. Answer strictly from uploaded document context. Never guess, never invent missing values, never output unresolved template placeholders, and cite factual statements using [1], [2], [3].",
          },

          {
            role: "user",

            content:
              prompt,
          },

        ],

        temperature: 0,

        max_tokens: 1024,

      });

    // ===================================================
    // Extract AI Response
    // ===================================================

    let aiResponse =
      completion
        .choices[0]
        ?.message
        ?.content
        ?.trim() ||

      "I couldn't find that information in the uploaded documents.";

    // ===================================================
    // Final Safety Cleanup
    // ===================================================

    aiResponse =
      cleanTemplatePlaceholders(
        aiResponse
      );

    // ===================================================
    // IMPORTANT:
    // Ensure citations survive cleanup
    // ===================================================

    aiResponse =
      aiResponse
        .replace(
          /,\s*\./g,
          "."
        )
        .replace(
          /\s+([,.!?;:])/g,
          "$1"
        )
        .trim();

    // ===================================================
    // Unique Sources
    // ===================================================

    const sources =
      Array.from(

        new Map(

          validChunks.map(
            (chunk) => [

              chunk.filename,

              {
                filename:
                  chunk.filename,

                score:
                  chunk.score,
              },

            ]
          )

        ).values()

      );

    // ===================================================
    // Final Debug
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "FINAL AI RESPONSE"
    );

    console.log(
      "===================================="
    );

    console.log(
      aiResponse
    );

    console.log(
      "===================================="
    );

    console.log(
      "SOURCES"
    );

    console.log(
      "===================================="
    );

    sources.forEach(
      (source) => {

        console.log(
          `${source.filename} | ${source.score}`
        );

      }
    );

    // ===================================================
    // Return Result
    // ===================================================

    return {

      success: true,

      userMessage:
        message,

      aiResponse,

      retrievedChunks:
        validChunks,

      sources,

    };

  } catch (error) {

    // ===================================================
    // Error Handling
    // ===================================================

    console.error(
      "Groq API Error:",
      error
    );

    return {

      success: false,

      userMessage:
        message,

      aiResponse:
        "Sorry, I am unable to answer right now.",

      retrievedChunks: [],

      sources: [],

    };

  }
}