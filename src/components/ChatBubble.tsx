
interface ChatBubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  className?: string;
}

const ChatBubble = ({ children, isUser = false, className = '' }: ChatBubbleProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${isUser
            ? 'bg-gradient-to-r from-pink-500 to-coral-500 text-white rounded-br-sm'
            : 'bg-white/95 text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
          }
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
