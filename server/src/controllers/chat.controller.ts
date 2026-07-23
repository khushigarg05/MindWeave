import { Request, Response } from "express";
import { generateResponse } from "../services/ai/ai.service";
import { successResponse, errorResponse } from "../utils/response";

export async function chat(req: Request, res: Response) {
  try {
    const { message } = req.body;

    const response = await generateResponse(message);

    return res.status(200).json(successResponse(response));
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json(
      errorResponse("Internal Server Error")
    );
  }
}