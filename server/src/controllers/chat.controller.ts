import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import { generateResponse } from "../services/ai/ai.service";

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

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const response = await generateResponse(message);

    // Auto rename first conversation
    if (conversation.title === "New Chat") {
      conversation.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;
    }

    conversation.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: response.aiResponse,
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

        sources: response.sources,

        retrievedChunks: response.retrievedChunks,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ===================================================
// STREAMING ENDPOINT
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

    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const response =
      await generateResponse(message);

    if (conversation.title === "New Chat") {
      conversation.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;
    }

    conversation.messages.push(
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: response.aiResponse,
      }
    );

    conversation.updatedAt = new Date();

    await conversation.save();

    // SSE Headers
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

    const words =
      response.aiResponse.split(" ");

    for (const word of words) {
      res.write(
        `data: ${JSON.stringify({
          token: word + " ",
        })}\n\n`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 35)
      );
    }

    // Send sources after streaming finishes
    res.write(
      `event: sources\n`
    );

    res.write(
      `data: ${JSON.stringify(
        response.sources
      )}\n\n`
    );

    res.write("event: end\n");
    res.write("data: done\n\n");

    res.end();

  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    res.end();
  }
}

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