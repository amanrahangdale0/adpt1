// src/lib/hooks/useNotifications.ts
import { useRef, useEffect } from "react";

/**
 * useNotifications
 * - request permission
 * - scheduleNotification({title, body, when: Date}) returns an id
 * - cancelNotification(id)
 *
 * Note: uses setTimeout while tab is open. For persistent OS notifications when closed, you'd need Service Workers (Push API).
 */
export function useNotifications() {
  const timersRef = useRef({});

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    return () => {
      // clear pending timers
      Object.values(timersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  function scheduleNotification({ id, title, body, when }) {
    const ms = when - Date.now();
    if (ms <= 0) {
      // show immediately
      if (Notification.permission === "granted") new Notification(title, { body });
      return null;
    }
    const timer = setTimeout(() => {
      if (Notification.permission === "granted") new Notification(title, { body });
      // also optionally play beep
      const audio = new Audio("/notification-sound.mp3"); // add asset or skip
      audio?.play?.().catch(() => {});
      delete timersRef.current[id];
    }, ms);
    timersRef.current[id] = timer;
    return id;
  }

  function cancelNotification(id) {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }

  return { scheduleNotification, cancelNotification };
}
