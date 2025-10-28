// src/hooks/useProgress.ts
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./localStorage";

export type ProgressStats = {
  xp: number;
  streak: number;
  todayMinutes: number;
  weeklyGoal: number;
  lastStudyDate: string;
  totalStudyHours: number;
  completedSessions: number;
};

const DEFAULT_STATS: ProgressStats = {
  xp: 0,
  streak: 0,
  todayMinutes: 0,
  weeklyGoal: 300, // 5 hours per week default
  lastStudyDate: "",
  totalStudyHours: 0,
  completedSessions: 0,
};

export function useProgress() {
  const [stats, setStats] = useLocalStorage<ProgressStats>("adpt_progress", DEFAULT_STATS);

  // Check and update streak on load
  useEffect(() => {
    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const today = new Date();
      const daysDiff = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Reset streak if more than 1 day passed
      if (daysDiff > 1) {
        setStats({ ...stats, streak: 0, todayMinutes: 0 });
      }
      // Reset today's minutes if it's a new day
      else if (daysDiff === 1) {
        setStats({ ...stats, todayMinutes: 0 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addXP = useCallback(
    (amount: number) => {
      setStats((prev) => ({
        ...prev,
        xp: prev.xp + amount,
      }));
    },
    [setStats]
  );

  const addStudyTime = useCallback(
    (minutes: number) => {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = stats.lastStudyDate.split("T")[0];
      const isNewDay = today !== lastDate;

      setStats((prev) => ({
        ...prev,
        todayMinutes: isNewDay ? minutes : prev.todayMinutes + minutes,
        totalStudyHours: prev.totalStudyHours + minutes / 60,
        streak: isNewDay ? prev.streak + 1 : prev.streak,
        lastStudyDate: new Date().toISOString(),
        xp: prev.xp + Math.floor(minutes * 2), // 2 XP per minute
      }));
    },
    [stats.lastStudyDate, setStats]
  );

  const completeSession = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      xp: prev.xp + 50, // Bonus XP for completing a session
    }));
  }, [setStats]);

  const updateWeeklyGoal = useCallback(
    (minutes: number) => {
      setStats((prev) => ({
        ...prev,
        weeklyGoal: minutes,
      }));
    },
    [setStats]
  );

  const resetProgress = useCallback(() => {
    setStats(DEFAULT_STATS);
  }, [setStats]);

  return {
    stats,
    addXP,
    addStudyTime,
    completeSession,
    updateWeeklyGoal,
    resetProgress,
  };
}
