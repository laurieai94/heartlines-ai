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
    <div 
      className={`relative ${isMobile ? (isLastInGroup ? 'mb-3' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? '' : 'flex gap-1.5 md:gap-3'} group`}
      role="listitem"
      aria-label={`${isUser ? (userName || 'User') : 'Kai'} message at ${formatTime(message.timestamp)}`}
    >
      {/* AI Avatar Container - Left aligned for Kai only */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className={`relative w-6 h-6 md:w-8 md:h-8 ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
            {/* Subtle glow for avatars */}
            {!isMobile && (
              <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-gradient-to-r from-purple-300 to-pink-300"></div>
            )}
            
            <Avatar className="relative z-10 shadow-lg w-6 h-6 md:w-8 md:h-8 md:border-2 md:border-white bg-gradient-to-br from-purple-500 to-pink-500">
              <AvatarImage 
                src={BRAND.coach.avatarSrc} 
                alt={BRAND.coach.name} 
                className="object-cover"
                loading="eager" 
                decoding="async" 
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm md:text-xs font-medium">
                <Heart className="w-4 h-4 md:w-4 md:h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}

      {/* User Avatar Container - Fixed position aligned with header + button */}
      {isUser && (
        <div className={`absolute ${isMobile && !isFirstInGroup ? 'invisible' : ''} ${isMobile ? 'right-[22px]' : 'right-[30px]'} top-0 z-10`}>
          <div className="relative w-6 h-6 md:w-8 md:h-8">
            {/* Subtle glow for avatars */}
            {!isMobile && (
              <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-gradient-to-r from-pink-300 to-orange-300"></div>
            )}
            
            <Avatar className="relative z-10 shadow-lg w-6 h-6 md:w-8 md:h-8 md:border-2 md:border-white bg-gradient-to-br from-pink-400 to-orange-400">
              {userAvatarUrl ? (
                <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-orange-400 text-white text-sm md:text-xs font-medium">
                  {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4 md:w-4 md:h-4" />}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col ${
        isUser 
          ? `items-end ${isMobile ? 'mr-[52px] max-w-[calc(85%-52px)]' : 'mr-[74px] max-w-[calc(80%-74px)]'}` 
          : `items-start ${isMobile ? (isFirstInGroup ? 'max-w-[85%]' : 'max-w-[88%]') : 'max-w-[80%]'}`
      }`}>
        <div
          className={`
            transition-all duration-300 group-hover:shadow-xl px-2.5 py-1.5 md:px-3 md:py-2 rounded-2xl md:rounded-2xl
            ${isUser
              ? 'bg-white/15 md:bg-white/8 backdrop-blur-sm md:backdrop-blur-md text-white rounded-br-md md:rounded-br-lg md:border md:border-coral-400/30 md:shadow-md md:shadow-coral-400/10 md:ring-1 md:ring-coral-400/20'
              : 'bg-white/20 md:bg-white/12 backdrop-blur-sm md:backdrop-blur-md text-white rounded-bl-md md:rounded-bl-lg md:border md:border-white/25 md:shadow-lg md:shadow-black/15 md:ring-1 md:ring-white/15'
            }
          `}
        >
          <div className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap font-light">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp - Only show for last message in group */}
        {(isLastInGroup || !isMobile) && (
          <p className={`text-xs md:text-xs text-white/50 mt-1 px-1 font-light ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
});

AIChatMessage.displayName = 'AIChatMessage';

export default AIChatMessage;