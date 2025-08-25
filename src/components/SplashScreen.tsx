import React from "react";

interface SplashScreenProps {
  message?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-burgundy-900 flex items-center justify-center">
      <div className="relative flex items-center space-x-4 sm:space-x-8 md:space-x-12">
        {/* Left line */}
        <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-left animate-line-left-sequence motion-reduce:hidden" />
        
        {/* Text */}
        <div className="text-center">
          <h1 
            className="font-brand font-normal tracking-wide text-white opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
            style={{ 
              fontSize: 'clamp(4rem, 18vw, 20rem)',
              animationDelay: '900ms', 
              animationFillMode: 'forwards' 
            }}
          >
            heartlines
          </h1>
          {message && (
            <p 
              className="font-brand text-white/70 text-lg sm:text-xl mt-4 opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
              style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
            >
              {message}
            </p>
          )}
        </div>
        
        {/* Right line */}
        <div className="w-12 sm:w-24 md:w-40 lg:w-64 h-px bg-white/40 origin-right animate-line-right-sequence motion-reduce:hidden" />
      </div>
    </div>
  );
};

export default SplashScreen;