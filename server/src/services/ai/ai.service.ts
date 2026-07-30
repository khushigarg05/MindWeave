import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResponse(message: string) {
  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are MindWeave AI, a helpful AI assistant. Give clear and detailed answers.",
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
        completion.choices[0]?.message?.content ||
        "No response generated.",
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
    };
  }
}