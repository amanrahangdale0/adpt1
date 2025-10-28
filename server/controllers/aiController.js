import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: "uploads/" });

export const uploadMiddleware = upload.single("file");

/**
 * 1️⃣ Base Chat Proxy (Already Present)
 */
export async function handleAIChat(req, res) {
  try {
    const { messages, max_tokens } = req.body;
    if (!messages) return res.status(400).json({ error: "Missing messages" });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: max_tokens ?? 800 }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("AI proxy error:", err);
    return res.status(500).json({ error: "AI proxy failed", detail: err.message });
  }
}

/**
 * 2️⃣ Notes Upload + Summarization
 */
export async function handleNotesUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, "../../", req.file.path);
    const content = fs.readFileSync(filePath, "utf-8");

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const summaryPrompt = [
      {
        role: "system",
        content: "You are an AI tutor. Summarize and extract key study points from the provided text.",
      },
      {
        role: "user",
        content: `Here are the notes:\n\n${content}`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: summaryPrompt, max_tokens: 800 }),
    });

    const data = await response.json();

    fs.unlinkSync(filePath); // cleanup
    res.json({ summary: data.choices[0].message.content });
  } catch (err) {
    console.error("Notes processing error:", err);
    return res.status(500).json({ error: "Failed to process notes", detail: err.message });
  }
}

/**
 * 3️⃣ Generate Mini Study Goals
 */
export async function handleGoalGeneration(req, res) {
  try {
    const { topics, examDate } = req.body;
    if (!topics || !examDate) return res.status(400).json({ error: "Missing data" });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const messages = [
      {
        role: "system",
        content: "You are a goal planner AI that creates small, time-bound study goals based on topics and deadlines.",
      },
      {
        role: "user",
        content: `Exam date: ${examDate}\nTopics: ${topics.join(", ")}\nCreate small daily goals with estimated durations.`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ model: "gpt-4o-mini", messages }),
    });

    const data = await response.json();
    res.json({ goals: data.choices[0].message.content });
  } catch (err) {
    console.error("Goal generation error:", err);
    return res.status(500).json({ error: "Goal generation failed", detail: err.message });
  }
}
