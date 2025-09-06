
import React from 'react';

interface ChatBubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  className?: string;
  variant?: 'default' | 'kai' | 'heartlines';
}

const ChatBubble = ({ children, isUser = false, className = '', variant = 'default' }: ChatBubbleProps) => {
  const getVariantStyles = () => {
    if (variant === 'kai') {
      // Both user and assistant bubbles are purple with white outline for Kai
      return 'bg-purple-600/90 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-purple-900/20';
    }
    
    if (variant === 'heartlines') {
      // Solid burgundy bubbles with Heartlines palette
      return isUser
        ? 'bg-burgundy-600 text-white shadow-lg'
        : 'bg-burgundy-700 text-white shadow-lg';
    }
    
    // Default variant
    return isUser
      ? 'bg-white/5 backdrop-blur-md text-white border border-coral-400/30 rounded-br-sm shadow-md shadow-coral-400/10 ring-1 ring-coral-400/20'
      : 'bg-white/95 text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm';
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed
          ${variant === 'kai' ? '' : isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
          ${getVariantStyles()}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
