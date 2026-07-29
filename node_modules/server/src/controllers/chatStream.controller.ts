import { Request, Response } from "express";

export async function streamChat(
  req: Request,
  res: Response
) {
  const { message } = req.body;

  res.setHeader(
    "Content-Type",
    "text/event-stream"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );

  res.flushHeaders();

  const answer =
    "MindWeave AI is now streaming responses just like ChatGPT.";

  for (const letter of answer) {
    res.write(`data:${letter}\n\n`);

    await new Promise((r) =>
      setTimeout(r, 25)
    );
  }

  res.write("data:[DONE]\n\n");

  res.end();
}