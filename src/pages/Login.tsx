import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adpt_logged_in") === "true";
    const isOnboarded = localStorage.getItem("adpt_onboarding_complete") === "true";
    
    if (isLoggedIn && isOnboarded) {
      navigate("/dashboard", { replace: true });
    } else if (isLoggedIn && !isOnboarded) {
      navigate("/onboarding-form", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simple validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Store login credentials (in real app, this would be secure backend auth)
    localStorage.setItem("adpt_logged_in", "true");
    localStorage.setItem("adpt_user_email", email);
    
    toast.success(isSignup ? "Account created successfully!" : "Welcome back!");
    
    // Check if user has completed onboarding
    const isOnboarded = localStorage.getItem("adpt_onboarding_complete") === "true";
    
    if (isOnboarded) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding-form");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none -z-10" style={{ animationDelay: '1s' }} />

      <div className="glass-panel max-w-md w-full p-8 md:p-12 relative z-10 animate-fade-in electric-border">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <UserCircle className="w-12 h-12 text-background" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground">
            {isSignup ? "Start your learning journey" : "Continue your progress"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="glass-panel border-white/20 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="glass-panel border-white/20 focus:border-primary"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-semibold h-12 group"
          >
            {isSignup ? "Sign Up" : "Log In"}
            <LogIn className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
