import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import { generateResponse } from "../services/ai/ai.service";

export async function chat(
  req: Request,
  res: Response
) {
  try {
    const {
      message,
      conversationId,
    } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID required",
      });
    }

    // Find conversation
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

    // Generate AI response
    const response =
      await generateResponse(message);

    // Rename chat using the first user message
    if (conversation.title === "New Chat") {
      conversation.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;
    }

    // Save messages
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

    await conversation.save();

    res.json({
      success: true,
      data: {
        aiResponse: response.aiResponse,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}