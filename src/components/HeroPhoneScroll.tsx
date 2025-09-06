import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DEMO_CONVERSATION = [
  {
    id: 1,
    type: 'user',
    content: "my bf always on his phone at dinner 😭",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'assistant',
    content: "ouch, feels like you're not getting his attention?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'user',
    content: "yeah, i snap and it turns into a fight lol",
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'assistant',
    content: "try: \"when you scroll, i feel ignored. can we do no-phone dinners?\"",
    timestamp: new Date().toISOString(),
  },
  {
    id: 5,
    type: 'user',
    content: "ok that actually hits. imma use that 👀",
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

  useEffect(() => {
    const animateMessages = () => {
      if (currentMessageIndex < DEMO_CONVERSATION.length) {
        const currentMessage = DEMO_CONVERSATION[currentMessageIndex];
        setIsTyping(true);
        
        // Slower typing time for better readability
        const typingTime = Math.max(1800, Math.min(4000, currentMessage.content.length * 60));
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentMessageIndex(prev => prev + 1);
          setIsTyping(false);
          
          // Longer reading pause for better comprehension
          const readingTime = Math.max(3000, Math.min(6000, currentMessage.content.length * 60));
          
          setTimeout(() => {
            animateMessages();
          }, readingTime);
        }, typingTime);
      }
    };

    // Start animation sequence after component mounts
    setTimeout(() => {
      animateMessages();
    }, 1000);
  }, [currentMessageIndex]);

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Phone container - full area focused on chat */}
      <div className="relative flex items-center justify-center">
        {/* Phone mockup with glassmorphism and proportional sizing */}
        <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Glassmorphic outer shell */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl ring-1 ring-white/5"></div>
          
          {/* Phone container with responsive sizing */}
          <div 
            className="relative bg-black/80 backdrop-blur-sm border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 animate-scale-in"
            style={{
              width: 'clamp(280px, 28vw, 380px)',
              aspectRatio: '9/19',
              animationDelay: '0.6s'
            }}
          >
            {/* Status bar */}
            <div className="bg-black px-6 py-2 flex justify-between items-center text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white/50 rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header with glassmorphism */}
            <div className="bg-burgundy-800/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center">
              <Avatar className="w-10 h-10 mr-3 ring-2 ring-burgundy-400/30">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                <AvatarFallback className="bg-gradient-to-r from-burgundy-400 to-coral-400 text-white font-semibold">
                  {BRAND.coach.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold text-sm">{BRAND.coach.name}</h3>
                <p className="text-white/70 text-xs">Your AI relationship coach</p>
              </div>
            </div>

            {/* Messages area - fills more of the phone */}
            <div className="flex-1 p-4 space-y-3 bg-gradient-to-br from-burgundy-900/90 to-burgundy-800/90 backdrop-blur-sm overflow-y-auto" style={{ minHeight: '400px' }}>
              {visibleMessages.map((message, index) => (
                <div key={message.id} className={`flex items-start gap-2 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {message.type === 'user' ? (
                      <>
                        <AvatarImage 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face" 
                          alt="Maya" 
                        />
                        <AvatarFallback className="bg-gradient-to-r from-coral-400 to-pink-400 text-white text-xs font-semibold">
                          M
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                        <AvatarFallback className="bg-gradient-to-r from-burgundy-400 to-coral-400 text-white text-xs font-semibold">
                          {BRAND.coach.name[0]}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  {/* Message bubble */}
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-coral-500/80 backdrop-blur-md text-white border border-white/15 shadow-lg rounded-br-sm' 
                      : 'bg-white/95 text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator with avatar */}
              {isTyping && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                    <AvatarFallback className="bg-gradient-to-r from-burgundy-400 to-coral-400 text-white text-xs font-semibold">
                      {BRAND.coach.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/95 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area with glassmorphism */}
            <div className="bg-burgundy-800/60 backdrop-blur-md border-t border-white/10 p-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 flex items-center">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                  disabled
                />
                <button className="bg-gradient-to-r from-burgundy-500 to-coral-400 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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