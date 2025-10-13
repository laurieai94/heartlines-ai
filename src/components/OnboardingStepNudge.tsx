import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useRef } from "react";

interface OnboardingStepNudgeProps {
  completion: number;
  onStartProfile: () => void;
  className?: string;
  variant?: 'inline' | 'centered';
}

const OnboardingStepNudge = ({
  completion,
  onStartProfile,
  className = "",
  variant = 'inline'
}: OnboardingStepNudgeProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isMobile } = useOptimizedMobile();
  const isCentered = variant === 'centered';
  
  if (completion >= 100) return null;
  
  const handleButtonClick = () => {
    onStartProfile();
  };

  return (
    <div 
      className={`flex flex-col items-center ${isCentered ? 'gap-3 md:gap-4' : 'gap-2'} ${className} ${
        isMobile ? 'touch-action-manipulation' : ''
      } animate-fade-in`}
      data-onboarding-nudge
      style={{ 
        marginBottom: !isCentered && isMobile ? 'calc(0.75rem + env(safe-area-inset-bottom, 16px))' : undefined,
        animationDelay: '0.2s'
      }}
    >
      {/* Premium button with shimmer effect */}
      <div className="relative group">
        {/* Button glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-60 md:opacity-80 blur-lg group-hover:opacity-80 md:group-hover:opacity-95 transition-opacity duration-300" />
        
        {/* Backdrop for better contrast on desktop/tablet */}
        {isCentered && <div className="absolute -inset-4 md:-inset-6 bg-black/40 md:bg-black/50 rounded-3xl blur-xl" />}
        
        <Button 
          ref={buttonRef}
          onClick={handleButtonClick} 
          variant="glass" 
          size={isCentered ? 'lg' : 'default'}
          className={`relative bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 text-white border-0 font-semibold tracking-wide overflow-hidden ${
            isCentered 
              ? 'h-10 md:h-11 px-6 md:px-8 text-sm md:text-base rounded-full' 
              : 'h-9 px-5 text-sm rounded-full'
          } transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            isMobile ? 'min-h-[44px] touch-action-manipulation' : ''
          }`}
          style={{
            boxShadow: isCentered && !isMobile 
              ? '0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 107, 157, 0.3)'
              : '0 6px 24px rgba(255, 107, 157, 0.4), 0 3px 12px rgba(255, 138, 80, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%'
              }}
            />
          </div>
          
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className={`${isCentered ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
            Finish profile to unlock Kai
          </span>
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStepNudge;