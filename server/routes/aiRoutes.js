import express from "express";
import {
  handleAIChat,
  handleNotesUpload,
  handleGoalGeneration,
  uploadMiddleware,
} from "../controllers/aiController.js";

const router = express.Router();

// API status check
router.get("/status", (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here";
  res.json({ 
    status: "ok", 
    hasApiKey,
    message: hasApiKey ? "API key configured" : "API key not configured"
  });
});

// Existing AI chat route
router.post("/chat", handleAIChat);

// New: File upload + summarization
router.post("/upload", uploadMiddleware, handleNotesUpload);

// New: Mini goal generation
router.post("/goals", handleGoalGeneration);

export default router;
