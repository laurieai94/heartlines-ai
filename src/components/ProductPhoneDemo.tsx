import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Info, Heart } from "lucide-react";
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import FlameBackground from './FlameBackground';
import FlameIconHalo from './FlameIconHalo';

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
      {/* Flame Background */}
      <FlameBackground variant="ethereal" density="sparse" className="rounded-[3rem]" />
      
      {/* Subtle halo behind phone */}
      <div className="absolute inset-0 mx-auto w-[300px] h-[600px] bg-gradient-radial from-white/6 via-white/2 to-transparent blur-3xl scale-110 rounded-[3rem]"></div>
      
      {/* Enhanced Phone Frame */}
      <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-white/15 shadow-2xl ring-2 ring-white/8 overflow-hidden">
        {/* Phone Screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-coral-900 overflow-hidden">
          
          {/* Chat Header */}
          <div className="relative z-10 px-4 py-4 border-b border-white/10 backdrop-blur-sm bg-burgundy-800/35">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FlameIconHalo intensity="medium" size="sm" animated={true}>
                  <div className="relative">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                      <AvatarImage src={BRAND.coach.avatarSrc} alt="Kai" className="object-cover" loading="eager" decoding="async" fetchPriority="high" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Heart className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </FlameIconHalo>
                <div>
                  <h3 className="text-white font-semibold text-sm">Kai</h3>
                  <p className="text-white/70 text-xs">Online</p>
                </div>
              </div>
              <Info className="w-5 h-5 text-white/50" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 px-4 py-4 space-y-3 h-[450px] overflow-y-auto">
            {visibleMessages.map((message, index) => (
              <div key={message.id} className="animate-fade-in">
                <div className={`flex gap-2 items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                    <FlameIconHalo intensity="subtle" size="sm" animated={false}>
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" fetchPriority="high" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                          <Heart className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    </FlameIconHalo>
                  )}
                  <ChatBubble
                    isUser={message.type === 'user'}
                    variant="kai"
                    className="text-sm leading-relaxed max-w-[86%]"
                  >
                    {message.content}
                  </ChatBubble>
                  {message.type === 'user' && (
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white text-xs">
                        M
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className={`text-xs text-white/40 mt-1 ${message.type === 'user' ? 'text-right mr-8' : 'text-left ml-8'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end animate-fade-in">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" fetchPriority="high" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    <Heart className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-purple-600/90 backdrop-blur-sm px-4 py-3 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-900/20">
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
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2.5 border border-white/20">
                <div className="text-white/50 text-sm">Chat with Kai</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-coral-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative glow effects */}
          <div className="absolute top-20 left-4 w-32 h-32 bg-burgundy-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-4 w-28 h-28 bg-coral-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Phone Details */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-600 rounded-full"></div>
        <div className="absolute top-6 right-4 w-2 h-2 bg-gray-700 rounded-full"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-burgundy-400/30 to-transparent rounded-full blur-xl animate-float"></div>
      <div className="absolute -bottom-12 -right-8 w-20 h-20 bg-gradient-to-br from-coral-400/20 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default ProductPhoneDemo;