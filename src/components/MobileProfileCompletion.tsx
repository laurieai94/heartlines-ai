import { ArrowRight, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileMobileOptimizations } from "@/hooks/useProfileMobileOptimizations";
import { useRef } from "react";

interface MobileProfileCompletionProps {
  completion: number;
  onStartProfile: () => void;
  className?: string;
}

const MobileProfileCompletion = ({
  completion,
  onStartProfile,
  className = ""
}: MobileProfileCompletionProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isMobile, simulateProfileFeedback } = useProfileMobileOptimizations();
  
  if (completion >= 100) return null;

  // Calculate steps remaining (assume 4 main sections)
  const totalSteps = 4;
  const completedSteps = Math.floor((completion / 100) * totalSteps);
  const stepsLeft = totalSteps - completedSteps;

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

  // Progressive messaging based on completion
  const getProgressMessage = () => {
    if (completion === 0) return "3 quick questions to unlock Kai";
    if (completion < 50) return `${stepsLeft} steps left to unlock Kai`;
    return "Almost ready! Complete profile";
  };

  const getButtonText = () => {
    if (completion === 0) return "Get Started";
    if (completion < 75) return "Continue";
    return "Finish";
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 16px)'
      }}
    >
      <div className="mx-4 mb-4 glass-burgundy rounded-2xl border border-white/10 shadow-2xl backdrop-blur-lg">
        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-t-2xl h-1">
          <div 
            className="h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-t-2xl transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Heart className="w-5 h-5 text-pink-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm leading-tight">
                {getProgressMessage()}
              </p>
              {completion > 0 && (
                <p className="text-white/60 text-xs mt-0.5">
                  {completion}% complete
                </p>
              )}
            </div>
          </div>
          
          <Button 
            ref={buttonRef}
            onClick={handleButtonClick} 
            onTouchStart={isMobile ? handleButtonTouch : undefined}
            variant="default"
            size="lg" 
            className="w-full min-h-[48px] touch-action-manipulation active:scale-[0.98] transition-transform duration-150 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-lg"
          >
            {getButtonText()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileCompletion;