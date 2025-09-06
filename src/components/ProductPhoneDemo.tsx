import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';

const DEMO_CONVERSATION = [
  {
    id: 1,
    type: 'user' as const,
    content: "I had a really frustrating conversation with my partner today...",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'assistant' as const,
    content: "I'm sorry to hear that. It sounds like you're feeling frustrated. Can you tell me what happened?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'user' as const,
    content: "They just shut down and wouldn't talk to me about our weekend plans",
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'assistant' as const,
    content: "That must feel isolating when they withdraw like that. Based on your partner's communication style, they might need some processing time before discussing plans. Have you tried giving them space first, then approaching with a specific question rather than an open-ended conversation?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 5,
    type: 'user' as const,
    content: "That actually makes sense... I never thought about their processing style",
    timestamp: new Date().toISOString(),
  },
  {
    id: 6,
    type: 'assistant' as const,
    content: "Exactly! Understanding each other's communication patterns can transform these moments. Try texting them: \"When you're ready, could we pick a time this week to plan Saturday?\" This gives them control over timing while still moving forward.",
    timestamp: new Date().toISOString(),
  }
];

interface ProductPhoneDemoProps {
  className?: string;
  style?: React.CSSProperties;
  videoUrl?: string; // Optional video URL for custom demo content
}

const ProductPhoneDemo = ({ className = '', style, videoUrl }: ProductPhoneDemoProps) => {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_CONVERSATION>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= DEMO_CONVERSATION.length) {
      // Reset after all messages shown
      setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
        setIsTyping(false);
      }, 3000);
      return;
    }

    const currentMessage = DEMO_CONVERSATION[currentIndex];
    const isAIMessage = currentMessage.type === 'assistant';
    
    // Timing for messages
    const delay = currentIndex === 0 ? 1000 : (isAIMessage ? 2500 : 1800);
    
    const timer = setTimeout(() => {
      if (isAIMessage) {
        // Show typing indicator first
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentIndex(prev => prev + 1);
        }, 1200);
      } else {
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, visibleMessages.length]);

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Phone Frame */}
      <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
        {/* Phone Screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
          
          {/* Chat Header */}
          <div className="relative z-10 px-4 py-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Bot className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold text-sm">{BRAND.coach.name}</h3>
                <p className="text-white/70 text-xs">Your AI relationship coach</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 px-4 py-4 space-y-4 h-[420px] overflow-y-auto">
            {visibleMessages.map((message) => (
              <ChatBubble
                key={message.id}
                isUser={message.type === 'user'}
                className="animate-fade-in text-sm leading-relaxed"
              >
                {message.content}
              </ChatBubble>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 items-end animate-fade-in">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="text-white/50 text-sm">How can Kai help you today?</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative glow effects */}
          <div className="absolute top-20 left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-4 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Phone Details */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-600 rounded-full"></div>
        <div className="absolute top-6 right-4 w-2 h-2 bg-gray-700 rounded-full"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-coral-400/30 to-transparent rounded-full blur-xl animate-float"></div>
      <div className="absolute -bottom-12 -right-8 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default ProductPhoneDemo;