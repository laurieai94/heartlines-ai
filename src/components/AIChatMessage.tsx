import React from "react";
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import ReminderButton from "./chat/ReminderButton";
import ChatBubble from "./ChatBubble";
import { BRAND } from "@/branding";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const AIChatMessage = ({ message, userAvatarUrl, userName, isFirstInGroup = true, isLastInGroup = true }: AIChatMessageProps) => {
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
      className={`flex ${isMobile ? 'gap-3' : 'gap-3'} ${isMobile ? (isLastInGroup ? 'mb-4' : 'mb-1') : 'mb-2 md:mb-3'} ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
      role="listitem"
      aria-label={`${isUser ? (userName || 'User') : 'Kai'} message at ${formatTime(message.timestamp)}`}
    >
      {/* Avatar Container - Show only for first message in group */}
      <div className="flex-shrink-0">
        <div className={`relative ${isMobile ? 'w-8 h-8' : 'w-8 h-8'} ${isMobile && !isFirstInGroup ? 'invisible' : ''}`}>
          <Avatar className={`shadow-lg ${isMobile ? 'w-8 h-8' : 'w-8 h-8'} ${
            isUser 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : 'bg-gradient-to-br from-gray-600 to-gray-700'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
            ) : isUser ? (
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage 
                  src={BRAND.coach.avatarSrc} 
                  alt={BRAND.coach.name} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white text-sm font-medium">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1`}>
        <ChatBubble
          isUser={isUser}
          className={[
            'animate-fade-in',
            isMobile ? 'max-w-[75%]' : 'max-w-[80%]',
          ].filter(Boolean).join(' ')}
        >
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {cleanedContent}
          </div>
        </ChatBubble>
        
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
          <p className={`text-xs text-gray-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChatMessage;