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
    <div className="bg-rose-900/20 border-b border-white/10 px-4 py-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Sparkles className="w-4 h-4 text-pink-300 flex-shrink-0" />
          <p className="text-sm text-white/90">
            Welcome! Answer just 5 core questions to chat with Kai. You can always add more details later.
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
