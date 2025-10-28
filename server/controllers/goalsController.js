// server/controllers/goalsController.js
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/goals/generate
 * body: {
 *   subjects: [{ name, topics:[], difficulty:1-5, examDate: "YYYY-MM-DD", weeklyHours }],
 *   preferences: { dailyGoalMinutes, studyWindows: ["morning","evening","night"], sessionLengthMinutes, breakEveryMinutes },
 *   stats: { totalMinutes, perSubject: { name: minutes } }
 * }
 *
 * returns { goals: [ { id, title, subject, minutes, scheduledAt? } ] }
 */
export function generateMiniGoals(req, res) {
  try {
    const { subjects = [], preferences = {}, stats = {} } = req.body;
    if (!Array.isArray(subjects) || subjects.length === 0)
      return res.status(400).json({ error: "Missing subjects array" });

    const dailyGoalMinutes = preferences.dailyGoalMinutes || 30;
    const sessionLength = preferences.sessionLengthMinutes || 30;
    const breakEvery = preferences.breakEveryMinutes || 60;
    const studyWindows = preferences.studyWindows || ["morning", "evening"];

    // compute a priority score for each subject:
    // higher score -> schedule earlier
    // score factors: days until exam, difficulty, hours already studied (we prioritize low-studied subjects), weeklyHours
    const now = new Date();

    function daysUntil(dateStr) {
      if (!dateStr) return 365;
      const d = new Date(dateStr + "T00:00:00");
      const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
      return diff >= 0 ? diff : 0;
    }

    const scored = subjects.map((s) => {
      const days = daysUntil(s.examDate);
      // closeness factor: if exam in fewer days, big weight
      const closeness = 1 / Math.max(1, days);
      const difficulty = (s.difficulty || 3) / 5; // 0.2 - 1
      const studied = (stats.perSubject && stats.perSubject[s.name]) || 0; // minutes
      const studiedFactor = Math.max(0, 1 - studied / Math.max(1, (s.weeklyHours || 3) * 60 * 4)); // less studied => near 1

      // base priority
      const score = (closeness * 3) + (difficulty * 2) + (studiedFactor * 1.5) + ((s.weeklyHours || 0) / 10);
      return { ...s, score, daysUntilExam: days, studiedMinutes: studied };
    });

    // sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Create goals: for each subject create 1..n small goals based on dailyGoalMinutes and sessionLength
    const goals = [];
    for (const subj of scored) {
      // number of sessions recommended today for this subject (cap)
      const sessionsToday = Math.max(1, Math.min(3, Math.round(dailyGoalMinutes / Math.max(15, sessionLength))));
      for (let i = 0; i < sessionsToday; i++) {
        const minutes = sessionLength;
        const title = i === 0
          ? `Quick revision: ${subj.name}${subj.topics?.[0] ? ` — ${subj.topics[0]}` : ""}`
          : `Practice: ${subj.name} (session ${i + 1})`;
        goals.push({
          id: `g-${uuidv4()}`,
          title,
          subject: subj.name,
          minutes,
          difficulty: subj.difficulty || 3,
          examInDays: subj.daysUntilExam,
          suggestedWindow: studyWindows[i % studyWindows.length],
        });
      }
      // add one summarizing/notes goal if user has uploaded notes (front-end will signal)
      goals.push({
        id: `g-${uuidv4()}`,
        title: `Summarize notes / make formula sheet: ${subj.name}`,
        subject: subj.name,
        minutes: Math.max(15, Math.round(sessionLength * 0.8)),
        difficulty: subj.difficulty || 3,
        suggestedWindow: studyWindows[0],
      });
    }

    // trim to a reasonable total number (e.g., 10)
    const trimmed = goals.slice(0, 10);

    return res.json({ goals: trimmed });
  } catch (err) {
    console.error("Goal generation failed:", err);
    return res.status(500).json({ error: "Failed to generate goals", detail: err.message });
  }
}

/**
 * POST /api/notes/extract
 * Accepts { filename, contentBase64, contentType } OR multipart form-data (if you prefer)
 * For simplicity we accept base64 text or plain text files.
 * We'll try to extract text and optionally call AI to summarize.
 */
export async function extractNotesController(req, res) {
  try {
    const { filename, contentBase64, contentType, prompt } = req.body;
    if (!contentBase64 && !req.body.text) {
      return res.status(400).json({ error: "Missing file content" });
    }

    // Simple approach: if contentBase64 present, decode and treat as UTF-8 text
    let rawText = req.body.text || "";
    if (contentBase64) {
      const buff = Buffer.from(contentBase64, "base64");
      rawText = buff.toString("utf-8");
    }

    // If this is likely a PDF or binary, we cannot parse here without a library.
    // For now, return the raw text; frontend can allow user to paste text if parsing fails.
    // Optionally call AI to extract a short summary & list of topics from the notes
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      // Return extracted raw text only, no AI summary
      return res.json({ text: rawText, summary: null });
    }

    // call AI to create a short summary & list of key topics
    const aiPrompt =
      prompt ||
      `You are a study assistant. Extract the key topics and a 4-line study plan from these notes. Return JSON: {"topics":[...],"summary":"...","suggested_tasks":[{ "title":"", "minutes":30}]}\n\nNotes:\n${rawText.slice(0, 30000)}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 600,
      }),
    });

    const data = await response.json();
    // Try to parse assistant text as JSON if possible
    const assistantText = data?.choices?.[0]?.message?.content || "";
    let parsed = null;
    try {
      // Sometimes AI returns JSON block; extract JSON substring
      const jsonStart = assistantText.indexOf("{");
      const jsonEnd = assistantText.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd >= 0) {
        parsed = JSON.parse(assistantText.slice(jsonStart, jsonEnd + 1));
      }
    } catch (e) {
      // ignore parse errors, return assistantText raw
    }

    return res.json({ text: rawText, ai: parsed || { raw: assistantText } });
  } catch (err) {
    console.error("extractNotesController error:", err);
    return res.status(500).json({ error: "Failed to extract notes", detail: err.message });
  }
}
