async function sendMessage() {
  if (!conversationId || loading || !input.trim()) return;

  const userText = input.trim();

  // Add user message and empty AI message
  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: userText,
    },
    {
      role: "ai",
      text: "",
    },
  ]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch(
      "http://localhost:5000/chat/stream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          conversationId,
        }),
      }
    );

    if (!res.ok || !res.body) {
      throw new Error("Failed to start stream");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let aiText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const events = chunk
        .split("\n")
        .filter((line) => line.startsWith("data:"));

      for (const event of events) {
        const payload = event.replace("data:", "").trim();

        if (payload === "done") continue;

        try {
          const parsed = JSON.parse(payload);

          aiText += parsed.token;

          setMessages((prev) => {
            const copy = [...prev];

            copy[copy.length - 1] = {
              role: "ai",
              text: aiText,
            };

            return copy;
          });
        } catch {
          // Ignore malformed chunks
        }
      }
    }

    onConversationUpdated();
  } catch (error) {
    console.error(error);

    setMessages((prev) => {
      const copy = [...prev];

      copy[copy.length - 1] = {
        role: "ai",
        text: "Something went wrong. Please try again.",
      };

      return copy;
    });
  } finally {
    setLoading(false);
    inputRef.current?.focus();
  }
}