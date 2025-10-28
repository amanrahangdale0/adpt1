// src/hooks/useChat.ts
import { useState, useEffect } from "react";
import { useLocalStorage } from "./localStorage";
import { sendChatToServer } from "../lib/api/chatAPI";

export function useChat(storageKey = "adpt_chat_v1") {
  const [cached, setCached] = useLocalStorage(storageKey, []);
  const [messages, setMessages] = useState(cached || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // keep local state and cached in sync
    if (Array.isArray(cached) && JSON.stringify(cached) !== JSON.stringify(messages)) {
      setMessages(cached || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // send user message, call server, append assistant msg
  async function sendMessage(userText) {
    const userMsg = { role: "user", content: userText, ts: Date.now() };
    const optimistic = [...messages, userMsg];
    setMessages(optimistic);
    setCached(optimistic);
    setLoading(true);
    setError(null);
    try {
      // server expects array of messages in our server implementation
      const res = await sendChatToServer(optimistic);
      // server might return OpenAI response object; try to extract assistant text:
      const assistantText =
        res?.choices?.[0]?.message?.content ??
        res?.reply ??
        (typeof res === "string" ? res : JSON.stringify(res).slice(0, 100));
      const assistantMsg = { role: "assistant", content: assistantText, ts: Date.now() };
      const updated = [...optimistic, assistantMsg];
      setMessages(updated);
      setCached(updated);
      setLoading(false);
      return assistantMsg;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("useChat.sendMessage error", err);
      throw err;
    }
  }

  function clearMessages() {
    setMessages([]);
    setCached([]);
  }

  return { messages, loading, error, sendMessage, clearMessages, setMessages };
}
