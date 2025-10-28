// src/lib/storage.ts

// Safely access localStorage and sessionStorage (avoid SSR crash)
const isBrowser = typeof window !== "undefined";

export const localCache = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    if (!isBrowser) return defaultValue;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (err) {
      console.error("LocalCache get error:", err);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("LocalCache set error:", err);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser) return;
    localStorage.clear();
  },
};

export const sessionCache = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    if (!isBrowser) return defaultValue;
    try {
      const value = sessionStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (err) {
      console.error("SessionCache get error:", err);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("SessionCache set error:", err);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    sessionStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser) return;
    sessionStorage.clear();
  },
};
