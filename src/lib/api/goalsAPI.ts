// src/lib/api/goalsAPI.ts
export async function generateGoalsOnServer(subjects = [], preferences = { dailyGoalMinutes: 30 }) {
  const base = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const res = await fetch(`${base}/api/goals/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects, preferences }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Goals API Error: " + txt);
  }
  return res.json(); // { goals: [...] }
}
