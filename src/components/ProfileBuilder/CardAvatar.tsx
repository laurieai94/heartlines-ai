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
      
      {/* Main avatar container */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
        
        {/* Solid white outer ring */}
        <div className="absolute inset-0 rounded-full ring-2 ring-white" />
        
        {/* Dashed white inner ring */}
        <div className="absolute inset-2 rounded-full border-2 border-white border-dashed opacity-60 animate-spin" 
             style={{ animationDuration: '8s' }} />
        
        {/* Content container */}
        <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CardAvatar;