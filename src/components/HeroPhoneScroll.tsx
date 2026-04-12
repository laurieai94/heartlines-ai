import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from "lucide-react";
import { Link } from 'react-router-dom';
import FlameIconHalo from './FlameIconHalo';
import { demoConversations } from '@/data/demoConversations';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import sarahAvatar from '@/assets/money-woman-avatar.png';
import mayaAvatar from '@/assets/millennial-african-american-woman.png';
import alexAvatar from '@/assets/gay-man-avatar.png';
import jordanAvatar from '@/assets/moving-in-avatar.png';
import marcusAvatar from '@/assets/new-dad-avatar.png';

const avatarMap: Record<string, string> = {
  'Sarah': sarahAvatar,
  'Maya': mayaAvatar,
  'Alex': alexAvatar,
  'Jordan': jordanAvatar,
  'Marcus': marcusAvatar,
};

// Memoized chat row to prevent avatar flicker on sibling re-renders
const ChatRow = memo(({ message, userAvatar, userName }: {
  message: typeof demoConversations[0]['messages'][0];
  userAvatar: string;
  userName: string;
}) => (
  <div className={`flex gap-2 items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
    {message.type === 'assistant' && (
      <FlameIconHalo intensity="subtle" size="sm" animated={false}>
        <img
          src={BRAND.coach.avatarSrc}
          alt={BRAND.coach.name}
          className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full object-cover flex-shrink-0"
        />
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
      <div className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-coral-400/40 flex-shrink-0">
        <img
          src={userAvatar}
          alt={userName}
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
));
ChatRow.displayName = 'ChatRow';

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
  const [isInView, setIsInView] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConversation = demoConversations[currentConversationIndex];

  // Compute user avatar once per conversation
  const userAvatar = useMemo(() => avatarMap[currentConversation.userName], [currentConversation.userName]);

  // Preload ALL critical images on mount for instant loading
  useEffect(() => {
    preloadCriticalImages([
      BRAND.coach.avatarSrc,
      BRAND.phoneLockupSrc,
      sarahAvatar,
      mayaAvatar,
      alexAvatar,
      jordanAvatar,
      marcusAvatar
    ]);
  }, []);

  // Reset when conversation changes
  useEffect(() => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
    setTypingSide(null);
    setIsLoopActive(true);
  }, [currentConversationIndex]);

  // Only start animations when component is in viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isInView]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  useEffect(() => {
    if (!isInView) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const showNextMessage = () => {
      if (currentMessageIndex >= currentConversation.messages.length) {
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
        
        const typingTime = 650 + (currentMessage.content.length * 18);
        
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
      const delay = currentConversation.messages[currentMessageIndex - 1]?.type === 'user' ? 400 : 1900;
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
  }, [currentMessageIndex, isLoopActive, currentConversation, currentConversationIndex, isInView]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {/* Floating Chat CTA Button */}
      <Link to="/signup" className="absolute top-0 right-0 z-30 transform translate-x-2 -translate-y-2 sm:translate-x-4 sm:-translate-y-4">
        <div className="relative group inline-block">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-md group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            size="sm"
            className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white p-2 sm:p-2.5 md:p-3.5 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-200 font-medium"
            style={{
              boxShadow: '0 0 30px rgba(255, 107, 157, 0.4), 0 4px 16px rgba(255, 107, 157, 0.5), 0 2px 8px rgba(255, 138, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="absolute inset-0 animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                  backgroundSize: '200% 100%'
                }}
              />
            </div>
            <MessageSquare className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </Link>

      <div className="relative flex items-start justify-center z-20 pt-4 pb-0 px-0 sm:p-2 lg:p-4">
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-radial from-white/8 via-white/3 to-transparent blur-2xl scale-110 rounded-[3rem]"></div>
          <div className="absolute inset-0 bg-white/8 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10"></div>
          
          <div 
            className="relative bg-gradient-to-br from-burgundy-900/25 to-burgundy-800/30 backdrop-blur-xl border-2 border-white/20 rounded-[2.5rem] shadow-2xl ring-2 ring-white/10 overflow-hidden transition-all duration-500 animate-scale-in flex flex-col"
            style={{
              width: 'clamp(280px, 22vw, 310px)',
              aspectRatio: '9/16'
            }}
          >
            {/* Status bar */}
            <div className="bg-burgundy-800/20 backdrop-blur-md px-6 py-0.5 flex justify-between items-center text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white/50 rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header — keep Radix Avatar here (doesn't re-render with messages) */}
            <div className="bg-gradient-to-r from-burgundy-700/15 to-burgundy-600/10 backdrop-blur-md border-b border-white/10 px-2 py-1.5 flex items-center">
              <FlameIconHalo intensity="subtle" size="sm" animated={true}>
                <Avatar className="w-9 h-9 mr-3 ring-2 ring-burgundy-400/40">
                  <AvatarImage 
                    src={BRAND.coach.avatarSrc} 
                    alt={BRAND.coach.name} 
                    loading="eager" 
                    fetchPriority="high"
                    decoding="async" 
                  />
                  <AvatarFallback delayMs={Infinity} className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white font-semibold">
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
              className="flex-1 p-2 space-y-1.5 bg-gradient-to-br from-burgundy-900/15 to-burgundy-800/20 backdrop-blur-md overflow-y-auto no-scrollbar"
              aria-live="polite"
            >
              {visibleMessages.map((message) => (
                <ChatRow
                  key={message.id}
                  message={message}
                  userAvatar={userAvatar}
                  userName={currentConversation.userName || 'You'}
                />
              ))}

              {/* Typing indicator — assistant */}
              {isTyping && typingSide === 'assistant' && (
                <div className="flex gap-2 items-end justify-start animate-fade-in" aria-live="polite">
                  <img
                    src={BRAND.coach.avatarSrc}
                    alt={BRAND.coach.name}
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-black/30 max-w-[86%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <span className="sr-only">kai is typing...</span>
                </div>
              )}

              {/* Typing indicator — user */}
              {isTyping && typingSide === 'user' && (
                <div className="flex gap-2 items-end justify-end animate-fade-in" aria-live="polite">
                  <div className="bg-gradient-to-r from-coral-400 to-pink-500 text-white shadow-lg shadow-black/30 max-w-[86%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-coral-400/40 flex-shrink-0">
                    <img
                      src={userAvatar}
                      alt={currentConversation.userName || 'You'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="sr-only">{currentConversation.userName || 'You'} is typing...</span>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="bg-gradient-to-r from-burgundy-700/20 to-burgundy-600/20 backdrop-blur-md border-t border-white/10 p-1 sm:p-1.5 md:p-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 flex items-center">
                <input 
                  type="text" 
                  placeholder={`chat with ${currentConversation.coachName || 'kai'}...`}
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-xs sm:text-sm md:text-base focus:outline-none"
                  disabled
                />
                <button className="bg-gradient-to-r from-coral-400 to-pink-500 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar indicator */}
      <div className="w-full max-w-[340px] sm:max-w-[400px] mx-auto mt-6 mb-16 sm:mb-20 md:mb-24 px-4">
        <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
          <div className="relative h-4">
            {demoConversations.map((conv, index) => {
              const segmentWidth = 100 / demoConversations.length;
              const leftPosition = segmentWidth * index;
              
              return (
                <div
                  key={`label-${conv.id}`}
                  className={`absolute text-xs sm:text-sm whitespace-nowrap transition-all duration-500 ${
                    index === currentConversationIndex 
                      ? 'text-coral-300 font-medium opacity-100' 
                      : 'text-white/50 opacity-0'
                  }`}
                  style={{
                    left: `${leftPosition}%`,
                    width: `${segmentWidth}%`,
                    textAlign: 'center',
                  }}
                >
                  {conv.title}
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-1.5">
            {demoConversations.map((conv, index) => (
              <button
                key={conv.id}
                onClick={() => {
                  setIsLoopActive(false);
                  setCurrentConversationIndex(index);
                }}
                className="flex-1 h-8 rounded-full group relative transition-all duration-500 flex items-center"
                aria-label={`View conversation ${index + 1}: ${conv.title}`}
              >
                <div className={`absolute inset-x-0 h-0.5 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                  index === currentConversationIndex 
                    ? 'bg-gradient-to-r from-coral-400 to-coral-500' 
                    : 'bg-white/20 group-hover:bg-white/40'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPhoneScroll;
