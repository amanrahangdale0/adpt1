import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Upload, ListChecks, Calendar, BellRing, Link2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications"; // 🛎️ notifications hook
import { createICS } from "@/lib/createICS"; // 📅 calendar export utility

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistant() {
  // 💬 Chat + Notes State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI study assistant. Upload your notes or chat to generate study goals, schedules, and reminders 📚",
    },
  ]);
  const [input, setInput] = useState("");
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [noteText, setNoteText] = useState("");
  const [miniGoals, setMiniGoals] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState<{ sessions?: Array<{ topic: string; time: string }> } | null>(null);
  const [loading, setLoading] = useState(false);

  const notify = useNotifications();

  // 🧠 Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotesFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setNoteText(text);
      localStorage.setItem("uploadedNotes", text);
    };
    reader.readAsText(file);
  };

  // ♻️ Restore from localStorage
  useEffect(() => {
    const cachedNotes = localStorage.getItem("uploadedNotes");
    const cachedGoals = localStorage.getItem("miniGoals");
    const cachedSchedule = localStorage.getItem("studySchedule");
    if (cachedNotes) setNoteText(cachedNotes);
    if (cachedGoals) setMiniGoals(JSON.parse(cachedGoals));
    if (cachedSchedule) setScheduleData(JSON.parse(cachedSchedule));
  }, []);

  // ⚙️ Generate study goals via AI
  const generateGoalsFromNotes = async () => {
    if (!noteText.trim()) return alert("Please upload a note file first!");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a study AI assistant that helps students summarize notes into actionable daily study goals.",
            },
            {
              role: "user",
              content: `Summarize these notes into daily study mini-goals:\n${noteText}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const aiMessage = data?.choices?.[0]?.message?.content || "";
      const goalsArray = aiMessage
        .split(/\n|\d+\.\s/)
        .filter((line: string) => line.trim().length > 0);

      setMiniGoals(goalsArray);
      localStorage.setItem("miniGoals", JSON.stringify(goalsArray));
      notify("AI-generated new study goals successfully 🎯");

      // Update chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Here are your new study goals 🎯:" },
        {
          role: "assistant",
          content: goalsArray.map((g, i) => `${i + 1}. ${g}`).join("\n"),
        },
      ]);
    } catch (err) {
      console.error("AI goal generation failed:", err);
      alert("Something went wrong while generating goals.");
    } finally {
      setLoading(false);
    }
  };

  // 🗓️ Send goals → backend schedule generator
  const syncGoalsToSchedule = async () => {
    if (miniGoals.length === 0) return alert("No goals found! Generate them first.");
    setLoading(true);

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: miniGoals }),
      });
      const data = await res.json();
      setScheduleData(data);
      localStorage.setItem("studySchedule", JSON.stringify(data));
      notify("Schedule created from your AI goals 🗓️");
    } catch (err) {
      console.error("Schedule sync failed:", err);
      alert("Could not create schedule from goals.");
    } finally {
      setLoading(false);
    }
  };

  // 📂 Export schedule → calendar (.ics)
  const exportToCalendar = () => {
    if (!scheduleData) return alert("Please generate a schedule first!");
    createICS(scheduleData);
    notify("Schedule exported to your calendar 📅");
  };

  // 🔔 Notify upcoming sessions
  const notifyUpcomingSessions = () => {
    if (!scheduleData) return alert("No schedule data available!");
    scheduleData.sessions?.forEach((s) => {
      notify(`Upcoming: ${s.topic} at ${s.time}`, { delay: 15 * 60 * 1000 }); // 15 min before
    });
    alert("Reminders activated!");
  };

  // 💬 Handle chat message send
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful AI study assistant." },
            ...messages,
            userMessage,
          ],
        }),
      });

      const data = await response.json();
      const aiMessage = data?.choices?.[0]?.message?.content || "No response from AI.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10 glass-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AI Study Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Chat, upload notes, and manage your study goals & schedule
              </p>
            </div>
          </div>
        </div>

        {/* Chat & Goals Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-background ml-4"
                      : "glass-panel electric-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {miniGoals.length > 0 && (
              <div className="glass-panel p-4 rounded-xl mt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <ListChecks className="w-5 h-5 text-primary" /> Mini Study Goals
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {miniGoals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input & Controls */}
        <div className="p-6 border-t border-white/10 glass-panel">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row flex-wrap gap-3">
            {/* Chat Input */}
            <div className="flex gap-3 w-full sm:flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about your studies..."
                className="glass-panel border-white/20 focus:border-primary"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* File & Actions */}
            <div className="flex flex-wrap gap-2">
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                asChild
                variant="outline"
                className="glass-panel border-white/20 hover:border-primary/50"
              >
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Notes
                </label>
              </Button>

              <Button
                onClick={generateGoalsFromNotes}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-background hover:opacity-90"
              >
                {loading ? "Analyzing..." : <><ListChecks className="w-4 h-4 mr-2" /> Generate Goals</>}
              </Button>

              <Button
                onClick={syncGoalsToSchedule}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-background hover:opacity-90"
              >
                <Link2 className="w-4 h-4 mr-2" /> Sync Schedule
              </Button>

              <Button
                onClick={exportToCalendar}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-background hover:opacity-90"
              >
                <Calendar className="w-4 h-4 mr-2" /> Export
              </Button>

              <Button
                onClick={notifyUpcomingSessions}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-background hover:opacity-90"
              >
                <BellRing className="w-4 h-4 mr-2" /> Reminders
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
