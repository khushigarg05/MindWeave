import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import Document from "../models/document.model";

import { extractPdfText } from "../services/rag/pdf.service";
import { splitIntoChunks } from "../services/rag/chunk.service";
import {
  storeChunks,
  deleteVectorsByFilename,
} from "../services/rag/vector.service";

// =======================================================
// Upload Document
// =======================================================

export async function uploadDocument(
  req: Request,
  res: Response
) {
  try {
    // ===========================
    // Check file
    // ===========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ===========================
    // Extract PDF Text
    // ===========================

    const text = await extractPdfText(req.file.path);

    console.log("====================================");
    console.log("PDF TEXT EXTRACTED");
    console.log("====================================");
    console.log(`Characters: ${text.length}`);

    // ===========================
    // Split into Chunks
    // ===========================

    const chunks = await splitIntoChunks(text);

    console.log("====================================");
    console.log(`TOTAL CHUNKS: ${chunks.length}`);
    console.log("====================================");

    // ===========================
    // Store Embeddings
    // ===========================

    console.log("====================================");
    console.log("GENERATING EMBEDDINGS & STORING...");
    console.log("====================================");

    await storeChunks(
      chunks,
      req.file.originalname
    );

    console.log("====================================");
    console.log("ALL CHUNKS STORED SUCCESSFULLY");
    console.log("====================================");

    // ===========================
    // Save Metadata
    // ===========================

    const document = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      pages: 0,
    });

    console.log("====================================");
    console.log("DOCUMENT METADATA SAVED");
    console.log(document._id);
    console.log("====================================");

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      message: "PDF uploaded and indexed successfully",

      documentId: document._id,

      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        pages: document.pages,
      },

      characters: text.length,
      totalChunks: chunks.length,
      storedChunks: chunks.length,

      preview:
        chunks.length > 0
          ? chunks[0].pageContent.substring(0, 500)
          : "",
    });
  } catch (err) {
    console.error("Upload Error:", err);

    // Remove uploaded file if processing fails
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process PDF",
      error:
        err instanceof Error
          ? err.message
          : "Unknown error",
    });
  }
}

// =======================================================
// Get All Documents
// =======================================================

export async function getDocuments(
  req: Request,
  res: Response
) {
  try {
    const documents = await Document.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: documents,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
}

// =======================================================
// Delete Document
// =======================================================

export async function deleteDocument(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ===========================
    // Delete vectors from Qdrant
    // ===========================

    await deleteVectorsByFilename(
      document.originalName
    );

    // ===========================
    // Delete PDF from uploads
    // ===========================

    const filePath = path.join(
      process.cwd(),
      "uploads",
      document.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ===========================
    // Delete Mongo document
    // ===========================

    await Document.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error:
        err instanceof Error
          ? err.message
          : "Unknown error",
    });
  }
}