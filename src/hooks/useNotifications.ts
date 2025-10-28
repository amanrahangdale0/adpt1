// src/hooks/useNotifications.ts
import { useCallback } from "react";
import { toast } from "sonner";

export const useNotifications = () => {
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }, []);

  const sendNotification = useCallback((title: string, body?: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon.png" });
    }
    // Fallback to toast notification
    toast(title, { description: body });
  }, []);

  const scheduleNotification = useCallback((notification: { id: string; title: string; body: string; when: Date }) => {
    const delay = notification.when.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        sendNotification(notification.title, notification.body);
      }, delay);
    }
  }, [sendNotification]);

  return { requestPermission, sendNotification, scheduleNotification };
};
