export function buildConversationContext(
  messages: { role: string; content: string }[],
  limit = 6
) {
  return messages
    .slice(-limit)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");
}