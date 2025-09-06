
import React from 'react';

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
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
              : 'bg-white text-gray-800 shadow-lg border border-gray-100'
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
