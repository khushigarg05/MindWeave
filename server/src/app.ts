import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import conversationRoutes from "./routes/conversation.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/conversation", conversationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 MindWeave Backend is running",
  });
});

app.use("/chat", chatRoutes);

export default app;