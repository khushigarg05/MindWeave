const API_URL = "http://localhost:5000";

export async function sendMessage(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  return data;
}

export async function getHistory() {
  const response = await fetch(`${API_URL}/chat/history`);
  return response.json();
}