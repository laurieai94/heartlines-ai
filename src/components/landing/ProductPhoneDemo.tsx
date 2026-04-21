import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Info, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import ChatBubble from '../chat/ChatBubble';
import { BRAND } from '@/branding';
import FlameBackground from '../brand/FlameBackground';
import FlameIconHalo from '../brand/FlameIconHalo';
import { demoConversations } from '@/data/demoConversations';

interface ProductPhoneDemoProps {
  className?: string;
  style?: React.CSSProperties;
  videoUrl?: string;
}

const ProductPhoneDemo = ({ className = '', style, videoUrl }: ProductPhoneDemoProps) => {
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<typeof demoConversations[0]['messages']>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentConversation = demoConversations[currentConversationIndex];

  // Reset animation when conversation changes
  useEffect(() => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsTyping(false);
    setIsTransitioning(false);
  }, [currentConversationIndex]);

  useEffect(() => {
    if (currentIndex >= currentConversation.messages.length) {
      setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
        setIsTyping(false);
      }, 3000);
      return;
    }

    const currentMessage = currentConversation.messages[currentIndex];
    const isAIMessage = currentMessage.type === 'assistant';
    
    const delay = currentIndex === 0 ? 1000 : (isAIMessage ? 1500 : 1800);
    
    const timer = setTimeout(() => {
      if (isAIMessage) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentIndex(prev => prev + 1);
        }, 800);
      } else {
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, visibleMessages.length, currentConversation]);

  const handlePrevConversation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentConversationIndex(prev => 
        prev === 0 ? demoConversations.length - 1 : prev - 1
      );
    }, 200);
  };

  const handleNextConversation = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentConversationIndex(prev => 
        prev === demoConversations.length - 1 ? 0 : prev + 1
      );
    }, 200);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <FlameBackground variant="ethereal" density="sparse" className="rounded-[3rem]" />
      
      <div className="absolute inset-0 mx-auto w-[300px] h-[600px] bg-gradient-radial from-white/6 via-white/2 to-transparent blur-3xl scale-110 rounded-[3rem]"></div>
      
      {/* Navigation and phone container */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous button */}
        <button
          onClick={handlePrevConversation}
          className="flex-shrink-0 p-2.5 rounded-full bg-burgundy-600/80 hover:bg-burgundy-600 text-white transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/10"
          aria-label="Previous conversation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Phone Frame */}
        <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-white/15 shadow-2xl ring-2 ring-white/8 overflow-hidden">
          <div className={`relative w-full h-full bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-coral-900 overflow-hidden transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            
            {/* Chat Header */}
            <div className="relative z-10 px-4 py-4 border-b border-white/10 backdrop-blur-sm bg-burgundy-800/35">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlameIconHalo intensity="medium" size="sm" animated={true}>
                    <div className="relative">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                        <AvatarImage src={BRAND.coach.avatarSrc} alt="kai" className="object-cover" loading="eager" decoding="async" fetchPriority="high" />
                        <AvatarFallback delayMs={Infinity} className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          <Heart className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  </FlameIconHalo>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{currentConversation.coachName || 'kai'}</h3>
                    <p className="text-white/70 text-xs">{currentConversation.theme}</p>
                  </div>
                </div>
                <Info className="w-5 h-5 text-white/50" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 px-4 py-4 space-y-3 h-[450px] overflow-y-auto">
              {visibleMessages.map((message) => (
                <div key={message.id} className="animate-fade-in">
                  <div className={`flex gap-2 items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'assistant' && (
                      <FlameIconHalo intensity="subtle" size="sm" animated={false}>
                        <img
                          src={BRAND.coach.avatarSrc}
                          alt={BRAND.coach.name}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md"
                        />
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
                      <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-br from-coral-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md">
                        {currentConversation.userName?.[0] || 'M'}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-white/40 mt-1 ${message.type === 'user' ? 'text-right mr-8' : 'text-left ml-8'}`}>
                    {message.timestamp}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2 items-end animate-fade-in">
                  <img
                    src={BRAND.coach.avatarSrc}
                    alt={BRAND.coach.name}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md"
                  />
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
                  <div className="text-white/50 text-sm">chat with {currentConversation.coachName || 'kai'}</div>
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

        {/* Next button */}
        <button
          onClick={handleNextConversation}
          className="flex-shrink-0 p-2.5 rounded-full bg-burgundy-600/80 hover:bg-burgundy-600 text-white transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm border border-white/10"
          aria-label="Next conversation"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {demoConversations.map((conv, index) => (
          <button
            key={conv.id}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => setCurrentConversationIndex(index), 200);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentConversationIndex 
                ? 'w-8 bg-coral-400' 
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`View conversation ${index + 1}: ${conv.title}`}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-burgundy-400/30 to-transparent rounded-full blur-xl animate-float"></div>
      <div className="absolute -bottom-12 -right-8 w-20 h-20 bg-gradient-to-br from-coral-400/20 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default ProductPhoneDemo;
