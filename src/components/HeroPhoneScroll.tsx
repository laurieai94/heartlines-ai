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

interface MillennialCharacter {
  name: string;
  image: string;
  description: string;
  side: 'left' | 'right';
}

const MILLENNIAL_CHARACTERS: MillennialCharacter[] = [
  {
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    description: 'Millennial navigating modern relationships',
    side: 'left'
  },
  {
    name: 'Jake',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 
    description: 'Learning to communicate better with his partner',
    side: 'right'
  }
];

interface HeroPhoneScrollProps {
  className?: string;
}

const HeroPhoneScroll: React.FC<HeroPhoneScrollProps> = ({ className = '' }) => {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_CONVERSATION>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [charactersVisible, setCharactersVisible] = useState({ left: false, right: false });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerTop = rect.top;
      const containerHeight = rect.height;
      
      // Calculate scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight + containerHeight)));
      setScrollProgress(progress);
      
      // Show characters based on scroll progress
      setCharactersVisible({
        left: progress > 0.3,
        right: progress > 0.6
      });
      
      // Show messages based on scroll progress
      const totalMessages = DEMO_CONVERSATION.length;
      const messagesToShow = Math.floor(progress * totalMessages * 1.2); // Slightly faster reveal
      
      if (messagesToShow > visibleMessages.length && messagesToShow <= totalMessages) {
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
    <div ref={containerRef} className={`relative min-h-[300vh] ${className}`}>
      {/* Sticky phone container */}
      <div className="sticky top-1/2 transform -translate-y-1/2 h-screen flex items-center justify-center">
        {/* Left Character */}
        <div 
          className={`absolute left-8 lg:left-20 transition-all duration-1000 ease-out ${
            charactersVisible.left 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
          }`}
        >
          <div className="relative">
            {/* Glassmorphic base */}
            <div className="absolute inset-0 bg-burgundy-500/20 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"></div>
            <div className="relative p-6 max-w-xs">
              <Avatar className="w-20 h-20 mb-4 ring-2 ring-burgundy-400/30">
                <AvatarImage src={MILLENNIAL_CHARACTERS[0].image} alt={MILLENNIAL_CHARACTERS[0].name} />
                <AvatarFallback className="bg-burgundy-600 text-white text-xl font-semibold">
                  {MILLENNIAL_CHARACTERS[0].name[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-white text-lg font-medium mb-2">{MILLENNIAL_CHARACTERS[0].name}</h3>
              <p className="text-white/70 text-sm">{MILLENNIAL_CHARACTERS[0].description}</p>
            </div>
          </div>
        </div>

        {/* Right Character */}
        <div 
          className={`absolute right-8 lg:right-20 transition-all duration-1000 ease-out ${
            charactersVisible.right 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
          }`}
        >
          <div className="relative">
            {/* Glassmorphic base */}
            <div className="absolute inset-0 bg-coral-500/20 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"></div>
            <div className="relative p-6 max-w-xs">
              <Avatar className="w-20 h-20 mb-4 ring-2 ring-coral-400/30">
                <AvatarImage src={MILLENNIAL_CHARACTERS[1].image} alt={MILLENNIAL_CHARACTERS[1].name} />
                <AvatarFallback className="bg-coral-600 text-white text-xl font-semibold">
                  {MILLENNIAL_CHARACTERS[1].name[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-white text-lg font-medium mb-2">{MILLENNIAL_CHARACTERS[1].name}</h3>
              <p className="text-white/70 text-sm">{MILLENNIAL_CHARACTERS[1].description}</p>
            </div>
          </div>
        </div>

        {/* Phone mockup with glassmorphism */}
        <div className="relative">
          {/* Glassmorphic outer shell */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl ring-1 ring-white/5"></div>
          
          {/* Phone container with responsive sizing */}
          <div 
            className="relative bg-black/80 backdrop-blur-sm border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500"
            style={{
              width: `clamp(280px, ${30 + scrollProgress * 10}vw, 380px)`,
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
  );
};

export default HeroPhoneScroll;