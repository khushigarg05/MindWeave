const API = "http://localhost:5000";

export async function createConversation() {
  const res = await fetch(`${API}/conversation`, {
    method: "POST",
  });

  return res.json();
}

export async function getConversations() {
  const res = await fetch(`${API}/conversation`);

  return res.json();
}

export async function chat(
  conversationId: string,
  message: string
) {
  const res = await fetch(`${API}/chat`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      conversationId,
      message,
    }),
  });

  return res.json();
}

export async function uploadPDF(file: File) {
  const form = new FormData();

  form.append("file", file);

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    body: form,
  });

  return res.json();
}