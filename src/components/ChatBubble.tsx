
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
              ? 'bg-white/5 backdrop-blur-md text-white border border-coral-400/30 rounded-br-sm shadow-md shadow-coral-400/10 ring-1 ring-coral-400/20'
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
