import { Request, Response } from "express";
import Conversation from "../models/conversation.model";

export async function createConversation(
  req: Request,
  res: Response
) {
  try {
    const conversation = await Conversation.create({
      title: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
}

export async function getConversations(
  req: Request,
  res: Response
) {
  try {
    const conversations = await Conversation.find().sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}

export async function getConversation(
  req: Request,
  res: Response
) {
  try {
    const conversation = await Conversation.findById(
      req.params.id
    );

    res.json({
      success: true,
      data: conversation,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}