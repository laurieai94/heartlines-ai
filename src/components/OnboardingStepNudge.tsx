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
    className={`glass-burgundy rounded-xl border border-white/10 p-4 mb-6 max-w-none mx-2 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl md:mx-auto lg:px-4 xl:px-8 ${className} ${
      isMobile ? 'touch-action-manipulation mb-8' : ''
    }`}
    data-onboarding-nudge
    style={{ 
      marginBottom: isMobile ? 'calc(1.5rem + env(safe-area-inset-bottom, 16px))' : undefined 
    }}
  >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            {completion > 0 ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs font-semibold text-white">1</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium text-sm md:text-base truncate">Complete your profile to start coaching with Kai</h3>
              {completion > 0 && <span className="text-xs bg-white/10 text-white/90 px-2 py-0.5 rounded-full flex-shrink-0 border border-white/20">
                  {completion}% complete
                </span>}
            </div>
            
          </div>
        </div>
        
        <Button 
          ref={buttonRef}
          onClick={handleButtonClick} 
          onTouchStart={isMobile ? handleButtonTouch : undefined}
          variant="glass" 
          size="sm" 
          className={`flex-shrink-0 ${
            isMobile ? 'min-h-[44px] touch-action-manipulation active:scale-95' : ''
          }`}
        >
          {completion > 0 ? "Continue" : "Get Started"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>;
};
export default OnboardingStepNudge;