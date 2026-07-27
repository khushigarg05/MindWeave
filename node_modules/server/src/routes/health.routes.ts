import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MindWeave API",
    version: "1.0.0",
  });
});

export default router;