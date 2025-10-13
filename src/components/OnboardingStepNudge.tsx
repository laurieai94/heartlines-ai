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
      {/* Ambient glow background */}
      <div className="absolute inset-0 -z-10 opacity-30 blur-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-coral-400/30 via-pink-500/20 to-transparent rounded-full animate-slow-pulse" />
      </div>

      {/* Premium progress indicator */}
      <div className={`flex items-center ${isCentered ? 'gap-4' : 'gap-3'} relative`}>
        {/* Enhanced circular badge */}
        <div className="relative">
          {/* Animated glow rings */}
          <div className={`absolute inset-0 rounded-full animate-ring-pulse ${
            isCentered ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'
          }`} />
          
          {/* Main badge */}
          <div className={`relative flex-shrink-0 ${
            isCentered ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'
          } rounded-full flex items-center justify-center animate-gradient-shift`}
            style={{
              background: 'linear-gradient(135deg, hsl(var(--coral-400)) 0%, hsl(var(--pink-500)) 50%, hsl(var(--coral-500)) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(255, 107, 157, 0.5), 0 0 40px rgba(255, 138, 80, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span className={`${isCentered ? 'text-lg md:text-xl' : 'text-base'} font-bold text-white drop-shadow-lg`}>1</span>
            
            {/* Sparkle accent */}
            <Sparkles 
              className={`absolute ${isCentered ? '-top-0.5 -right-0.5 w-3 h-3' : '-top-0.5 -right-0.5 w-2.5 h-2.5'} text-white animate-slow-pulse`}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' }}
            />
          </div>
        </div>
        
        {/* Enhanced headline with gradient text */}
        <h3 className={`font-bold ${
          isCentered ? 'text-base md:text-lg' : 'text-sm md:text-base'
        } tracking-tight leading-tight`}
          style={{
            background: 'linear-gradient(135deg, hsl(var(--coral-400)) 0%, hsl(var(--pink-500)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 8px rgba(255, 138, 80, 0.3))'
          }}
        >
          Finish profile to unlock Kai
        </h3>
      </div>
    </div>
  );
};

export default OnboardingStepNudge;