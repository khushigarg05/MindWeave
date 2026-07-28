import { Router } from "express";

import {
  createConversation,
  getConversation,
  getConversations,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:id", getConversation);

export default router;