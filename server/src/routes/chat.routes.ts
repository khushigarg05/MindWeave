import { Router } from "express";
import { chat } from "../controllers/chat.controller";
import { validateChat } from "../middleware/validateChat";

const router = Router();

router.post("/chat", validateChat, chat);

export default router;