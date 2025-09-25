import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileMobileOptimizations } from "@/hooks/useProfileMobileOptimizations";
import { useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isMobile, simulateProfileFeedback } = useProfileMobileOptimizations();
  
  if (completion >= 100) return null;
  
  // Handle mobile touch feedback
  const handleButtonTouch = () => {
    if (buttonRef.current) {
      simulateProfileFeedback(buttonRef.current, 'start');
    }
  };
  
  const handleButtonClick = () => {
    if (buttonRef.current) {
      simulateProfileFeedback(buttonRef.current, 'complete');
    }
    onStartProfile();
  };
  return <div 
    className={`glass-burgundy rounded-xl border border-white/10 p-2 md:p-4 lg:p-5 mb-1 md:mb-6 max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-2 md:px-4 lg:px-6 ${className} ${
      isMobile ? 'touch-action-manipulation' : ''
    }`}
    data-onboarding-nudge
    style={{ 
      marginBottom: isMobile ? 'calc(0.5rem + env(safe-area-inset-bottom, 16px))' : undefined 
    }}
  >
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-1.5 md:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            {completion > 0 ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" /> : <span className="text-xs font-semibold text-white">1</span>}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-medium text-xs md:text-sm lg:text-base truncate">
              <span className="sm:hidden">Complete profile to chat w/ Kai</span>
              <span className="hidden sm:inline">Complete your profile to start coaching with Kai</span>
            </h3>
          </div>
        </div>
        
        <Button 
          ref={buttonRef}
          onClick={handleButtonClick} 
          onTouchStart={isMobile ? handleButtonTouch : undefined}
          variant="glass" 
          size="sm" 
          className={`flex-shrink-0 text-xs md:text-sm ${
            isMobile ? 'min-h-[44px] touch-action-manipulation active:scale-95 px-2 sm:px-3' : ''
          }`}
        >
          <span className="hidden sm:inline">
            {completion > 0 ? "Continue" : "Get Started"}
          </span>
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>
    </div>;
};
export default OnboardingStepNudge;