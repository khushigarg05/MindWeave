import { Request, Response } from "express";
import { generateResponse } from "../services/ai/ai.service";

export async function chat(req: Request, res: Response) {
  try {
    const { message } = req.body;

    // Validation
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const response = await generateResponse(message);

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}