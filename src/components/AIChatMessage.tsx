
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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group mb-4`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className={`w-8 h-8 ${isUser ? 'bg-blue-500' : 'bg-purple-500'}`}>
          {isUser && userAvatarUrl ? (
            <AvatarImage src={userAvatarUrl} alt={userName || 'User'} />
          ) : isUser ? (
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage 
                src="/lovable-uploads/301e21a4-c89d-4fd5-81d2-ba6a4f2a9414.png" 
                alt="Kai" 
                className="object-cover"
              />
              <AvatarFallback className="bg-purple-500 text-white text-xs">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp */}
        <span className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default AIChatMessage;
