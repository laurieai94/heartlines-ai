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
    className={`glass-soft rounded-2xl border border-white/10 p-3 md:p-4 mb-3 md:mb-4 mx-auto shadow-sm ring-1 ring-white/5 ${className} ${
      isMobile ? 'touch-action-manipulation' : ''
    }`}
    data-onboarding-nudge
    style={{ 
      marginBottom: isMobile ? 'calc(0.75rem + env(safe-area-inset-bottom, 16px))' : undefined,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
    }}
  >
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-coral-400/20 to-peach-400/20 flex items-center justify-center border border-white/20">
            {completion > 0 ? 
              <CheckCircle className="w-4 h-4 text-coral-300" /> : 
              <span className="text-xs font-semibold text-white">1</span>
            }
          </div>
          <h3 className="text-white font-bold text-sm">
            So close → Kai's almost unlocked
          </h3>
        </div>
        
        <Button 
          ref={buttonRef}
          onClick={handleButtonClick} 
          onTouchStart={isMobile ? handleButtonTouch : undefined}
          variant="glass" 
          size="sm" 
          className={`bg-gradient-to-r from-coral-500 to-peach-500 text-white hover:from-coral-600 hover:to-peach-600 border-0 shadow-md h-8 px-4 text-xs ${
            isMobile ? 'min-h-[36px] touch-action-manipulation active:scale-95' : ''
          }`}
        >
          <span className="font-medium">
            Finish profile
          </span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>;
};
export default OnboardingStepNudge;