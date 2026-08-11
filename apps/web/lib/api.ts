const API_URL = "http://localhost:5000";

// =====================================================
// Create Conversation
// =====================================================

export async function createConversation() {
  const response = await fetch(
    `${API_URL}/conversation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create conversation"
    );
  }

  return response.json();
}

// =====================================================
// Send Streaming Chat Message
// =====================================================

export async function streamMessage(
  message: string,
  conversationId: string
) {
  const response = await fetch(
    `${API_URL}/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to stream message: ${response.status}`
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming response not available"
    );
  }

  return response;
}

// =====================================================
// Send Normal Chat Message
// =====================================================

export async function sendMessage(
  message: string,
  conversationId: string
) {
  const response = await fetch(
    `${API_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to send message"
    );
  }

  return response.json();
}

// =====================================================
// Get All Conversations
// =====================================================

export async function getConversations() {
  const response = await fetch(
    `${API_URL}/conversation`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load conversations"
    );
  }

  return response.json();
}

// =====================================================
// Get Single Conversation
// =====================================================

export async function getConversation(
  conversationId: string
) {
  const response = await fetch(
    `${API_URL}/conversation/${conversationId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load conversation"
    );
  }

  return response.json();
}

// =====================================================
// Delete Conversation
// =====================================================

export async function deleteConversation(
  conversationId: string
) {
  const response = await fetch(
    `${API_URL}/conversation/${conversationId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete conversation"
    );
  }

  return response.json();
}