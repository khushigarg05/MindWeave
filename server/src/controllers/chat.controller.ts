import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import { generateResponse } from "../services/ai/ai.service";
import { buildConversationContext } from "../services/chat/history.service";

// ===================================================
// NORMAL CHAT
// ===================================================

export async function chat(
  req: Request,
  res: Response
) {
  try {
    const { message, conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // ===========================
    // Build conversation history
    // ===========================

    const history = buildConversationContext(
      conversation.messages
    );

    // ===========================
    // Generate AI Response
    // ===========================

    const response = await generateResponse(
      message,
      history
    );

    // ===========================
    // Auto Rename
    // ===========================

    if (conversation.title === "New Chat") {
      conversation.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;
    }

    // ===========================
    // Save Conversation
    // ===========================

    conversation.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: response.aiResponse,
        sources: response.sources ?? [],
        retrievedChunks:
          response.retrievedChunks ?? [],
      }
    );

    conversation.updatedAt = new Date();

    await conversation.save();

    return res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        title: conversation.title,
        aiResponse: response.aiResponse,
        sources: response.sources ?? [],
        retrievedChunks:
          response.retrievedChunks ?? [],
      },
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ===================================================
// STREAMING CHAT
// ===================================================

export async function streamChat(
  req: Request,
  res: Response
) {
  try {
    const { message, conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // ===========================
    // Build History
    // ===========================

    const history =
      buildConversationContext(
        conversation.messages
      );

    // ===========================
    // Generate AI
    // ===========================

    const response =
      await generateResponse(
        message,
        history
      );

    // ===========================
    // Rename First Chat
    // ===========================

    if (conversation.title === "New Chat") {
      conversation.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;
    }

    // ===========================
    // Save Conversation
    // ===========================

    conversation.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: response.aiResponse,
        sources: response.sources ?? [],
        retrievedChunks:
          response.retrievedChunks ?? [],
      }
    );

    conversation.updatedAt = new Date();

    await conversation.save();

    // ===========================
    // SSE Headers
    // ===========================

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.flushHeaders();

    // ===========================
    // Stream AI Tokens
    // ===========================

    const words =
      response.aiResponse.split(" ");

    for (const word of words) {
      res.write(
        `data: ${JSON.stringify({
          token: word + " ",
        })}\n\n`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 25)
      );
    }

    // ===========================
    // Sources
    // ===========================

    res.write("event: sources\n");
    res.write(
      `data: ${JSON.stringify(
        response.sources ?? []
      )}\n\n`
    );

    // ===========================
    // Retrieved Chunks
    // ===========================

    res.write("event: chunks\n");
    res.write(
      `data: ${JSON.stringify(
        response.retrievedChunks ?? []
      )}\n\n`
    );

    // ===========================
    // Stream End
    // ===========================

    res.write("event: end\n");
    res.write("data: done\n\n");

    res.end();
  } catch (error) {
    console.error(
      "Streaming Error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    res.end();
  }
}

// ===================================================
// Conversation History
// ===================================================

export async function history(
  req: Request,
  res: Response
) {
  try {
    const conversations =
      await Conversation.find().sort({
        updatedAt: -1,
      });

    return res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}