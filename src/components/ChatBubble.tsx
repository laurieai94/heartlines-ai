
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
            ? 'bg-gradient-to-r from-coral-400 to-coral-500 text-white rounded-br-md'
            : 'bg-white/90 text-gray-800 border border-coral-100 rounded-bl-md'
          }
          ${className}
        `}
        style={{
          boxShadow: isUser 
            ? '0 4px 15px rgba(255, 127, 80, 0.3)' 
            : '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
