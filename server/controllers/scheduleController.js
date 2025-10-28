import fetch from "node-fetch";

/**
 * POST /api/schedule
 * Request body:
 * {
 *   goals: string[],
 *   studyPrefs: {
 *     studyType: "continuous" | "breaks",
 *     studyTime: "morning" | "evening" | "night",
 *     hoursPerDay: number,
 *     subjectDifficulty: Record<string, "easy" | "medium" | "hard">,
 *     examDeadlines: Record<string, string> // e.g. { "Math": "2025-11-10" }
 *   }
 * }
 */
export async function generateAISchedule(req, res) {
  try {
    const { goals, studyPrefs } = req.body;
    if (!goals?.length) return res.status(400).json({ error: "Missing study goals" });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });

    // 🧠 Smart guiding prompt
    const guidingPrompt = `
You are an expert AI study planner. 
Your task is to create a personalized study schedule for a student based on their preferences and upcoming exams.

Analyze and plan according to these rules:
1. Hard subjects should appear more frequently but with shorter sessions.
2. Easy subjects should appear fewer times but for longer sessions.
3. Morning learners → focus heavy topics early.
4. Evening/night learners → keep focus subjects after warmup sessions.
5. If studyType = "continuous", group 2-3 goals together.
6. If studyType = "breaks", insert short 10-15 min rest intervals.
7. Prioritize subjects by how soon their exams are.

Return the output as structured JSON:
{
  "sessions": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "duration": "X hours",
      "topic": "Goal title",
      "subject": "Subject name"
    }
  ],
  "summary": "A short motivational line."
}
`;

    const messages = [
      { role: "system", content: guidingPrompt },
      {
        role: "user",
        content: `
Here are the student's current notes-based study goals:
${goals.join("\n")}

Study preferences:
${JSON.stringify(studyPrefs, null, 2)}

Generate a study schedule for the next 7 days. Use realistic session timings and durations.
        `,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    // Try to parse JSON output safely
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.warn("AI response was not JSON, fallback applied.");
      parsed = { sessions: [], summary: content };
    }

    return res.json(parsed);
  } catch (err) {
    console.error("AI schedule generation error:", err);
    return res.status(500).json({ error: "AI schedule generation failed", detail: err.message });
  }
}
