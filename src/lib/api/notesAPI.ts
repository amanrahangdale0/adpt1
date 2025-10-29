// src/lib/api/notesAPI.ts

export async function uploadNotesText(text: string) {
  const base = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const res = await fetch(`${base}/api/notes/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Notes API Error: " + txt);
  }

  return res.json();
}