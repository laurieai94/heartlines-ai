import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  overallProgress: number;
}

const WelcomeBanner = ({ overallProgress }: WelcomeBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("heartlines_profile_welcome_dismissed");
    if (!dismissed && overallProgress === 0) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, [overallProgress]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("heartlines_profile_welcome_dismissed", "true");
  };

  // Auto-hide when user starts filling
  useEffect(() => {
    if (overallProgress > 0 && isVisible) {
      setIsVisible(false);
    }
  }, [overallProgress, isVisible]);

  if (isDismissed || !isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-900/30 via-pink-900/25 to-rose-900/30 border-b-2 border-pink-400/30 px-4 py-4 shadow-[0_0_25px_rgba(251,207,232,0.25),0_4px_20px_rgba(236,72,153,0.15)] animate-slide-up">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-pink-500/10 animate-gradient-shift pointer-events-none" />
      
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Sparkles className="w-5 h-5 text-pink-300 flex-shrink-0 animate-bounce-gentle" />
          <p className="text-[15px] leading-relaxed text-white/95 font-medium">
            welcome! answer just <span className="text-pink-200 font-semibold">5 core questions</span> to chat with kai. you can always add more details later.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-7 w-7 p-0 hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
