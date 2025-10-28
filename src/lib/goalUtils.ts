import { loadGoalsLocal, saveGoalsLocal } from "./localCache";

export function markGoalCompleted(goalId) {
  const goals = loadGoalsLocal();
  const idx = goals.findIndex(g => g.id === goalId);
  if (idx === -1) return false;
  goals[idx].completed = true;
  goals[idx].completedAt = new Date().toISOString();
  saveGoalsLocal(goals);
  return true;
}
