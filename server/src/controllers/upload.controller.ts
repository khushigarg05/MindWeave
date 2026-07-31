import { Request, Response } from "express";
import { extractPdfText } from "../services/rag/pdf.service";

export async function uploadDocument(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Extract text from uploaded PDF
    const text = await extractPdfText(req.file.path);

    console.log("====================================");
    console.log("PDF TEXT EXTRACTED");
    console.log("====================================");
    console.log(text);

    return res.json({
      success: true,
      message: "PDF uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
      characters: text.length,
      preview: text.substring(0, 1000),
    });
  } catch (err) {
    console.error("Upload Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to process PDF",
    });
  }
}