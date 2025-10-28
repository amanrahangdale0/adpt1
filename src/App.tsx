import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OnboardingSlides } from "./components/OnboardingSlides";
import { OnboardingForm } from "./components/OnboardingForm";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import AIAssistant from "./pages/AIAssistant";
import Subjects from "./pages/Subjects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root redirect component - handles initial app load routing
function RootRedirect() {
  const introCompleted = localStorage.getItem("adpt_intro_completed") === "true";
  const isLoggedIn = localStorage.getItem("adpt_logged_in") === "true";
  const isOnboarded = localStorage.getItem("adpt_onboarding_complete") === "true";
  
  // Return user directly to dashboard if everything is complete
  if (introCompleted && isLoggedIn && isOnboarded) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If intro done but not logged in, go to login
  if (introCompleted && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in but not onboarded, go to form
  if (introCompleted && isLoggedIn && !isOnboarded) {
    return <Navigate to="/onboarding-form" replace />;
  }
  
  // First time users see intro slides
  return <OnboardingSlides />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("adpt_logged_in") === "true";
  const isOnboarded = localStorage.getItem("adpt_onboarding_complete") === "true";
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isOnboarded) {
    return <Navigate to="/onboarding-form" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="adpt-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding-form" element={<OnboardingForm />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
