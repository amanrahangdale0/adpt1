import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

// 🧠 Simple route to test backend
app.get("/", (req, res) => {
  res.send("ADPT Backend Running 🚀");
});

// 🔑 AI API endpoint (using user’s unsecured API key)
app.post("/api/chat", async (req, res) => {
  try {
    const { userPrompt, apiKey } = req.body;

    if (!userPrompt || !apiKey) {
      return res.status(400).json({ error: "Missing prompt or API key." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
