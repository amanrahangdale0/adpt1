import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TrendingUp, Flame, Target, Clock, Award } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function Dashboard() {
  const [userData, setUserData] = useState({ name: "Student", course: "" });
  const { stats } = useProgress();

  useEffect(() => {
    const stored = localStorage.getItem("adpt_user");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const progressPercent = (stats.todayMinutes / (stats.weeklyGoal / 7)) * 100;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-fade-in pt-16 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{userData.name}</span>
          </h1>
          <p className="text-muted-foreground">{userData.course}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold gradient-text">{stats.xp}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Total XP</h3>
          </div>

          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-2xl font-bold gradient-text">{stats.streak}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Day Streak</h3>
          </div>

          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold gradient-text">{stats.todayMinutes}m</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Today</h3>
          </div>

          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-2xl font-bold gradient-text">{stats.completedSessions}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Sessions Done</h3>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="glass-panel-hover p-6 mb-8 electric-border">
          <h2 className="text-xl font-bold mb-4 gradient-text">Today's Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Daily Goal</span>
                <span className="text-sm font-semibold">{stats.todayMinutes} / {Math.round(stats.weeklyGoal / 7)} minutes</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestion Card */}
        <div className="glass-panel-hover p-6 electric-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Target className="w-6 h-6 text-background" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2 gradient-text">AI Suggestion</h3>
              <p className="text-muted-foreground text-sm">
                You're making great progress! Consider reviewing your notes from yesterday to reinforce learning. 
                Your study schedule suggests focusing on challenging subjects during your peak hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
