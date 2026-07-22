export async function generateResponse(message: string) {
  return {
    success: true,
    userMessage: message,
    aiResponse:
      "Hello! I'm MindWeave AI. This is a placeholder response.",
  };
}