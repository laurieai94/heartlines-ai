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
    className={`glass-soft rounded-3xl border border-white/10 p-4 md:p-6 mb-6 md:mb-8 mx-auto shadow-lg ring-1 ring-white/5 ${className} ${
      isMobile ? 'touch-action-manipulation' : ''
    }`}
    data-onboarding-nudge
    style={{ 
      marginBottom: isMobile ? 'calc(1rem + env(safe-area-inset-bottom, 16px))' : undefined,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
    }}
  >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-coral-400/20 to-peach-400/20 flex items-center justify-center border border-white/20 shadow-sm">
            {completion > 0 ? 
              <CheckCircle className="w-5 h-5 text-coral-300" /> : 
              <span className="text-sm font-semibold text-white">1</span>
            }
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-sm md:text-base">
              So close → Kai's almost unlocked
            </h3>
          </div>
        </div>
        
        <Button 
          ref={buttonRef}
          onClick={handleButtonClick} 
          onTouchStart={isMobile ? handleButtonTouch : undefined}
          variant="glass" 
          size="sm" 
          className={`flex-shrink-0 bg-gradient-to-r from-coral-500 to-peach-500 text-white hover:from-coral-600 hover:to-peach-600 border-0 shadow-lg ${
            isMobile ? 'min-h-[44px] touch-action-manipulation active:scale-95 px-4' : 'px-6'
          }`}
        >
          <span className="font-medium">
            {completion > 0 ? "Continue" : "Get Started"}
          </span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>;
};
export default OnboardingStepNudge;