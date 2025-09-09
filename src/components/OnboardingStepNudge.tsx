import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStepNudgeProps {
  completion: number;
  onStartProfile: () => void;
  className?: string;
}

const OnboardingStepNudge = ({ completion, onStartProfile, className = "" }: OnboardingStepNudgeProps) => {
  if (completion >= 100) return null;

  return (
    <div className={`sticky top-0 z-30 bg-gradient-to-r from-coral-500 to-coral-600 shadow-lg border-b border-coral-400/20 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              {completion > 0 ? (
                <div className="w-3 h-3 rounded-full bg-white/60" />
              ) : (
                <span className="text-xs font-semibold text-white">1</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-sm md:text-base truncate">
                  Step 1: Complete your personal profile
                </h3>
                {completion > 0 && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                    {completion}% complete
                  </span>
                )}
              </div>
              <p className="text-white/80 text-xs md:text-sm">
                {completion === 0 
                  ? "Start your journey with personalized relationship insights"
                  : "Continue where you left off to unlock your AI coach"}
              </p>
            </div>
          </div>
          
          <Button
            onClick={onStartProfile}
            className="bg-white text-coral-600 hover:bg-white/90 font-semibold px-4 py-2 flex-shrink-0 text-sm"
          >
            {completion > 0 ? "Continue" : "Get Started"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepNudge;