import { Request, Response } from "express";
import { generateResponse } from "../services/ai/ai.service";

export async function chat(req: Request, res: Response) {
  try {
    const { message } = req.body;

    const response = await generateResponse(message);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}