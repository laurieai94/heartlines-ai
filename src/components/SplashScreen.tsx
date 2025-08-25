import React from "react";

interface SplashScreenProps {
  message?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-burgundy-900 flex items-center justify-center">
      <div className="relative flex items-center space-x-8">
        {/* Left line */}
        <div className="w-24 sm:w-32 h-px bg-white/40 origin-left animate-line-left-sequence motion-reduce:hidden" />
        
        {/* Text */}
        <div className="text-center">
          <h1 
            className="font-brand font-normal tracking-wide text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
            style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
          >
            heartlines
          </h1>
          {message && (
            <p 
              className="text-white/70 text-lg sm:text-xl mt-4 opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
              style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
            >
              {message}
            </p>
          )}
        </div>
        
        {/* Right line */}
        <div className="w-24 sm:w-32 h-px bg-white/40 origin-right animate-line-right-sequence motion-reduce:hidden" />
      </div>
    </div>
  );
};

export default SplashScreen;