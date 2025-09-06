import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { BRAND } from '@/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DEMO_CONVERSATION = [
  {
    id: 1,
    type: 'user',
    content: "My partner and I keep fighting about phone usage during dinner. It's becoming a real issue.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'assistant',
    content: "That's a really common challenge for couples today. Let me help you navigate this. First, can you tell me - when these phone discussions happen, how does your partner typically respond?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'user',
    content: "They get defensive and say I'm being controlling. But I just want us to actually talk to each other.",
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'assistant',
    content: "I hear you both wanting connection, just in different ways. Based on your attachment style and communication patterns, let's try reframing this. Instead of focusing on the phone itself, what if you expressed the underlying need?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 5,
    type: 'user',
    content: "What do you mean?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 6,
    type: 'assistant',
    content: "Try something like: 'I love our dinner time together and I've been missing our conversations lately. Could we create some phone-free time to reconnect?' This shifts from criticism to expressing your needs.",
    timestamp: new Date().toISOString(),
  }
];

// Illustrated SVG Characters
const MillennialWoman = () => (
  <svg width="120" height="180" viewBox="0 0 120 180" className="drop-shadow-lg">
    {/* Hair */}
    <path d="M60 20 Q45 15 35 25 Q25 35 30 50 Q35 65 50 70 L70 70 Q85 65 90 50 Q95 35 85 25 Q75 15 60 20" fill="#8B4513" />
    {/* Face */}
    <circle cx="60" cy="50" r="18" fill="#FDBCB4" />
    {/* Eyes */}
    <circle cx="55" cy="47" r="2" fill="#333" />
    <circle cx="65" cy="47" r="2" fill="#333" />
    {/* Smile */}
    <path d="M55 53 Q60 58 65 53" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Body - Blouse */}
    <rect x="45" y="70" width="30" height="40" rx="5" fill="#E8B4CB" />
    {/* Skirt */}
    <path d="M42 110 Q60 115 78 110 L78 140 Q60 145 42 140 Z" fill="#8B4B8B" />
    {/* Arms */}
    <ellipse cx="40" cy="85" rx="8" ry="15" fill="#FDBCB4" />
    <ellipse cx="80" cy="85" rx="8" ry="15" fill="#FDBCB4" />
    {/* Legs */}
    <rect x="50" y="140" width="8" height="25" fill="#FDBCB4" />
    <rect x="62" y="140" width="8" height="25" fill="#FDBCB4" />
    {/* Shoes */}
    <ellipse cx="54" cy="170" rx="6" ry="4" fill="#2C1810" />
    <ellipse cx="66" cy="170" rx="6" ry="4" fill="#2C1810" />
  </svg>
);

const MillennialMan = () => (
  <svg width="120" height="180" viewBox="0 0 120 180" className="drop-shadow-lg">
    {/* Hair */}
    <path d="M60 20 Q45 18 35 28 Q30 35 35 45 Q40 55 50 60 L70 60 Q80 55 85 45 Q90 35 85 28 Q75 18 60 20" fill="#4A3C1C" />
    {/* Beard */}
    <path d="M50 58 Q60 65 70 58 Q68 68 60 70 Q52 68 50 58" fill="#4A3C1C" />
    {/* Face */}
    <circle cx="60" cy="50" r="18" fill="#FDBCB4" />
    {/* Eyes */}
    <circle cx="55" cy="47" r="2" fill="#333" />
    <circle cx="65" cy="47" r="2" fill="#333" />
    {/* Smile */}
    <path d="M55 53 Q60 58 65 53" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Body - Shirt */}
    <rect x="45" y="70" width="30" height="40" rx="5" fill="#4A90E2" />
    {/* Jacket */}
    <path d="M40 75 Q45 70 50 75 L50 110 Q60 115 70 110 L70 75 Q75 70 80 75 L80 115 Q60 120 40 115 Z" fill="#2C3E50" />
    {/* Pants */}
    <rect x="48" y="110" width="24" height="30" fill="#2C3E50" />
    {/* Arms */}
    <ellipse cx="35" cy="85" rx="8" ry="15" fill="#FDBCB4" />
    <ellipse cx="85" cy="85" rx="8" ry="15" fill="#FDBCB4" />
    {/* Legs */}
    <rect x="50" y="140" width="8" height="25" fill="#FDBCB4" />
    <rect x="62" y="140" width="8" height="25" fill="#FDBCB4" />
    {/* Shoes */}
    <ellipse cx="54" cy="170" rx="8" ry="5" fill="#1A1A1A" />
    <ellipse cx="66" cy="170" rx="8" ry="5" fill="#1A1A1A" />
  </svg>
);

