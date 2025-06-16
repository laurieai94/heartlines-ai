
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
          max-w-[80%] p-4 rounded-2xl shadow-lg backdrop-blur-sm
          ${isUser
            ? 'bg-gradient-to-r from-pink-400 to-coral-500 text-white rounded-br-md'
            : 'bg-white/90 text-gray-800 border border-pink-100 rounded-bl-md'
          }
          ${className}
        `}
        style={{
          boxShadow: isUser 
            ? '0 4px 15px rgba(236, 72, 153, 0.3)' 
            : '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
