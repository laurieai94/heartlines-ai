import React from "react";

interface SplashScreenProps {
  message?: string;
  showWordmark?: boolean;
  wordmarkSize?: "sm" | "md" | "lg" | "xl";
  messageSize?: "sm" | "md" | "lg";
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  message, 
  showWordmark = true, 
  wordmarkSize = "xl", 
  messageSize = "lg" 
}) => {
  const wordmarkSizeClasses = {
    sm: '30px',
    md: 'clamp(3rem, 12vw, 8rem)',
    lg: 'clamp(4rem, 16vw, 12rem)',
    xl: 'clamp(4rem, 18vw, 20rem)'
  };

  const messageSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-lg sm:text-xl'
  };
  return (
    <div className="min-h-screen bg-burgundy-900 flex items-center justify-center">
      <div className="relative flex items-center space-x-4 sm:space-x-8 md:space-x-12">
        {/* Left line */}
        {showWordmark && <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-left animate-line-left-sequence motion-reduce:hidden" />}
        
        {/* Text */}
        <div className="text-center">
          {showWordmark && (
            <h1 
              className="font-brand font-normal tracking-wide text-white opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
              style={{ 
                fontSize: wordmarkSizeClasses[wordmarkSize],
                animationDelay: '900ms', 
                animationFillMode: 'forwards' 
              }}
            >
              heartlines
            </h1>
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
        {showWordmark && <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-right animate-line-right-sequence motion-reduce:hidden" />}
      </div>
    </div>
  );
};

export default SplashScreen;