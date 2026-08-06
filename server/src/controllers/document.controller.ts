import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import Document from "../models/document.model";
import { deleteVectorsByFilename } from "../services/rag/vector.service";

export async function getDocuments(
  req: Request,
  res: Response
) {
  try {
    const docs = await Document.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to load documents",
    });
  }
}

export async function deleteDocument(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete vectors from Qdrant
    await deleteVectorsByFilename(doc.originalName);

    // Delete uploaded file
    const filePath = path.join(
      process.cwd(),
      "uploads",
      doc.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
}