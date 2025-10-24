import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

const TypingIndicator: React.FC = () => {
  const { isMobile } = useOptimizedMobile();
  
  return (
    <div 
      className={`${isMobile ? 'px-4' : 'md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6'}`}
      style={{
        animation: 'fade-in 0.3s ease-out'
      }}
    >
      <div 
        className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} mb-3 flex-row`}
        role="status"
        aria-label="AI is typing"
      >
        {/* Avatar Container */}
        <div className="flex-shrink-0">
          <div className="relative w-[29px] h-[29px] md:w-[37px] md:h-[37px]">
            {/* Animated pulsing glow */}
            <div className="absolute inset-0 rounded-full blur-md opacity-40 drop-shadow-lg bg-gradient-to-r from-coral-300 to-burgundy-400 animate-pulse"></div>
            
            <Avatar className="relative z-10 shadow-lg drop-shadow-lg w-[29px] h-[29px] md:w-[37px] md:h-[37px] md:border-2 md:border-white bg-gradient-to-br from-coral-400 to-burgundy-500">
              <AvatarImage 
                src={BRAND.coach.avatarSrc} 
                alt={BRAND.coach.name} 
                className="object-cover"
                loading="eager" 
                decoding="async" 
              />
              <AvatarFallback className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white text-sm md:text-xs font-medium">
                <Heart className="w-4 h-4 md:w-4 md:h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Typing Animation Bubble */}
        <div className="flex flex-col max-w-[80%] items-start">
          <div
            className="bg-gradient-to-r from-burgundy-600/60 via-coral-500/40 to-burgundy-600/60 backdrop-blur-xl text-white rounded-2xl rounded-bl-md border border-coral-400/20 ring-1 ring-coral-400/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] shadow-coral-400/10 px-4 py-3"
          >
            <div className="flex gap-1.5" aria-hidden="true">
              <div 
                className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '1s' }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                style={{ animationDelay: '200ms', animationDuration: '1s' }}
              ></div>
              <div 
                className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                style={{ animationDelay: '400ms', animationDuration: '1s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
