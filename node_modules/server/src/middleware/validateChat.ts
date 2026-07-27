import { Request, Response, NextFunction } from "express";

export function validateChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Message is required",
    });
  }

  next();
}