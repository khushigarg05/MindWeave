import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MindWeave API 🚀",
  });
});

// API Routes
app.use("/", healthRoutes);
app.use("/", chatRoutes);

export default app;