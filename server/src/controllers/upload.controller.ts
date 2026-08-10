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
    console.log("File:", req.file.originalname);
    console.log("Characters:", text.length);

    // ===========================
    // Validate extracted text
    // ===========================

    if (!text || text.trim().length === 0) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF",
      });
    }

    // ===========================
    // Split into Chunks
    // ===========================

    const chunks = await splitIntoChunks(text);

    console.log("====================================");
    console.log("TEXT CHUNKING");
    console.log("====================================");
    console.log("Total chunks:", chunks.length);

    if (chunks.length === 0) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "No text chunks were generated from PDF",
      });
    }

    // ===========================
    // Store Embeddings
    // ===========================

    console.log("====================================");
    console.log("GENERATING EMBEDDINGS & STORING");
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
    console.log("====================================");
    console.log("Document ID:", document._id);

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
    console.error("====================================");
    console.error("UPLOAD ERROR");
    console.error("====================================");
    console.error(err);

    // ===========================
    // Remove uploaded file
    // ===========================

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error(
          "Failed to remove uploaded file:",
          deleteError
        );
      }
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
    console.error(
      "Get Documents Error:",
      err
    );

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

    // ===========================
    // Find document
    // ===========================

    const document =
      await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    console.log("====================================");
    console.log("DELETING DOCUMENT");
    console.log("====================================");
    console.log(
      "Filename:",
      document.originalName
    );

    // ===========================
    // Delete vectors from Qdrant
    // ===========================

    console.log(
      "Deleting vectors from Qdrant..."
    );

    await deleteVectorsByFilename(
      document.originalName
    );

    console.log(
      "Qdrant vectors deleted"
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

      console.log(
        "PDF file deleted:",
        filePath
      );
    }

    // ===========================
    // Delete Mongo document
    // ===========================

    await Document.findByIdAndDelete(id);

    console.log(
      "MongoDB document deleted"
    );

    console.log("====================================");

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error(
      "Delete Document Error:",
      err
    );

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