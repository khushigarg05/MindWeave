import { Request, Response } from "express";
import { extractPdfText } from "../services/rag/pdf.service";
import { splitIntoChunks } from "../services/rag/chunk.service";
import { generateEmbedding } from "../services/rag/embedding.service";

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

    // ===========================
    // Extract text from PDF
    // ===========================
    const text = await extractPdfText(req.file.path);

    console.log("====================================");
    console.log("PDF TEXT EXTRACTED");
    console.log("====================================");
    console.log(`Characters: ${text.length}`);

    // ===========================
    // Split into chunks
    // ===========================
    const chunks = await splitIntoChunks(text);

    console.log("====================================");
    console.log(`TOTAL CHUNKS: ${chunks.length}`);
    console.log("====================================");

    chunks.forEach((chunk, index) => {
      console.log(`\nChunk ${index + 1}`);
      console.log("------------------------------------");
      console.log(chunk.pageContent.substring(0, 150));
    });

    // ===========================
    // Generate embedding for first chunk
    // ===========================
    console.log("====================================");
    console.log("GENERATING EMBEDDING...");
    console.log("====================================");

    const embedding = await generateEmbedding(
      chunks[0].pageContent
    );

    console.log(
      "Embedding dimension:",
      embedding.length
    );

    console.log(
      "First 10 values:",
      embedding.slice(0, 10)
    );

    // ===========================
    // Response
    // ===========================
    return res.json({
      success: true,
      message: "PDF processed successfully",

      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },

      characters: text.length,
      totalChunks: chunks.length,

      embeddingDimension: embedding.length,

      preview: chunks[0].pageContent.substring(0, 500),
    });

  } catch (err) {
    console.error("Upload Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to process PDF",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}