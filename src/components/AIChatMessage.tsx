
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
    </ChatBubble>
  );
};

export default AIChatMessage;
