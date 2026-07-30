import { Router } from "express";
import {
  chat,
  history,
  streamChat,
} from "../controllers/chat.controller";

const router = Router();

// Standard chat endpoint
router.post("/", chat);

// Streaming (ChatGPT-style typing)
router.post("/stream", streamChat);

// Conversation history
router.get("/history", history);

export default router;