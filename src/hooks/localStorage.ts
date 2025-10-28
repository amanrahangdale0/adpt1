// src/hooks/localStorage.ts
import { useState, useEffect } from "react";
import { localCache } from "../lib/storage";

/**
 * useLocalStorage(key, initialValue)
 * returns [value, setValue, remove]
 */
export function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(() => {
    const saved = localCache.get(key, undefined);
    return saved === undefined || saved === null ? initialValue : saved;
  });

  useEffect(() => {
    try {
      if (state === undefined || state === null) {
        localCache.remove(key);
      } else {
        localCache.set(key, state);
      }
    } catch (e) {
      console.error("useLocalStorage effect error", e);
    }
  }, [key, state]);

  const remove = () => {
    setState(null);
    localCache.remove(key);
  };

  return [state, setState, remove];
}
