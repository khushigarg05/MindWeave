import { Router } from "express";
import { search } from "../controllers/search.controller";

const router = Router();

router.post("/", search);

export default router;