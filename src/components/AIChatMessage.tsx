
import { ChatMessage } from "@/types/AIInsights";
import ChatBubble from "./ChatBubble";

interface AIChatMessageProps {
  message: ChatMessage;
}

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <ChatBubble isUser={isUser}>
      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
      <p className={`text-xs mt-2 ${
        isUser ? 'text-pink-100' : 'text-pink-500'
      }`}>
        {message.timestamp}
      </p>
    </ChatBubble>
  );
};

export default AIChatMessage;
