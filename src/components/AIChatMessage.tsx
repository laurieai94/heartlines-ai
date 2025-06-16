
import { ChatMessage } from "@/types/AIInsights";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface AIChatMessageProps {
  message: ChatMessage;
  userAvatarUrl?: string;
  userName?: string;
}

const AIChatMessage = ({ message, userAvatarUrl, userName }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex gap-3 mb-6 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className={`w-10 h-10 ${isUser ? 'bg-gradient-to-br from-pink-400 to-coral-500' : 'bg-gradient-to-br from-purple-400 to-blue-500'}`}>
          {isUser && userAvatarUrl ? (
            <AvatarImage src={userAvatarUrl} alt={userName || 'User'} />
          ) : isUser ? (
            <AvatarFallback className="text-white border-0 text-lg font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </AvatarFallback>
          ) : (
            <AvatarImage 
              src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
              alt="Kai" 
              className="object-cover"
            />
          )}
        </Avatar>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            relative px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl
            ${isUser
              ? 'bg-gradient-to-br from-pink-500 to-coral-500 text-white rounded-br-lg'
              : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-bl-lg'
            }
          `}
        >
          {/* Message tail */}
          <div
            className={`
              absolute w-4 h-4 transform rotate-45 -z-10
              ${isUser
                ? 'bg-coral-500 right-1 bottom-1'
                : 'bg-purple-500 left-1 bottom-1'
              }
            `}
          />
          
          <div className="relative z-10">
            <div className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-gray-400 mt-2 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default AIChatMessage;
