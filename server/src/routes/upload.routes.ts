import { Router } from "express";
import { upload } from "../utils/multer";
import { uploadDocument } from "../controllers/upload.controller";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  uploadDocument
);

export default router;