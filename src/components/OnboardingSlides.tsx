import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Brain, Calendar, Sparkles, CheckCircle } from "lucide-react";

const slides = [
  {
    icon: Brain,
    title: "Welcome to ADPT",
    description: "Your AI-powered study companion designed to help you plan, learn, and grow smarter every day.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: Calendar,
    title: "Smart Study Planner",
    description: "Generate personalized schedules that adapt to your subjects, exam dates, and preferred study times.",
    gradient: "from-secondary to-primary"
  },
  {
    icon: Sparkles,
    title: "AI Tutor",
    description: "Get instant help with doubts, summaries, and study strategies powered by advanced AI.",
    gradient: "from-primary to-purple-500"
  },
  {
    icon: CheckCircle,
    title: "Track & Grow",
    description: "Monitor your progress with XP, streaks, and achievements. Stay motivated every step of the way.",
    gradient: "from-purple-500 to-primary"
  }
];

export function OnboardingSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Note: Redirect logic is now handled by RootRedirect in App.tsx
  // This component only shows when user is seeing intro for the first time

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Mark intro as completed and go to login
      localStorage.setItem("adpt_intro_completed", "true");
      navigate("/login");
    }
  };

  const handleSkip = () => {
    // Mark intro as completed and go to login
    localStorage.setItem("adpt_intro_completed", "true");
    navigate("/login");
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none -z-10" style={{ animationDelay: '1s' }} />

      <div className="glass-panel max-w-2xl w-full p-8 md:p-12 relative z-10 animate-fade-in electric-border">
        {/* Slide indicator */}
        <div className="flex gap-2 justify-center mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${slide.gradient} shadow-[0_0_40px_rgba(6,182,212,0.3)]`}>
            <Icon className="w-16 h-16 text-background" />
          </div>
          
          <h2 className="text-4xl font-bold gradient-text">{slide.title}</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {slide.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-12">
          {currentSlide < slides.length - 1 && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 hover:bg-white/5"
            >
              Skip
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-semibold group"
          >
            {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
