import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Sparkles, Download, Bell, ListChecks, CalendarDays, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/useCalendar";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";

export default function Schedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Array<{ title: string; start: Date; end: Date; description: string; difficulty?: string; subject?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const { createICS } = useCalendar();
  const { requestPermission, sendNotification } = useNotifications();

  // 🧠 Load generated schedule from localStorage
  useEffect(() => {
    const loadSchedule = () => {
      const generatedSchedule = localStorage.getItem("generatedSchedule");
      const timestamp = localStorage.getItem("scheduleGeneratedAt");
      
      if (generatedSchedule) {
        const parsedSchedule = JSON.parse(generatedSchedule);
        // Convert string dates back to Date objects
        const scheduleWithDates = parsedSchedule.map((session: { start: string; end: string }) => ({
          ...session,
          start: new Date(session.start),
          end: new Date(session.end),
        }));
        setSchedule(scheduleWithDates);
        setGeneratedAt(timestamp);
      }
    };
    
    loadSchedule();
  }, []);

  // Group schedule by date
  const groupedSchedule = schedule.reduce((acc, session) => {
    const dateKey = format(session.start, "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, typeof schedule>);

  const sortedDates = Object.keys(groupedSchedule).sort();

  // 📥 Export to Calendar (.ics)
  const handleDownloadICS = () => {
    if (schedule.length === 0) {
      alert("Please generate a schedule first!");
      return;
    }
    createICS(schedule);
    sendNotification("📅 Exported", "Your study schedule was exported to calendar.");
  };

  // 🔔 Schedule reminders (15 min before)
  const handleEnableReminders = async () => {
    if (schedule.length === 0) {
      alert("Please generate or load a schedule first!");
      return;
    }

    await requestPermission();

    schedule.forEach((session) => {
      const now = Date.now();
      const sessionTime = new Date(session.start).getTime();
      const reminderTime = sessionTime - 15 * 60 * 1000; // 15 minutes before

      if (reminderTime > now) {
        const delay = reminderTime - now;
        setTimeout(() => {
          sendNotification("Upcoming Study Session ⏰", `${session.title} starts in 15 minutes!`);
        }, delay);
      }
    });

    sendNotification("Reminders Active 🔔", "You’ll be reminded before each study session.");
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-fade-in pt-16 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <CalendarDays className="w-5 h-5 text-background" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">AI Study Schedule</h1>
          </div>
          <p className="text-muted-foreground">
            Smart study plan powered by your AI-generated goals.
          </p>
        </div>

        {/* Empty State or Schedule Display */}
        {schedule.length === 0 ? (
          <div className="max-w-3xl mx-auto glass-panel-hover p-12 text-center electric-border">
            <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-primary mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              <CalendarDays className="w-16 h-16 text-background" />
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              No Schedule Generated Yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create subjects and set your preferences, then generate an AI-powered study schedule tailored to your needs.
            </p>
            <Button
              onClick={() => navigate("/subjects")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-semibold group"
            >
              Go to Subjects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Schedule Info */}
            {generatedAt && (
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">AI-Generated Schedule</p>
                    <p className="text-xs text-muted-foreground">
                      Created {format(new Date(generatedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDownloadICS} size="sm" variant="outline" className="glass-panel border-white/20">
                    <Download className="w-4 h-4 mr-2" /> Export
                  </Button>
                  <Button onClick={handleEnableReminders} size="sm" variant="outline" className="glass-panel border-white/20">
                    <Bell className="w-4 h-4 mr-2" /> Reminders
                  </Button>
                </div>
              </div>
            )}

            {/* Schedule Sessions by Date */}
            <div className="space-y-8">
              {sortedDates.map((dateKey) => {
                const sessions = groupedSchedule[dateKey];
                const date = new Date(dateKey);
                const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;
                
                return (
                  <div key={dateKey} className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in electric-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <CalendarDays className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold gradient-text">
                          {format(date, "EEEE, MMMM d")}
                          {isToday && <span className="ml-2 text-sm">(Today)</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {sessions.length} study session{sessions.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sessions.map((session, i) => {
                        const difficultyColors = {
                          easy: "from-green-500/20 to-emerald-500/20 border-green-500/30",
                          medium: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
                          hard: "from-red-500/20 to-pink-500/20 border-red-500/30",
                        };
                        const colorClass = session.difficulty 
                          ? difficultyColors[session.difficulty as keyof typeof difficultyColors] 
                          : "from-primary/20 to-secondary/20 border-primary/30";

                        return (
                          <div
                            key={i}
                            className={`p-4 rounded-lg bg-gradient-to-r ${colorClass} border backdrop-blur-sm`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{session.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {session.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="px-2 py-1 rounded bg-background/50 font-medium">
                                    {format(session.start, "h:mm a")} - {format(session.end, "h:mm a")}
                                  </span>
                                  {session.difficulty && (
                                    <span className="px-2 py-1 rounded bg-background/50 font-medium capitalize">
                                      {session.difficulty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
