import { Router } from "express";
import { getDocuments } from "../controllers/document.controller";

const router = Router();

router.get("/", getDocuments);

export default router;