import Groq from "groq-sdk";
import { searchRelevantChunks } from "../rag/search.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// Remove unresolved template placeholders
// =====================================================

function cleanTemplatePlaceholders(text: string): string {
  return text
    .replace(
      /\[[^\]]*\/[^\]]*\]/g,
      ""
    )
    .replace(
      /\[[^\]]*\]/g,
      ""
    )
    .replace(
      /[ \t]{2,}/g,
      " "
    )
    .replace(
      /\n[ \t]+/g,
      "\n"
    )
    .trim();
}

// =====================================================
// Generate AI Response
// =====================================================

export async function generateResponse(
  message: string,
  history: string
) {
  try {
    // =====================================================
    // Retrieve Relevant Chunks
    // =====================================================

    const matches =
      await searchRelevantChunks(message);

    console.log("====================================");
    console.log("RAG SEARCH");
    console.log("Query:", message);
    console.log("Matches:", matches.length);
    console.log("====================================");

    // =====================================================
    // No Relevant Document Found
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

    // =====================================================
    // Prepare Retrieved Chunks
    // =====================================================

    const numberedChunks = matches.map(
      (chunk, index) => ({
        id: index + 1,

        filename: chunk.filename,

        score: Number(
          Number(chunk.score).toFixed(3)
        ),

        // IMPORTANT:
        // Remove unresolved template placeholders
        // before sending the context to the AI.
        text: cleanTemplatePlaceholders(
          chunk.text
        ),
      })
    );

    console.log("====================================");
    console.log("RETRIEVED CHUNKS");
    console.log("====================================");

    numberedChunks.forEach((chunk) => {
      console.log(
        `[${chunk.id}] ${chunk.filename} | score: ${chunk.score}`
      );

      console.log(
        chunk.text.substring(0, 300)
      );

      console.log("------------------------------------");
    });

    // =====================================================
    // Build Document Context
    // =====================================================

    const context = numberedChunks
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

    // =====================================================
    // RAG Prompt
    // =====================================================

    const prompt = `
You are MindWeave AI, an AI knowledge assistant.

Answer the user's question using ONLY the uploaded
document context below.

IMPORTANT:

- Never use outside knowledge.
- Never guess.
- Never invent missing information.
- Never select an option from a template.
- Never reproduce unresolved template placeholders.
- The document may contain incomplete template text.
- If the exact value is missing, clearly say that it is
  not specified in the uploaded document.
- Use only confirmed information from the document.
- Answer in clear Markdown.
- Keep the answer concise.
- Cite factual statements using [1], [2], [3], etc.
- Do not mention chunks, embeddings, vectors, retrieval,
  similarity search, or RAG internals.

IMPORTANT PLACEHOLDER RULE:

The original document may contain text such as:

[Business/ Business Casual/ Smart Casual/ Casual]

or:

[slacks/ loafers/ blouses/ boots]

These are template placeholders.

They are NOT actual information.

Do NOT choose an option.

Do NOT reproduce them.

If such a placeholder was needed to answer the question,
say:

"The exact value is not specified in the uploaded document."

You can still explain the confirmed rules surrounding it.

For example, if the document says:

"Our company's official dress code is [Business/ Business Casual/ Smart Casual/ Casual].
However, employees who meet clients should conform to a more formal dress code.
Employees should be clean and avoid unprofessional clothes."

Your answer should be similar to:

"### Employee Dress Code

The uploaded handbook does not specify the exact dress-code
category. However, employees who frequently meet clients or
prospects are expected to follow a more formal dress code [1].
Employees are also expected to be clean and avoid
unprofessional clothing [1]."

Do NOT output the placeholder.

Do NOT invent the missing dress-code category.

Previous Conversation:

${history}

Uploaded Document Context:

${context}

Current User Question:

${message}

Answer now.
`;

    // =====================================================
    // Generate AI Response
    // =====================================================

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are MindWeave AI. Answer strictly from the uploaded document context. Never guess, never invent missing values, and never output template placeholders.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0,

        max_tokens: 1024,
      });

    let aiResponse =
      completion.choices[0]?.message?.content ??
      "No response generated.";

    // =====================================================
    // FINAL SAFETY CLEANUP
    // =====================================================

    // Remove any unresolved slash-separated placeholders
    // that the model may still have generated.

    aiResponse = aiResponse
      .replace(
        /\[[^\]]*\/[^\]]*\]/g,
        ""
      )
      .replace(
        /[ \t]{2,}/g,
        " "
      )
      .replace(
        /\n[ \t]+/g,
        "\n"
      )
      .trim();

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

    // =====================================================
    // Return Result
    // =====================================================

    return {
      success: true,

      userMessage: message,

      aiResponse,

      retrievedChunks:
        numberedChunks,

      sources,
    };
  } catch (error) {
    console.error(
      "Groq API Error:",
      error
    );

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