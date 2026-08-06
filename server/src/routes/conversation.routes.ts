import { Router } from "express";

import {
  createConversation,
  getConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:id", getConversation);

// Delete Conversation
router.delete("/:id", deleteConversation);

export default router;