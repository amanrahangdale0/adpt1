// src/lib/hooks/useStudyTimer.ts
import { useState, useEffect } from "react";
import { localCache } from "../storage";

const SESSION_KEY = "adpt_session_v1";
const STATS_KEY = "adpt_stats_v1";

export function useStudyTimer() {
  const [running, setRunning] = useState(!!localCache.get(SESSION_KEY, null));
  const [startAt, setStartAt] = useState(localCache.get(SESSION_KEY)?.startAt || null);

  useEffect(() => {
    return () => { /* cleanup if needed */ };
  }, []);

  function start(subject = "general") {
    const payload = { startAt: Date.now(), subject };
    localCache.set(SESSION_KEY, payload);
    setStartAt(payload.startAt);
    setRunning(true);
    return payload;
  }

  function stop() {
    const session = localCache.get(SESSION_KEY, null);
    if (!session) return 0;
    const minutes = Math.round((Date.now() - session.startAt) / 60000);
    localCache.remove(SESSION_KEY);

    // update stats
    const stats = localCache.get(STATS_KEY, { totalMinutes: 0, perSubject: {} });
    stats.totalMinutes = (stats.totalMinutes || 0) + minutes;
    stats.perSubject = stats.perSubject || {};
    stats.perSubject[session.subject] = (stats.perSubject[session.subject] || 0) + minutes;
    localCache.set(STATS_KEY, stats);

    setRunning(false);
    setStartAt(null);
    return minutes;
  }

  function getStats() {
    return localCache.get(STATS_KEY, { totalMinutes: 0, perSubject: {} });
  }

  return { running, startAt, start, stop, getStats };
}
