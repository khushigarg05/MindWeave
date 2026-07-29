import { Router } from "express";
import {
  chat,
  history,
  streamChat,
} from "../controllers/chat.controller";

const router = Router();

// Normal chat
router.post("/", chat);

// Streaming chat
router.post("/stream", streamChat);

// Chat history
router.get("/history", history);

export default router;