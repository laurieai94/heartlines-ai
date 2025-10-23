
import React from 'react';

interface ChatBubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  className?: string;
  variant?: 'default' | 'kai' | 'heartlines' | 'maya';
}

const ChatBubble = ({ children, isUser = false, className = '', variant = 'default' }: ChatBubbleProps) => {
  const getVariantStyles = () => {
    if (variant === 'kai') {
      // kai's messages - burgundy-tinted glass with white outline
      return 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-white/5';
    }
    
    if (variant === 'maya') {
      // maya's messages - subtle coral/pink glass gradient to differentiate from kai
      return 'bg-gradient-to-br from-coral-400/20 to-pink-500/30 backdrop-blur-sm text-white border-2 border-coral-400/40 shadow-lg shadow-coral-400/10';
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
          ${variant === 'kai' || variant === 'maya' ? '' : isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
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