interface HeroPhoneScrollProps {
  className?: string;
}

const HeroPhoneScroll: React.FC<HeroPhoneScrollProps> = ({ className = '' }) => {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_CONVERSATION>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [phoneProgress, setPhoneProgress] = useState(0);
  const [charactersVisible, setCharactersVisible] = useState({ left: false, right: false });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerTop = rect.top;
      const containerHeight = rect.height;
      
      // Calculate phone drop progress (0 to 1) - phone drops in as user scrolls
      const progress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight * 0.5)));
      setPhoneProgress(progress);
      
      // Show characters based on scroll progress
      setCharactersVisible({
        left: progress > 0.4, // Woman appears when phone is halfway down
        right: progress > 0.7  // Man appears when phone is almost fully down
      });
      
      // Show messages based on scroll progress - start after phone is positioned
      const totalMessages = DEMO_CONVERSATION.length;
      const messagesToShow = Math.floor((progress - 0.3) * totalMessages * 1.5); // Start messages after phone drop
      
      if (messagesToShow > visibleMessages.length && messagesToShow <= totalMessages && messagesToShow > 0) {
        setIsTyping(true);
        setTimeout(() => {
          setVisibleMessages(DEMO_CONVERSATION.slice(0, messagesToShow));
          setIsTyping(false);
        }, 800);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleMessages.length]);

  return (
    <div ref={containerRef} className={`relative min-h-[400vh] ${className}`}>
      {/* Phone container with drop animation */}
      <div className="sticky top-1/2 transform -translate-y-1/2 h-screen flex items-center justify-center">
        {/* Phone drops down from top */}
        <div 
          className="relative transition-all duration-1000 ease-out"
          style={{
            transform: `translateY(${-100 + phoneProgress * 100}px)`,
            opacity: phoneProgress
          }}
        >
          {/* Left Character - Woman leaning against phone */}
          <div 
            className={`absolute -left-20 top-1/2 transition-all duration-1000 ease-out ${
              charactersVisible.left 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-32 opacity-0'
            }`}
            style={{ 
              transform: `translateY(-50%) translateX(${charactersVisible.left ? '-10px' : '-128px'}) rotate(-5deg)`,
              zIndex: 10
            }}
          >
            {/* Glassmorphic base behind character */}
            <div className="absolute inset-0 bg-gradient-to-r from-burgundy-500/15 to-coral-400/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl -z-10 scale-110"></div>
            <div className="relative">
              <MillennialWoman />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 border border-white/20">
                <p className="text-white text-xs font-medium">Emma</p>
              </div>
            </div>
          </div>

          {/* Right Character - Man leaning against phone */}
          <div 
            className={`absolute -right-20 top-1/2 transition-all duration-1000 ease-out ${
              charactersVisible.right 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-32 opacity-0'
            }`}
            style={{ 
              transform: `translateY(-50%) translateX(${charactersVisible.right ? '10px' : '128px'}) rotate(5deg)`,
              zIndex: 10
            }}
          >
            {/* Glassmorphic base behind character */}
            <div className="absolute inset-0 bg-gradient-to-l from-coral-500/15 to-burgundy-400/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl -z-10 scale-110"></div>
            <div className="relative">
              <MillennialMan />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 border border-white/20">
                <p className="text-white text-xs font-medium">Jake</p>
              </div>
            </div>
          </div>

          {/* Phone mockup with glassmorphism */}
          <div className="relative">
            {/* Glassmorphic outer shell */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl ring-1 ring-white/5"></div>
            
            {/* Phone container with responsive sizing */}
            <div 
              className="relative bg-black/80 backdrop-blur-sm border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 z-20"
              style={{
                width: `clamp(320px, 35vw, 400px)`,
                aspectRatio: '9/19'
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

              {/* Messages area */}
              <div className="flex-1 p-4 space-y-4 bg-gradient-to-br from-burgundy-900/90 to-burgundy-800/90 backdrop-blur-sm overflow-y-auto max-h-[60vh]">
                {visibleMessages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    isUser={message.type === 'user'}
                    variant="heartlines"
                    className="animate-fade-in"
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </ChatBubble>
                ))}

                {/* Typing indicator with glassmorphism */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-burgundy-600/80 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
    </div>
  );
};

export default HeroPhoneScroll;