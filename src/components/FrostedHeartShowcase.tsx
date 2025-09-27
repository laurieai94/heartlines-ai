import React from "react";
import { Heart } from "lucide-react";

const FrostedHeartShowcase = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Molten Metallic Blob Background */}
      <div className="absolute inset-0">
        {/* Primary molten blob */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-burgundy-500/30 via-burgundy-600/40 to-burgundy-700/30 rounded-full blur-3xl animate-pulse opacity-60 animate-bounce" 
             style={{
               animationDuration: "8s",
               animationDirection: "alternate",
               animationIterationCount: "infinite"
             }}>
        </div>
        
        {/* Secondary molten blob */}
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-tl from-rose-400/25 via-burgundy-500/35 to-burgundy-800/25 rounded-full blur-2xl opacity-50 animate-pulse"
             style={{
               animationDuration: "10s",
               animationDirection: "alternate-reverse",
               animationIterationCount: "infinite"
             }}>
        </div>
        
        {/* Tertiary accent blob */}
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-burgundy-400/20 via-rose-300/30 to-burgundy-600/25 rounded-full blur-xl opacity-40 animate-pulse"
             style={{
               animationDuration: "14s",
               animationDirection: "alternate",
               animationIterationCount: "infinite"
             }}>
        </div>
      </div>

      {/* Frosted Heart Container */}
      <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
        <div className="relative group">
          {/* Heart Shape Background */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Frosted heart backdrop */}
            <div 
              className="absolute inset-0 glass-burgundy rounded-full transform rotate-45 scale-75"
              style={{
                clipPath: "path('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z')",
                filter: "blur(1px)"
              }}
            >
            </div>
            
            {/* Main frosted heart */}
            <div className="relative glass-burgundy-input border border-burgundy-300/30 backdrop-blur-xl rounded-full p-12 transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-2 shadow-2xl shadow-burgundy-500/20">
              <Heart 
                className="w-32 h-32 text-burgundy-100/90 fill-burgundy-200/20 transition-all duration-500 group-hover:text-burgundy-50 group-hover:fill-burgundy-100/30" 
                strokeWidth={1.5}
              />
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-burgundy-300/10 via-transparent to-burgundy-600/10 pointer-events-none"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-burgundy-300/60 rounded-full animate-bounce" style={{animationDelay: "0s"}}></div>
            <div className="absolute top-8 -right-6 w-2 h-2 bg-rose-300/50 rounded-full animate-bounce" style={{animationDelay: "1s"}}></div>
            <div className="absolute -bottom-2 left-12 w-2.5 h-2.5 bg-burgundy-400/40 rounded-full animate-bounce" style={{animationDelay: "2s"}}></div>
            <div className="absolute bottom-16 -right-2 w-1.5 h-1.5 bg-burgundy-200/70 rounded-full animate-bounce" style={{animationDelay: "1.5s"}}></div>
          </div>

          {/* Text Content */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <h3 className="text-2xl font-semibold text-burgundy-50 mb-2">
              Built with Love
            </h3>
            <p className="text-burgundy-200/80 text-sm max-w-md">
              Every feature crafted to strengthen your connection
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default FrostedHeartShowcase;