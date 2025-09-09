import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
interface OnboardingStepNudgeProps {
  completion: number;
  onStartProfile: () => void;
  className?: string;
}
const OnboardingStepNudge = ({
  completion,
  onStartProfile,
  className = ""
}: OnboardingStepNudgeProps) => {
  if (completion >= 100) return null;
  return <div className={`glass-burgundy rounded-xl border border-white/10 p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            {completion > 0 ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs font-semibold text-white">1</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium text-sm md:text-base truncate">Complete your personal profile to start coaching with Kai</h3>
              {completion > 0 && <span className="text-xs bg-white/10 text-white/90 px-2 py-0.5 rounded-full flex-shrink-0 border border-white/20">
                  {completion}% complete
                </span>}
            </div>
            <p className="text-white/70 text-xs md:text-sm">
              {completion === 0 ? "Start your journey with personalized relationship insights" : "Continue where you left off to unlock your AI coach"}
            </p>
          </div>
        </div>
        
        <Button onClick={onStartProfile} variant="glass" size="sm" className="flex-shrink-0">
          {completion > 0 ? "Continue" : "Get Started"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>;
};
export default OnboardingStepNudge;