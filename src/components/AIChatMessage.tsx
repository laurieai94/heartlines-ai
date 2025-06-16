
import { ChatMessage } from "@/types/AIInsights";

interface AIChatMessageProps {
  message: ChatMessage;
}

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
        <p className={`text-xs mt-2 ${
          message.type === 'user' ? 'text-coral-100' : 'text-gray-500'
        }`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default AIChatMessage;
