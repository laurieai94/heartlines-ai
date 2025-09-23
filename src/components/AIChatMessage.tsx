import React, { memo } from "react";
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Heart } from "lucide-react";
import ReminderButton from "./chat/ReminderButton";
import { BRAND } from "@/branding";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const AIChatMessage = memo(({ message, userAvatarUrl, userName, isFirstInGroup = true, isLastInGroup = true }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  const isMobile = useIsMobile();
  
  // Format time to show only hours and minutes
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Extract reminder suggestion from AI message
  const extractReminderSuggestion = (content: string) => {
    const reminderMatch = content.match(/\[REMINDER_SUGGESTION:\s*([^\]]+)\]/);
    if (reminderMatch) {
      const suggestionText = reminderMatch[1].trim();
      const cleanedContent = content.replace(/\[REMINDER_SUGGESTION:[^\]]+\]/, '').trim();
      return { suggestionText, cleanedContent };
    }
    return { suggestionText: null, cleanedContent: content };
  };

  const { suggestionText, cleanedContent } = !isUser ? extractReminderSuggestion(message.content) : { suggestionText: null, cleanedContent: message.content };
  
  return (
    <div 
      className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-3' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
      role="listitem"
      aria-label={`${isUser ? (userName || 'User') : 'Kai'} message at ${formatTime(message.timestamp)}`}
    >
      {/* Avatar Container - Show only for first message in group on mobile */}
      <div className="flex-shrink-0">
        <div className={`relative w-6 h-6 md:w-8 md:h-8 ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
          {/* Subtle glow for avatars */}
          {!isMobile && (
            <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
              isUser ? 'bg-gradient-to-r from-pink-300 to-orange-300' : 'bg-gradient-to-r from-purple-300 to-pink-300'
            }`}></div>
          )}
          
          <Avatar className={`relative z-10 shadow-lg w-6 h-6 md:w-8 md:h-8 md:border-2 md:border-white ${
            isUser 
              ? 'bg-gradient-to-br from-pink-400 to-orange-400' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
            ) : isUser ? (
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-orange-400 text-white text-sm md:text-xs font-medium">
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
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm md:text-xs font-medium">
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
            ${isUser
              ? 'px-2.5 py-1.5 md:px-3 md:py-2 bg-white/15 md:bg-white/8 backdrop-blur-sm md:backdrop-blur-md text-white rounded-2xl md:rounded-2xl rounded-br-md md:rounded-br-lg md:border md:border-coral-400/30 md:shadow-md md:shadow-coral-400/10 md:ring-1 md:ring-coral-400/20'
              : 'text-white'
            }
          `}
        >
          <div className="text-sm md:text-sm leading-relaxed whitespace-pre-wrap font-light">
            {cleanedContent}
          </div>
        </div>
        
        {/* Reminder Button for AI messages with suggestions */}
        {!isUser && suggestionText && (
          <div className="mt-1 ml-2">
            <ReminderButton 
              suggestedText={suggestionText} 
              messageId={message.id}
            />
          </div>
        )}
        
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