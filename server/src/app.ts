import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MindWeave API 🚀",
  });
});

app.use("/", healthRoutes);

export default app;