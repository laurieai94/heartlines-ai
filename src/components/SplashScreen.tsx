import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-burgundy-600 flex items-center justify-center">
      <div className="relative flex items-center space-x-8">
        {/* Left line */}
        <div className="w-20 h-px bg-white/40 animate-line-grow" style={{ animationDelay: '0ms' }} />
        
        {/* Text */}
        <h1 
          className="font-brand font-normal tracking-wide text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-0 animate-fade-in"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          heartlines
        </h1>
        
        {/* Right line */}
        <div className="w-20 h-px bg-white/40 animate-line-grow" style={{ animationDelay: '200ms' }} />
      </div>
    </div>
  );
};

export default SplashScreen;