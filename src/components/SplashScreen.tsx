import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-burgundy-600 flex items-center justify-center">
      <div className="relative flex items-center space-x-8">
        {/* Left line */}
        <div className="w-24 sm:w-32 h-px bg-white/40 origin-left animate-line-left-sequence motion-reduce:hidden" />
        
        {/* Text */}
        <h1 
          className="font-brand font-normal tracking-wide text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100"
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          heartlines
        </h1>
        
        {/* Right line */}
        <div className="w-24 sm:w-32 h-px bg-white/40 origin-right animate-line-right-sequence motion-reduce:hidden" />
      </div>
    </div>
  );
};

export default SplashScreen;