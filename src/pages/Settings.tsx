import { Sidebar } from "@/components/Sidebar";
import { Moon, Sun, Bell, Trash2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { useRef } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
      localStorage.clear();
      toast.success("Data cleared successfully");
      window.location.href = "/";
    }
  };

  const handleExportData = () => {
    try {
      // Collect all ADPT-related localStorage data
      const data: Record<string, string | null> = {};
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('adpt_') || key === 'subjects' || key === 'studyPrefs' || key === 'generatedSchedule') {
          data[key] = localStorage.getItem(key);
        }
      });

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `adpt-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Restore all data to localStorage
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) {
            localStorage.setItem(key, value as string);
          }
        });
        
        toast.success("Data imported successfully! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error("Failed to import data. Invalid file format.");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-fade-in pt-16 md:pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your ADPT experience</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Theme Toggle */}
          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                {theme === "dark" ? (
                  <Moon className="w-6 h-6 text-primary" />
                ) : (
                  <Sun className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Appearance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Switch between light and dark mode
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Dark Mode</span>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Backup */}
          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Download className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Backup & Restore</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export or import your study data
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    className="border-white/20 hover:bg-white/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-white/20 hover:bg-white/5"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay updated with study reminders and progress updates
                </p>
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  Configure Notifications
                </Button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-panel-hover p-6 electric-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Clear All Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Remove all your stored data and start fresh
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleClearData}
                  className="bg-destructive/20 hover:bg-destructive/30 text-destructive"
                >
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
