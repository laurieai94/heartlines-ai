import React from "react";

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
  console.log('[SplashScreen] Rendering with:', { message, showWordmark, titleText });
  const wordmarkSizeClasses = {
    sm: '30px',
    md: '40px',
    lg: 'clamp(4rem, 16vw, 12rem)',
    xl: 'clamp(4rem, 18vw, 20rem)'
  };

  const messageSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-lg sm:text-xl'
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: '#6b1e3e', // burgundy-900 fallback
        background: 'linear-gradient(135deg, #6b1e3e 0%, #5a1a34 50%, #6b1e3e 100%)'
      }}
    >
      <div className="relative flex items-center space-x-4 sm:space-x-8 md:space-x-12">
        {/* Left line - simplified */}
        {showWordmark && <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40" />}
        
        {/* Text - simplified without complex animations */}
        <div className="text-center">
          {showWordmark && (
            <h1 
              className="text-white"
              style={{ 
                fontSize: wordmarkSizeClasses[wordmarkSize],
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.025em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {titleText}
            </h1>
          )}
          {message && (
            <p 
              className={`text-white ${messageSizeClasses[messageSize]} ${showWordmark ? 'mt-4' : ''}`}
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                opacity: '0.9',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {message}
            </p>
          )}
        </div>
        
        {/* Right line - simplified */}
        {showWordmark && <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40" />}
      </div>
    </div>
  );
};

export default SplashScreen;