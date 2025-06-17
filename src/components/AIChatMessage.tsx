
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
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          {/* Subtle glow for avatars */}
          <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
            isUser ? 'bg-gradient-to-r from-pink-300 to-orange-300' : 'bg-gradient-to-r from-purple-300 to-pink-300'
          }`}></div>
          
          <Avatar className={`w-10 h-10 relative z-10 border-2 border-white shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-pink-400 to-orange-400' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            {isUser && userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName || 'User'} />
            ) : isUser ? (
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-orange-400 text-white text-sm font-medium">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage 
                  src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                  alt="Kai" 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-medium">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </div>

      {/* Enhanced Message Bubble */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 group-hover:shadow-xl
            ${isUser
              ? 'bg-gradient-to-br from-coral-400 to-pink-400 text-white rounded-br-lg shadow-coral-200/50'
              : 'bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-bl-lg border border-gray-100/50 shadow-gray-200/50'
            }
          `}
        >
          <div className="text-base leading-relaxed whitespace-pre-wrap font-light">
            {message.content}
          </div>
        </div>
        
        {/* Subtle Timestamp */}
        <p className={`text-xs text-gray-400 mt-2 px-2 font-light ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default AIChatMessage;
