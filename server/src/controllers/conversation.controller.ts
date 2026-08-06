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
// =======================================================
// Delete Conversation
// =======================================================

export async function deleteConversation(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const conversation =
      await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await Conversation.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
}