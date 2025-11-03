import React, { memo, useEffect } from "react";
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Heart } from "lucide-react";

import { BRAND } from "@/branding";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const AIChatMessage = memo(({ message, userAvatarUrl, userName, isFirstInGroup = true, isLastInGroup = true }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  const { isMobile } = useOptimizedMobile();
  
  // Format time to show only hours and minutes
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Debug: Track message render performance on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const renderStart = performance.now();
    
    // Measure after render completes
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      if (renderTime > 16) { // Longer than 1 frame (60fps = 16.67ms)
        console.warn('[Mobile Message Slow Render]:', {
          messageId: message.id,
          renderTime: renderTime.toFixed(2) + 'ms',
          messageLength: message.content.length
        });
      }
    });
  }, [message.id, isMobile, message.content.length]);

  
  return (
    <div className={`${isMobile ? 'px-2' : 'md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6'}`}>
      <div 
        className={`flex ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-2' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
        role="listitem"
        aria-label={`${isUser ? (userName || 'User') : 'kai'} message at ${formatTime(message.timestamp)}`}
        style={{
          animation: !isUser ? 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'fade-in 0.3s ease-out',
          animationDelay: '0s',
          animationFillMode: 'backwards'
        }}
      >
      {/* Avatar Container - Show only for first message in group on mobile */}
      <div className="flex-shrink-0">
        <div className={`relative w-[40px] h-[40px] md:w-[44px] md:h-[44px] ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full blur-md drop-shadow-lg ${
            isMobile ? 'opacity-60' : 'opacity-50'
          } ${
            isUser 
              ? isMobile 
                ? 'bg-gradient-to-r from-coral-400 to-orange-400' 
                : 'bg-gradient-to-r from-coral-300 to-orange-300'
              : isMobile 
                ? 'bg-gradient-to-r from-pink-400 to-coral-400' 
                : 'bg-gradient-to-r from-coral-300 to-burgundy-400'
          }`}></div>
          
          <Avatar className={`relative z-10 shadow-lg drop-shadow-lg w-[40px] h-[40px] md:w-[44px] md:h-[44px] md:border-2 md:border-white ${
            isUser 
              ? 'bg-gradient-to-br from-coral-400 to-orange-400' 
              : 'bg-gradient-to-br from-coral-400 to-burgundy-500'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
            ) : isUser ? (
              <AvatarFallback 
                className="bg-gradient-to-br from-coral-400 to-orange-400 text-white text-base md:text-lg font-medium uppercase"
                style={{
                  fontFamily: "'Shrikhand', cursive"
                }}
              >
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4 md:w-4 md:h-4" />}
              </AvatarFallback>
            ) : (
              <>
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
              </>
            )}
          </Avatar>
        </div>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${
        isMobile 
          ? (isFirstInGroup ? 'max-w-[85%]' : 'max-w-[88%]') 
          : 'max-w-[80%]'
      } ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`
          px-2.5 py-1.5 md:px-3 md:py-2 rounded-2xl
          ${isUser
            ? isMobile
              ? 'bg-gradient-to-br from-coral-500/90 to-orange-500/80 text-white border-2 border-coral-400/50 shadow-lg shadow-coral-400/20 rounded-br-sm'
              : 'bg-burgundy-700/40 backdrop-blur-xl text-white rounded-br-lg border-2 border-coral-300/60 ring-2 ring-coral-400/30 md:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_4px_16px_rgba(251,146,60,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : isMobile
              ? 'bg-gradient-to-br from-pink-600/85 via-burgundy-600/75 to-burgundy-700/70 text-white border-2 border-pink-400/40 shadow-md shadow-black/20 rounded-bl-sm'
              : 'bg-gradient-to-br from-burgundy-700/45 via-burgundy-700/40 to-pink-900/35 backdrop-blur-xl text-white rounded-bl-lg border-2 border-pink-400/50 ring-2 ring-pink-400/25 md:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_4px_16px_rgba(236,72,153,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]'
          }
          transition-all duration-300 md:group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(236,72,153,0.2)] md:group-hover:scale-[1.01]
        `}
      >
          <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-light lowercase drop-shadow-sm">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp - Only show for last message in group */}
        {(isLastInGroup || !isMobile) && (
          <p className={`text-xs md:text-xs ${isMobile ? 'text-pink-200/75' : 'text-pink-200/50'} mt-1 px-1 font-light ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
    </div>
  );
});

AIChatMessage.displayName = 'AIChatMessage';

export default AIChatMessage;