import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        // Reset after 2.5 seconds to loop the conversation
        timeoutId = setTimeout(() => {
          setVisibleMessages([]);
          setCurrentMessageIndex(0);
          setIsTyping(false);
        }, 2500);
        return;
      }
      
      const currentMessage = DEMO_CONVERSATION[currentMessageIndex];
      
      // Show current message
      if (currentMessage.type === 'assistant') {
        // Show typing indicator first for assistant messages
        setIsTyping(true);
        
        // Variable typing time for more natural feel
        const typingTime = 1200 + (currentMessage.content.length * 20);
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
        }, typingTime);
      } else {
        // Show user messages instantly (they're already typed)
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentMessageIndex(prev => prev + 1);
      }
    };

    // Start animation or continue with next message
    if (currentMessageIndex === 0) {
      timeoutId = setTimeout(showNextMessage, 800);
    } else if (currentMessageIndex < DEMO_CONVERSATION.length) {
      const delay = DEMO_CONVERSATION[currentMessageIndex - 1]?.type === 'user' ? 600 : 1500;
      timeoutId = setTimeout(showNextMessage, delay);
    } else {
      // All messages shown, reset after delay
      timeoutId = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentMessageIndex(0);
        setIsTyping(false);
      }, 2500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentMessageIndex]);

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Phone container - full area focused on chat */}
      <div className="relative flex items-center justify-center z-20">
        {/* Phone mockup with glassmorphism and proportional sizing */}
        <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Glassmorphic outer shell */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl ring-1 ring-white/5"></div>
          
          {/* Phone container with responsive sizing - flex column layout */}
          <div 
            className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/98 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 animate-scale-in flex flex-col backdrop-blur-xl"
            style={{
              width: 'clamp(280px, 28vw, 340px)',
              height: 'min(62vh, 560px)',
              aspectRatio: '9/18',
              animationDelay: '0.6s'
            }}
          >
            {/* Status bar */}
            <div className="bg-black/20 backdrop-blur-sm px-6 py-2 flex justify-between items-center text-white text-xs border-b border-white/5">
              <span className="font-medium">9:41</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
                <div className="w-6 h-3 border border-white/50 rounded-sm relative">
                  <div className="w-4 h-1.5 bg-white/90 rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header with Kai-inspired design */}
            <div className="bg-gradient-to-r from-purple-900/20 via-purple-800/30 to-indigo-900/20 backdrop-blur-sm border-b border-purple-500/20 px-4 py-4 flex items-center">
              <Avatar className="w-11 h-11 mr-3 ring-2 ring-purple-400/40 shadow-lg">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold text-sm">
                  {BRAND.coach.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm tracking-wide">{BRAND.coach.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-purple-200/90 text-xs font-medium">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages area - fills remaining phone space */}
            <div 
              ref={messagesRef}
              className="flex-1 p-4 space-y-3 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-purple-900/20 overflow-y-auto backdrop-blur-sm"
              aria-live="polite"
            >
              {visibleMessages.map((message, index) => (
                <div key={message.id} className={`flex items-end gap-2 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <Avatar className={`w-8 h-8 flex-shrink-0 ${message.type === 'user' ? 'ring-2 ring-blue-400/60 shadow-lg shadow-blue-400/20' : 'ring-2 ring-purple-400/60 shadow-lg shadow-purple-400/20'}`}>
                    {message.type === 'user' ? (
                      <>
                        <AvatarImage 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face" 
                          alt="Maya" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-semibold">
                          M
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs font-semibold">
                          {BRAND.coach.name[0]}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  {/* Message bubble using ChatBubble component */}
                  <div className="max-w-[75%]">
                    <ChatBubble isUser={message.type === 'user'} variant="kai">
                      {message.content}
                    </ChatBubble>
                  </div>
                </div>
              ))}

              {/* Typing indicator with avatar */}
              {isTyping && (
                <div className="flex items-end gap-2 animate-fade-in">
                  <Avatar className="w-8 h-8 flex-shrink-0 ring-2 ring-purple-400/60 shadow-lg shadow-purple-400/20">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs font-semibold">
                      {BRAND.coach.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChatBubble variant="kai">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </ChatBubble>
                </div>
              )}
            </div>

            {/* Input area with Kai-inspired design */}
            <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-purple-900/40 backdrop-blur-md border-t border-purple-500/20 p-4">
              <div className="bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-full px-5 py-3 flex items-center shadow-lg shadow-purple-900/20">
                <input 
                  type="text" 
                  placeholder="Message Kai..." 
                  className="flex-1 bg-transparent text-white placeholder-purple-200/60 text-sm focus:outline-none font-medium"
                  disabled
                />
                <button className="bg-gradient-to-r from-purple-500 to-indigo-600 w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-400/40 transition-all">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
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