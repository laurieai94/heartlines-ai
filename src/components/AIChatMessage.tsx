
import { ChatMessage } from "@/types/AIInsights";
import ChatBubble from "./ChatBubble";

interface AIChatMessageProps {
  message: ChatMessage;
}

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <ChatBubble isUser={isUser}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
      </ChatBubble>
      <p className="text-xs text-gray-400 mt-1 px-1">
        {message.timestamp}
      </p>
    </div>
  );
};

export default AIChatMessage;
