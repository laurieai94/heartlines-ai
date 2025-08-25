
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import ReminderButton from "./chat/ReminderButton";
import { BRAND } from "@/branding";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
}

const AIChatMessage = ({ message, userAvatarUrl, userName }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  
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
    <div className={`flex gap-4 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar Container - Fixed sizing */}
      <div className="flex-shrink-0">
        <div className="relative w-10 h-10">
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
            isUser ? 'bg-gradient-to-r from-pink-300 to-orange-300' : 'bg-gradient-to-r from-purple-300 to-pink-300'
          }`}></div>
          
          <Avatar className={`w-10 h-10 relative z-10 border-2 border-white shadow-lg overflow-visible ${
            isUser 
              ? 'bg-gradient-to-br from-pink-400 to-orange-400' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} className="object-cover" />
            ) : isUser ? (
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-orange-400 text-white text-xs font-medium">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage 
                  src={BRAND.coach.avatarSrc} 
                  alt={BRAND.coach.name} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-medium">
                  <Bot className="w-6 h-6" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-4 py-3 rounded-3xl transition-all duration-300 group-hover:shadow-xl
            ${isUser
              ? 'bg-gradient-to-br from-coral-400 to-pink-400 text-white rounded-br-lg shadow-coral-200/50'
              : 'bg-gradient-to-br from-orange-50 to-peach-50 text-gray-800 rounded-bl-lg border border-orange-100/60 shadow-lg'
            }
          `}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap font-light">
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
        
        {/* Timestamp */}
        <p className={`text-xs text-gray-400 mt-1 px-1 font-light ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default AIChatMessage;
