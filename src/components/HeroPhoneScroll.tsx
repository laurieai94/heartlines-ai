import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from "lucide-react";
import MayaAvatar from '@/assets/millennial-african-american-woman.png';
import AlexAvatar from '@/assets/gay-man-avatar.png';
import SarahAvatar from '@/assets/money-woman-avatar.png';
import JordanAvatar from '@/assets/moving-in-avatar.png';
import MarcusAvatar from '@/assets/new-dad-avatar.png';
import FlameIconHalo from './FlameIconHalo';
import { demoConversations } from '@/data/demoConversations';

interface HeroPhoneScrollProps {
  className?: string;
  style?: React.CSSProperties;
}

const HeroPhoneScroll: React.FC<HeroPhoneScrollProps> = ({ className = '', style }) => {
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<typeof demoConversations[0]['messages']>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSide, setTypingSide] = useState<'assistant' | 'user' | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isLoopActive, setIsLoopActive] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const currentConversation = demoConversations[currentConversationIndex];
  
  // Get the appropriate avatar based on userName
  const getUserAvatar = () => {
    if (currentConversation.userName === 'Sarah') return SarahAvatar;
    if (currentConversation.userName === 'Maya') return MayaAvatar;
    if (currentConversation.userName === 'Alex') return AlexAvatar;
    if (currentConversation.userName === 'Jordan') return JordanAvatar;
    if (currentConversation.userName === 'Marcus') return MarcusAvatar;
    return undefined; // No avatar for generic "You"
  };

  // Reset when conversation changes
  useEffect(() => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
    setTypingSide(null);
    setIsLoopActive(true);
  }, [currentConversationIndex]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const showNextMessage = () => {
      if (currentMessageIndex >= currentConversation.messages.length) {
        // Reset and cycle to next conversation after 6 seconds
        timeoutId = setTimeout(() => {
          setVisibleMessages([]);
          setCurrentMessageIndex(0);
          setIsTyping(false);
          setIsLoopActive(false);
          setCurrentConversationIndex(prev => 
            prev === demoConversations.length - 1 ? 0 : prev + 1
          );
        }, 6000);
        return;
      }
      
      const currentMessage = currentConversation.messages[currentMessageIndex];
      
      if (currentMessage.type === 'assistant') {
        setIsTyping(true);
        setTypingSide('assistant');
        
        const typingTime = 1400 + (currentMessage.content.length * 28);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTypingSide(null);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingTime);
      } else {
        setIsTyping(true);
        setTypingSide('user');
        
        const typingTime = Math.min(Math.max(400 + (currentMessage.content.length * 10), 400), 700);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTypingSide(null);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingTime);
      }
    };

    if (!isLoopActive) {
      timeoutId = setTimeout(() => {
        setIsLoopActive(true);
        showNextMessage();
      }, 2000);
    } else if (currentMessageIndex === 0) {
      timeoutId = setTimeout(showNextMessage, 800);
    } else if (currentMessageIndex < currentConversation.messages.length) {
      const delay = currentConversation.messages[currentMessageIndex - 1]?.type === 'user' ? 1000 : 1900;
      timeoutId = setTimeout(showNextMessage, delay);
    } else {
      timeoutId = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentMessageIndex(0);
        setIsTyping(false);
        setTypingSide(null);
        setCurrentConversationIndex(prev => 
          prev === demoConversations.length - 1 ? 0 : prev + 1
        );
      }, 6000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentMessageIndex, isLoopActive, currentConversation, currentConversationIndex]);

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="relative flex items-start justify-center z-20 pt-8 pb-0 px-4 sm:p-2 lg:p-4">
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-radial from-white/8 via-white/3 to-transparent blur-2xl scale-110 rounded-[3rem]"></div>
          
          <div className="absolute inset-0 bg-white/8 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10"></div>
          
          <div 
            className="relative bg-burgundy-900 border-2 border-white/20 rounded-[2.5rem] shadow-2xl ring-2 ring-white/10 overflow-hidden transition-all duration-500 animate-scale-in flex flex-col"
            style={{
              width: 'clamp(280px, 85vw, 340px)',
              aspectRatio: '9/16',
              maxHeight: 'clamp(500px, 75vh, 620px)'
            }}
          >
            {/* Status bar */}
            <div className="bg-burgundy-800 px-6 py-0.5 flex justify-between items-center text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white/50 rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header */}
            <div className="bg-gradient-to-r from-burgundy-700/30 to-burgundy-600/20 backdrop-blur-md border-b border-white/10 px-2 py-1.5 flex items-center">
              <FlameIconHalo intensity="subtle" size="sm" animated={true}>
                <Avatar className="w-8 h-8 mr-2 ring-2 ring-burgundy-400/40">
                  <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" />
                  <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white font-semibold">
                    <Heart className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </FlameIconHalo>
              <div>
                <h3 className="text-white font-semibold text-sm">{currentConversation.coachName || BRAND.coach.name}</h3>
                <p className="text-white/70 text-xs">{currentConversation.theme}</p>
              </div>
            </div>

            {/* Messages area */}
            <div 
              ref={messagesRef}
              className="flex-1 p-1.5 space-y-1 bg-gradient-to-br from-burgundy-900/40 to-burgundy-800/40 backdrop-blur-sm overflow-y-auto no-scrollbar"
              aria-live="polite"
            >
              {visibleMessages.map((message) => (
                <div key={message.id} className={`flex gap-2 items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                   <FlameIconHalo intensity="subtle" size="sm" animated={false}>
                     <Avatar className="w-6 h-6 flex-shrink-0">
                       <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" />
                       <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white text-xs">
                         <Heart className="w-3 h-3" />
                       </AvatarFallback>
                     </Avatar>
                   </FlameIconHalo>
                  )}
                   <ChatBubble 
                     isUser={message.type === 'user'} 
                     variant={message.type === 'user' ? 'maya' : 'kai'} 
                     className="animate-fade-in max-w-[86%]"
                   >
                     {message.content}
                   </ChatBubble>
                   {message.type === 'user' && (
                     <Avatar className="w-6 h-6 flex-shrink-0 ring-2 ring-coral-400/40">
                       <AvatarImage src={getUserAvatar()} alt={currentConversation.userName || 'You'} />
                       <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white text-xs">
                         {currentConversation.userName?.[0] || 'Y'}
                       </AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}

              {/* Typing indicators */}
              {isTyping && typingSide === 'assistant' && (
                <div className="flex gap-2 items-end justify-start animate-fade-in" aria-live="polite">
                  <Avatar className="w-6 h-6 flex-shrink-0">
                     <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" />
                     <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white text-xs">
                       <Heart className="w-3 h-3" />
                     </AvatarFallback>
                   </Avatar>
                  <div className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-black/30 max-w-[86%] px-2.5 py-2 rounded-2xl text-[13px] leading-snug">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <span className="sr-only">Kai is typing...</span>
                </div>
              )}

              {isTyping && typingSide === 'user' && (
                <div className="flex gap-2 items-end justify-end animate-fade-in" aria-live="polite">
                  <div className="bg-gradient-to-r from-coral-400 to-pink-500 text-white shadow-lg shadow-black/30 max-w-[86%] px-2.5 py-2 rounded-2xl text-[13px] leading-snug">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                   <Avatar className="w-6 h-6 flex-shrink-0 ring-2 ring-coral-400/40">
                     <AvatarImage src={getUserAvatar()} alt={currentConversation.userName || 'You'} />
                     <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white text-xs">
                       {currentConversation.userName?.[0] || 'Y'}
                     </AvatarFallback>
                   </Avatar>
                  <span className="sr-only">{currentConversation.userName || 'You'} is typing...</span>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="bg-gradient-to-r from-burgundy-700/20 to-burgundy-600/20 backdrop-blur-md border-t border-white/10 p-1.5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 flex items-center">
                <input 
                  type="text" 
                  placeholder={`Chat with ${currentConversation.coachName || 'Kai'}...`}
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                  disabled
                />
                <button className="bg-gradient-to-r from-coral-400 to-pink-500 w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar indicator */}
      <div className="w-full max-w-[280px] sm:max-w-[340px] mx-auto mt-4 mb-8 sm:mb-12 px-4">
        <div className="flex gap-1">
          {demoConversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => {
                setIsLoopActive(false);
                setCurrentConversationIndex(index);
              }}
              className="flex-1 group"
              aria-label={`View conversation ${index + 1}: ${conv.title}`}
            >
              <div className={`h-1 rounded-full transition-all duration-500 ${
                index === currentConversationIndex 
                  ? 'bg-gradient-to-r from-coral-400 to-coral-500 shadow-lg shadow-coral-400/30' 
                  : 'bg-white/20 group-hover:bg-white/40'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPhoneScroll;
