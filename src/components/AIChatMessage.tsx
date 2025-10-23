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
        className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-3' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
        role="listitem"
        aria-label={`${isUser ? (userName || 'User') : 'kai'} message at ${formatTime(message.timestamp)}`}
      >
      {/* Avatar Container - Show only for first message in group on mobile */}
      <div className="flex-shrink-0">
        <div className={`relative w-6 h-6 md:w-8 md:h-8 ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full blur-md opacity-40 drop-shadow-lg ${
            isUser ? 'bg-gradient-to-r from-coral-300 to-orange-300' : 'bg-gradient-to-r from-coral-300 to-burgundy-400'
          }`}></div>
          
          <Avatar className={`relative z-10 shadow-lg drop-shadow-lg w-6 h-6 md:w-8 md:h-8 md:border-2 md:border-white ${
            isUser 
              ? 'bg-gradient-to-br from-coral-400 to-orange-400' 
              : 'bg-gradient-to-br from-coral-400 to-burgundy-500'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
            ) : isUser ? (
              <AvatarFallback 
                className="bg-gradient-to-br from-coral-400 to-orange-400 text-white text-sm md:text-base font-medium uppercase"
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
        {isUser ? (
          // Gradient border wrapper for user messages
          <div className="p-[2px] rounded-2xl brand-gradient-reverse">
            <div className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-[14px] rounded-br-sm md:rounded-br-md bg-burgundy-700/60 backdrop-blur-xl text-white transition-all duration-300 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] group-hover:scale-[1.01]">
              <div className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap font-light lowercase">
                {message.content}
              </div>
            </div>
          </div>
        ) : (
          // AI messages keep existing white border styling
          <div
            className="transition-all duration-300 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] group-hover:scale-[1.01] px-2.5 py-1.5 md:px-3 md:py-2 rounded-2xl rounded-bl-md md:rounded-bl-lg bg-burgundy-600/60 backdrop-blur-xl text-white border border-white/25 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] shadow-white/5"
          >
            <div className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap font-light lowercase">
              {message.content}
            </div>
          </div>
        )}
        
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