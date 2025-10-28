import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/schedule", scheduleRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
