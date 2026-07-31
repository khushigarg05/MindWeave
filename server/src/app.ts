import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes";
import conversationRoutes from "./routes/conversation.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/conversation", conversationRoutes);
app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 MindWeave Backend is running",
  });
});

export default app;