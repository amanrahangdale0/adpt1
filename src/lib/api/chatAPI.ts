// src/lib/api/chatAPI.ts

export async function sendChatToServer(messages: Array<{ role: string; content: string }>) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json();
}