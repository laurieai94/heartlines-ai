
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
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Smaller Avatar */}
      <div className="flex-shrink-0">
        <Avatar className={`w-8 h-8 ${
          isUser 
            ? 'bg-gradient-to-br from-pink-400 to-orange-400' 
            : 'bg-gradient-to-br from-purple-500 to-blue-500'
        }`}>
          {isUser && userAvatarUrl ? (
            <AvatarImage src={userAvatarUrl} alt={userName || 'User'} />
          ) : isUser ? (
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-orange-400 text-white text-sm font-medium">
              {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage 
                src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                alt="Kai" 
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-medium">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </div>

      {/* Clean Message Bubble */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${isUser
              ? 'bg-purple-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }
          `}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
        
        {/* Minimal Timestamp */}
        <p className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default AIChatMessage;
