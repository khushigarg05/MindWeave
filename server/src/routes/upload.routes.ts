import { Router } from "express";
import { upload } from "../utils/multer";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/upload.controller";

const router = Router();

// ========================================
// Upload PDF
// POST /upload
// ========================================

router.post(
  "/",
  upload.single("file"),
  uploadDocument
);

// ========================================
// Get Uploaded Documents
// GET /upload/documents
// ========================================

router.get(
  "/documents",
  getDocuments
);

// ========================================
// Delete Document
// DELETE /upload/documents/:id
// ========================================

router.delete(
  "/documents/:id",
  deleteDocument
);

export default router;