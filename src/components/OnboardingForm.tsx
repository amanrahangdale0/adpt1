import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UserCircle, CheckCircle } from "lucide-react";

export function OnboardingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    about: "",
    studyHours: "4"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.course) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Save to localStorage
    localStorage.setItem("adpt_user", JSON.stringify(formData));
    localStorage.setItem("adpt_onboarding_complete", "true");
    
    toast.success("Welcome to ADPT! Let's get started.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      
      <div className="glass-panel max-w-2xl w-full p-8 md:p-12 relative z-10 animate-fade-in electric-border">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <UserCircle className="w-12 h-12 text-background" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Let's Get to Know You</h2>
          <p className="text-muted-foreground">Help us personalize your learning experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="glass-panel border-white/20 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-foreground">Course / Grade *</Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g., CSE 3rd Year, Grade 12"
              className="glass-panel border-white/20 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-foreground">About Your Goals (Optional)</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell us about your study goals..."
              className="glass-panel border-white/20 focus:border-primary min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studyHours" className="text-foreground">Daily Study Hours *</Label>
            <Input
              id="studyHours"
              type="number"
              min="1"
              max="12"
              value={formData.studyHours}
              onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
              className="glass-panel border-white/20 focus:border-primary"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-semibold h-12 group"
          >
            Complete Setup
            <CheckCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
}
