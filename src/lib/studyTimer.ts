const SESSION_KEY = "adpt_session_v1";
const STATS_KEY = "adpt_stats_v1";

export function startStudySession(subject) {
  const obj = { startAt: Date.now(), subject };
  localStorage.setItem(SESSION_KEY, JSON.stringify(obj));
}
export function stopStudySession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return 0;
  const { startAt, subject } = JSON.parse(raw);
  const minutes = Math.round((Date.now() - startAt) / 60000);
  localStorage.removeItem(SESSION_KEY);

  const stats = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
  stats.totalMinutes = (stats.totalMinutes || 0) + minutes;
  stats.perSubject = stats.perSubject || {};
  stats.perSubject[subject] = (stats.perSubject[subject] || 0) + minutes;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return minutes;
}
export function getStats(){ return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); }
