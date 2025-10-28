import { Home, Calendar, MessageSquare, BookOpen, Settings, Zap, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "AI Assistant", url: "/ai-assistant", icon: MessageSquare },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-panel border border-white/20 hover:bg-white/5"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/10 flex flex-col z-40 transition-transform duration-300",
        "md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">ADPT</h1>
            <p className="text-xs text-muted-foreground">Mark 5.1</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-white/5 group relative overflow-hidden",
                isActive && "bg-primary/10 text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-glow-pulse" />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", isActive && "glow-text")} />
                <span className="relative z-10 font-medium">{item.title}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-panel p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Your AI Study Companion</p>
          <p className="text-sm font-semibold gradient-text">Level up your learning</p>
        </div>
      </div>
    </aside>
    </>
  );
}
