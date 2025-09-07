import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from "lucide-react";
import MayaAvatar from '@/assets/millennial-woman-portrait.jpg';

const DEMO_CONVERSATION = [
  {
    id: 1,
    type: 'assistant',
    content: "Hey Maya 👋 What's on your mind today?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'user',
    content: "Tbh… I feel like me + Alex keep having the same fight about texting.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'assistant',
    content: "Got it. Classic. When does it usually come up?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'user',
    content: "Mostly when I don't reply fast. He thinks I'm ignoring him.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 5,
    type: 'assistant',
    content: "So it's less about the text, more about feeling unseen.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 6,
    type: 'user',
    content: "Yeah… that hits.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 7,
    type: 'assistant',
    content: 'One move you could try: agree on a "no-stress" text window. Like, "I\'ll get back to you in a few hours, but I\'m not ghosting."',
    timestamp: new Date().toISOString(),
  },
  {
    id: 8,
    type: 'user',
    content: "That actually sounds doable.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 9,
    type: 'assistant',
    content: "Want me to draft a sample text you could send him?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 10,
    type: 'user',
    content: "Yes pls 🙏",
    timestamp: new Date().toISOString(),
  }
];


interface HeroPhoneScrollProps {
  className?: string;
  style?: React.CSSProperties;
}

const HeroPhoneScroll: React.FC<HeroPhoneScrollProps> = ({ className = '', style }) => {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_CONVERSATION>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSide, setTypingSide] = useState<'assistant' | 'user' | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const showNextMessage = () => {
      if (currentMessageIndex >= DEMO_CONVERSATION.length) {
        // Reset after 3 seconds to loop the conversation
        timeoutId = setTimeout(() => {
          setVisibleMessages([]);
          setCurrentMessageIndex(0);
          setIsTyping(false);
          setTypingSide(null);
        }, 3000);
        return;
      }
      
      const currentMessage = DEMO_CONVERSATION[currentMessageIndex];
      
      // Show current message
      if (currentMessage.type === 'assistant') {
        // Show typing indicator first for assistant messages
        setIsTyping(true);
        setTypingSide('assistant');
        
        // Variable typing time for more natural feel - slower for demo
        const typingTime = 2800 + (currentMessage.content.length * 55);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTypingSide(null);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingTime);
      } else {
        // Show user typing first, then message
        setIsTyping(true);
        setTypingSide('user');
        
        // Shorter, natural delay for user messages
        const typingTime = Math.min(Math.max(600 + (currentMessage.content.length * 15), 500), 1200);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTypingSide(null);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingTime);
      }
    };

    // Start animation or continue with next message
    if (currentMessageIndex === 0) {
      timeoutId = setTimeout(showNextMessage, 1500);
    } else if (currentMessageIndex < DEMO_CONVERSATION.length) {
      const delay = DEMO_CONVERSATION[currentMessageIndex - 1]?.type === 'user' ? 1400 : 3200;
      timeoutId = setTimeout(showNextMessage, delay);
    } else {
      // All messages shown, reset after delay
      timeoutId = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentMessageIndex(0);
        setIsTyping(false);
        setTypingSide(null);
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentMessageIndex]);

  return (
    <div className={`relative ${className}`} style={style}>

      {/* Phone container - positioned to align with hero text */}
      <div className="relative flex items-start justify-center z-20 p-2 sm:p-4 lg:p-6">
        {/* Phone mockup with glassmorphism and proportional sizing */}
        <div className="relative animate-fade-in max-[640px]:scale-[0.94] max-[560px]:scale-[0.90] max-[480px]:scale-[0.85]" style={{ animationDelay: '0.4s' }}>
          {/* Subtle halo behind phone */}
          <div className="absolute inset-0 bg-gradient-radial from-white/8 via-white/3 to-transparent blur-2xl scale-110 rounded-[3rem]"></div>
          
          {/* Enhanced glassmorphic outer shell */}
          <div className="absolute inset-0 bg-white/8 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10"></div>
          
          {/* Phone container with enhanced definition */}
          <div 
            className="relative bg-burgundy-900 border-2 border-white/20 rounded-[2.5rem] shadow-2xl ring-2 ring-white/10 overflow-hidden transition-all duration-500 animate-scale-in flex flex-col"
            style={{
              width: 'clamp(260px, min(55vw, min(75svh, 75dvh) * 9/16), 300px)',
              aspectRatio: '9/16',
              maxHeight: 'min(85svh, 85dvh)',
              animationDelay: '0.6s'
            }}
          >
            {/* Status bar */}
            <div className="bg-burgundy-800 px-6 py-1 flex justify-between items-center text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white/50 rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header with Kai styling */}
            <div className="bg-gradient-to-r from-burgundy-700/30 to-burgundy-600/20 backdrop-blur-md border-b border-white/10 px-2 py-2 flex items-center">
              <Avatar className="w-9 h-9 mr-3 ring-2 ring-burgundy-400/40">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" fetchPriority="high" />
                <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white font-semibold">
                  <Heart className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold text-sm">{BRAND.coach.name}</h3>
                <p className="text-white/70 text-xs">Your AI relationship coach</p>
              </div>
            </div>

            {/* Messages area - fills remaining phone space */}
            <div 
              ref={messagesRef}
              className="flex-1 p-2 space-y-1.5 bg-gradient-to-br from-burgundy-900/40 to-burgundy-800/40 backdrop-blur-sm overflow-y-auto no-scrollbar"
              aria-live="polite"
            >
              {visibleMessages.map((message, index) => (
                <div key={message.id} className={`flex gap-2 items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                   <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" fetchPriority="high" />
                      <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white text-xs">
                        <Heart className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
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
                       <AvatarImage src={MayaAvatar} alt="Maya" />
                       <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white text-xs">
                         M
                       </AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}

              {/* Typing indicators */}
              {isTyping && typingSide === 'assistant' && (
                <div className="flex gap-2 items-end justify-start animate-fade-in" aria-live="polite">
                  <Avatar className="w-6 h-6 flex-shrink-0">
                     <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} loading="eager" decoding="async" fetchPriority="high" />
                     <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white text-xs">
                       <Heart className="w-3 h-3" />
                     </AvatarFallback>
                   </Avatar>
                  <div className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-black/30 max-w-[86%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed">
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
                  <div className="bg-gradient-to-r from-coral-400 to-pink-500 text-white shadow-lg shadow-black/30 max-w-[86%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                   <Avatar className="w-6 h-6 flex-shrink-0 ring-2 ring-coral-400/40">
                     <AvatarImage src={MayaAvatar} alt="Maya" />
                     <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white text-xs">
                       M
                     </AvatarFallback>
                   </Avatar>
                  <span className="sr-only">Maya is typing...</span>
                </div>
              )}
            </div>

            {/* Input area with Kai styling */}
            <div className="bg-gradient-to-r from-burgundy-700/20 to-burgundy-600/20 backdrop-blur-md border-t border-white/10 p-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1.5 flex items-center">
                <input 
                  type="text" 
                  placeholder="Chat with Kai..." 
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
    </div>
  );
};

export default HeroPhoneScroll;