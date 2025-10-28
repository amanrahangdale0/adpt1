"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Trash2, Calendar, X, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/hooks/localStorage";
import { generateSchedule } from "@/lib/scheduleGenerator";
import { toast } from "sonner";

type Subject = {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  examDate: string;
};

type StudyPrefs = {
  studyType: "continuous" | "breaks";
  studyTime: "morning" | "evening" | "night";
  hoursPerDay: number;
};

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("subjects", []);
  const [prefs, setPrefs] = useLocalStorage<StudyPrefs>("studyPrefs", {
    studyType: "breaks",
    studyTime: "evening",
    hoursPerDay: 4,
  });

  const [newSubject, setNewSubject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  function addSubject() {
    if (!newSubject.trim()) return;
    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject,
      difficulty: "medium",
      examDate: "",
    };
    setSubjects([...subjects, subject]);
    setNewSubject("");
    setShowModal(false);
  }

  function updateSubject(id: string, key: keyof Subject, value: string) {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }

  function deleteSubject(id: string) {
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  function handleGenerateSchedule() {
    if (subjects.length === 0) {
      toast.error("Please add at least one subject first!");
      return;
    }

    setGenerating(true);
    
    // Small delay for UX (simulate processing)
    setTimeout(() => {
      const schedule = generateSchedule(subjects, prefs);
      
      // Save schedule to localStorage
      localStorage.setItem("generatedSchedule", JSON.stringify(schedule));
      localStorage.setItem("scheduleGeneratedAt", new Date().toISOString());
      
      setGenerating(false);
      toast.success(`✨ Generated ${schedule.length} study sessions!`);
      
      // Navigate to schedule page
      navigate("/schedule");
    }, 800);
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-fade-in relative pt-16 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Subjects</h1>
              <p className="text-muted-foreground">
                Manage your courses and topics
              </p>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {/* Generate Schedule Button */}
          {subjects.length > 0 && (
            <Button
              onClick={handleGenerateSchedule}
              disabled={generating}
              className="w-full bg-gradient-to-r from-purple-500 to-primary hover:opacity-90 text-background font-semibold h-14 shadow-[0_0_30px_rgba(139,92,246,0.3)] group"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Your Schedule...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Generate AI Study Schedule
                </>
              )}
            </Button>
          )}
        </div>

        {/* Empty State */}
        {subjects.length === 0 ? (
          <div className="glass-panel-hover p-12 text-center electric-border">
            <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
              <BookOpen className="w-16 h-16 text-background" />
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              No Subjects Yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by adding your subjects to track your progress and get
              personalized study recommendations.
            </p>
          </div>
        ) : (
          <>
            {/* Subject List */}
            <div className="grid gap-6 md:grid-cols-2">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="glass-panel-hover p-6 rounded-2xl electric-border space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg gradient-text">
                      {s.name}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSubject(s.id)}
                      className="hover:bg-red-500/20"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </Button>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Difficulty:
                    </label>
                    <select
                      value={s.difficulty}
                      onChange={(e) =>
                        updateSubject(s.id, "difficulty", e.target.value)
                      }
                      className="w-full glass-panel border border-white/10 p-2 rounded-lg mt-1"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  {/* Exam Date */}
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Exam Date:
                    </label>
                    <Input
                      type="date"
                      value={s.examDate}
                      onChange={(e) =>
                        updateSubject(s.id, "examDate", e.target.value)
                      }
                      className="glass-panel border-white/20 mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Study Preferences */}
            <div className="mt-12 glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 gradient-text">
                Study Preferences
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Study Type
                  </label>
                  <select
                    value={prefs.studyType}
                    onChange={(e) =>
                      setPrefs({ ...prefs, studyType: e.target.value as "continuous" | "breaks" })
                    }
                    className="w-full glass-panel border-white/10 p-2 rounded-lg mt-1"
                  >
                    <option value="continuous">Continuous</option>
                    <option value="breaks">With Breaks</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Preferred Time
                  </label>
                  <select
                    value={prefs.studyTime}
                    onChange={(e) =>
                      setPrefs({ ...prefs, studyTime: e.target.value as "morning" | "evening" | "night" })
                    }
                    className="w-full glass-panel border-white/10 p-2 rounded-lg mt-1"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="night">Late Night</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Hours per Day
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={prefs.hoursPerDay}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        hoursPerDay: parseInt(e.target.value),
                      })
                    }
                    className="glass-panel border-white/20 mt-1"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal for adding a subject */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel p-6 rounded-2xl w-[90%] max-w-md relative border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold gradient-text mb-4">
                Add New Subject
              </h2>

              <Input
                placeholder="Enter subject name..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="mb-4"
              />

              <Button
                onClick={addSubject}
                className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Subject
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
