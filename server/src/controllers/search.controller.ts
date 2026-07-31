import { Request, Response } from "express";
import { searchRelevantChunks } from "../services/rag/search.service";

export async function search(req: Request, res: Response) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const chunks = await searchRelevantChunks(query);

    return res.json({
      success: true,
      query,
      matches: chunks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
}