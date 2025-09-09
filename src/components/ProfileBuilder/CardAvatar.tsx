import React from 'react';

interface CardAvatarProps {
  children: React.ReactNode;
  className?: string;
}

const CardAvatar = ({ children, className = "" }: CardAvatarProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
      
      {/* Main heart avatar container */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
        
        {/* Heart-shaped SVG with gradient */}
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 146, 60)" />
              <stop offset="100%" stopColor="rgb(244, 63, 94)" />
            </linearGradient>
          </defs>
          
          {/* Main heart shape */}
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="url(#heartGradient)"
            stroke="white"
            strokeWidth="1"
          />
          
          {/* Dashed inner heart */}
          <path
            d="M19.13 6.32a3.5 3.5 0 0 0-4.95 0L12 8.5l-2.18-2.18a3.5 3.5 0 0 0-4.95 4.95L12 18.4l7.13-7.13a3.5 3.5 0 0 0 0-4.95z"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.6"
            className="animate-spin"
            style={{ animationDuration: '8s' }}
          />
        </svg>
        
        {/* Content container */}
        <div className="absolute inset-0 z-10 w-full h-full text-white flex items-center justify-center">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAvatar;