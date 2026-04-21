import React from "react";
import PhoneLockup from "@/components/brand/PhoneLockup";

interface SplashScreenProps {
  message?: string;
  showWordmark?: boolean;
  wordmarkSize?: "sm" | "md" | "lg" | "xl";
  messageSize?: "sm" | "md" | "lg";
  titleText?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  message, 
  showWordmark = true, 
  wordmarkSize = "md", 
  messageSize = "lg",
  titleText = "heartlines"
}) => {
  const wordmarkSizeClasses = {
    sm: '30px',
    md: '40px',
    lg: 'clamp(2.5rem, 8vw, 5rem)',
    xl: 'clamp(4rem, 18vw, 20rem)'
  };

  const messageSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-lg sm:text-xl'
  };
  return (
    <div className="min-h-screen bg-burgundy-800 flex items-center justify-center">
      <div className="relative flex items-center space-x-4 sm:space-x-8 md:space-x-12">
        {/* Left line */}
        {showWordmark && <div className="hidden sm:block w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-left animate-line-left-sequence motion-reduce:hidden" />}
        
        {/* Phone Lockup or Text */}
        <div className="text-center">
          {showWordmark && (
            <div 
              className="opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
              style={{ 
                animationDelay: '900ms', 
                animationFillMode: 'forwards' 
              }}
            >
              <PhoneLockup size={wordmarkSize} showTagline={true} />
            </div>
          )}
          {message && (
            <p 
              className={`font-brand text-white/70 ${messageSizeClasses[messageSize]} ${showWordmark ? 'mt-4' : ''} opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100`}
              style={{ animationDelay: showWordmark ? '1200ms' : '0ms', animationFillMode: 'forwards' }}
            >
              {message}
            </p>
          )}
        </div>
        
        {/* Right line */}
        {showWordmark && <div className="hidden sm:block w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-right animate-line-right-sequence motion-reduce:hidden" />}
      </div>
    </div>
  );
};

export default SplashScreen;