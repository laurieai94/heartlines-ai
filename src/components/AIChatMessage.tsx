import React, { memo } from "react";
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

  
  return (
    <div className={`${isMobile ? 'px-4' : 'md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6'}`}>
      <div 
        className={`flex ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-3' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
        role="listitem"
        aria-label={`${isUser ? (userName || 'User') : 'kai'} message at ${formatTime(message.timestamp)}`}
      >
      {/* Avatar Container - Show only for first message in group on mobile */}
      <div className="flex-shrink-0">
        <div className={`relative w-8 h-8 md:w-10 md:h-10 ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full blur-md opacity-40 drop-shadow-lg ${
            isUser ? 'bg-gradient-to-r from-coral-300 via-pink-300 to-orange-300' : 'bg-gradient-to-r from-coral-300 to-burgundy-400'
          }`}></div>
          
          <Avatar className={`relative z-10 shadow-lg drop-shadow-lg w-8 h-8 md:w-10 md:h-10 md:border-2 md:border-white ${
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
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5 md:w-5 md:h-5" />}
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
                <AvatarFallback className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white text-base md:text-base font-medium">
                  <Heart className="w-5 h-5 md:w-5 md:h-5" />
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
            transition-all duration-300 group-hover:shadow-[0_16px_56px_rgba(0,0,0,0.8)] group-hover:scale-[1.01] px-2.5 py-1.5 md:px-3 md:py-2 rounded-2xl md:rounded-2xl
            ${isUser
              ? 'bg-burgundy-700/75 backdrop-blur-2xl text-white rounded-br-md md:rounded-br-lg border-2 border-transparent bg-gradient-to-r from-orange-400/50 via-rose-500/50 to-pink-500/50 bg-origin-border ring-1 ring-orange-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_4px_16px_rgba(255,138,120,0.25)]'
              : 'bg-burgundy-600/75 backdrop-blur-2xl text-white rounded-bl-md md:rounded-bl-lg border-2 border-white/40 ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_4px_16px_rgba(255,255,255,0.15)]'
            }
          `}
        >
          <div className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap font-light lowercase">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp - Only show for last message in group */}
        {(isLastInGroup || !isMobile) && (
          <p className={`text-xs md:text-xs text-white/60 mt-1 px-1 font-light ${isUser ? 'text-right' : 'text-left'}`}>
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