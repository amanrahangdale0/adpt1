// src/hooks/useGoals.ts
import { useState, useEffect } from "react";
import { useLocalStorage } from "./localStorage";
import { generateGoalsOnServer } from "../lib/api/goalsAPI";
import { uploadNotesText } from "../lib/api/notesAPI";
import { useNotifications } from "./useNotifications";

export function useGoals(storageKey = "adpt_goals_v1") {
  const [stored, setStored] = useLocalStorage(storageKey, []);
  const [goals, setGoals] = useState(stored || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { scheduleNotification } = useNotifications();

  useEffect(() => { setGoals(stored || []); }, [stored]);

  async function generate(subjects = [], preferences = {}, stats = {}) {
    setLoading(true); setError(null);
    try {
      const resp = await generateGoalsOnServer(subjects, preferences, stats);
      const g = (resp.goals || []).map(g => ({ ...g, completed: false }));
      setGoals(g);
      setStored(g);
      // schedule notifications for suggested windows (simple heuristic)
      g.forEach((goal, i) => {
        // choose a time today for the suggested window
        const when = pickTimeForWindow(goal.suggestedWindow || "evening", i);
        scheduleNotification({
          id: goal.id,
          title: `Study: ${goal.subject}`,
          body: `${goal.title} — ${goal.minutes} min`,
          when,
        });
      });
      setLoading(false);
      return g;
    } catch (err) {
      setError(err); setLoading(false); throw err;
    }
  }

  function complete(goalId) {
    const updated = goals.map(g => g.id === goalId ? { ...g, completed: true, completedAt: new Date().toISOString() } : g);
    setGoals(updated); setStored(updated);
  }

  function remove(goalId) { const updated = goals.filter(g => g.id !== goalId); setGoals(updated); setStored(updated); }

  function clear() { setGoals([]); setStored([]); }

  return { goals, loading, error, generate, complete, remove, clear, setGoals };
}

// helper: pick time for window
function pickTimeForWindow(windowName, offsetIndex = 0) {
  const now = new Date();
  let hour = 18; // evening
  if (windowName === "morning") hour = 7;
  if (windowName === "afternoon") hour = 14;
  if (windowName === "night") hour = 21;
  // offset by index to avoid clashing in same minute
  const when = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour + offsetIndex, 0, 0);
  // if time passed, pick tomorrow
  if (when.getTime() <= Date.now()) when.setDate(when.getDate() + 1);
  return when;
}
