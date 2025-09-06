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
  const [charactersVisible, setCharactersVisible] = useState({ left: false, right: false });
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Start animation sequence after component mounts
    const startAnimation = () => {
      // Show phone drop-in animation first
      setTimeout(() => {
        // Show left character
        setCharactersVisible(prev => ({ ...prev, left: true }));
      }, 800);

      setTimeout(() => {
        // Show right character
        setCharactersVisible(prev => ({ ...prev, right: true }));
      }, 1400);

      // Start message animation sequence
      setTimeout(() => {
        animateMessages();
      }, 2000);
    };

    const animateMessages = () => {
      if (currentMessageIndex < DEMO_CONVERSATION.length) {
        setIsTyping(true);
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, DEMO_CONVERSATION[currentMessageIndex]]);
          setCurrentMessageIndex(prev => prev + 1);
          setIsTyping(false);
          
          // Continue to next message
          setTimeout(() => {
            animateMessages();
          }, 1500);
        }, 1000);
      }
    };

    startAnimation();
  }, [currentMessageIndex]);

  return (
    <div className={`relative ${className}`}>
      {/* Phone container with animated characters */}
      <div className="relative flex items-center justify-center">
        {/* Left Character - leaning against phone */}
        <div 
          className={`absolute -left-16 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out ${
            charactersVisible.left 
              ? 'translate-x-0 opacity-100 rotate-12' 
              : '-translate-x-full opacity-0 rotate-0'
          }`}
          style={{ transformOrigin: 'bottom right' }}
        >
          {/* Illustrated character SVG */}
          <div className="relative w-32 h-40">
            <svg viewBox="0 0 120 160" className="w-full h-full">
              {/* Character illustration */}
              <defs>
                <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDBCB4" />
                  <stop offset="100%" stopColor="#F4A094" />
                </linearGradient>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#6B3410" />
                </linearGradient>
              </defs>
              {/* Body */}
              <ellipse cx="60" cy="140" rx="25" ry="15" fill="#FF6B6B" />
              {/* Torso */}
              <rect x="35" y="80" width="50" height="60" rx="25" fill="#FF6B6B" />
              {/* Head */}
              <circle cx="60" cy="50" r="25" fill="url(#skinGradient)" />
              {/* Hair */}
              <path d="M35 35 Q60 25 85 35 Q85 50 60 55 Q35 50 35 35" fill="url(#hairGradient)" />
              {/* Eyes */}
              <circle cx="52" cy="45" r="2" fill="#333" />
              <circle cx="68" cy="45" r="2" fill="#333" />
              {/* Smile */}
              <path d="M50 55 Q60 65 70 55" stroke="#333" strokeWidth="2" fill="none" />
              {/* Arms */}
              <circle cx="25" cy="90" r="8" fill="url(#skinGradient)" />
              <circle cx="95" cy="90" r="8" fill="url(#skinGradient)" />
              <rect x="17" y="85" width="16" height="35" rx="8" fill="#FF6B6B" />
              <rect x="87" y="85" width="16" height="35" rx="8" fill="#FF6B6B" />
            </svg>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-burgundy-500/20 backdrop-blur-md rounded-lg px-3 py-1 border border-white/10">
                <p className="text-white text-xs font-medium">{MILLENNIAL_CHARACTERS[0].name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Character - leaning against phone */}
        <div 
          className={`absolute -right-16 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out ${
            charactersVisible.right 
              ? 'translate-x-0 opacity-100 -rotate-12' 
              : 'translate-x-full opacity-0 rotate-0'
          }`}
          style={{ transformOrigin: 'bottom left' }}
        >
          {/* Illustrated character SVG */}
          <div className="relative w-32 h-40">
            <svg viewBox="0 0 120 160" className="w-full h-full">
              {/* Character illustration */}
              <defs>
                <linearGradient id="skinGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DEB887" />
                  <stop offset="100%" stopColor="#CD853F" />
                </linearGradient>
                <linearGradient id="hairGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A4A4A" />
                  <stop offset="100%" stopColor="#2A2A2A" />
                </linearGradient>
              </defs>
              {/* Body */}
              <ellipse cx="60" cy="140" rx="25" ry="15" fill="#4ECDC4" />
              {/* Torso */}
              <rect x="35" y="80" width="50" height="60" rx="25" fill="#4ECDC4" />
              {/* Head */}
              <circle cx="60" cy="50" r="25" fill="url(#skinGradient2)" />
              {/* Hair */}
              <path d="M35 30 Q60 20 85 30 Q85 45 60 50 Q35 45 35 30" fill="url(#hairGradient2)" />
              {/* Eyes */}
              <circle cx="52" cy="45" r="2" fill="#333" />
              <circle cx="68" cy="45" r="2" fill="#333" />
              {/* Smile */}
              <path d="M50 55 Q60 65 70 55" stroke="#333" strokeWidth="2" fill="none" />
              {/* Arms */}
              <circle cx="25" cy="90" r="8" fill="url(#skinGradient2)" />
              <circle cx="95" cy="90" r="8" fill="url(#skinGradient2)" />
              <rect x="17" y="85" width="16" height="35" rx="8" fill="#4ECDC4" />
              <rect x="87" y="85" width="16" height="35" rx="8" fill="#4ECDC4" />
            </svg>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-coral-500/20 backdrop-blur-md rounded-lg px-3 py-1 border border-white/10">
                <p className="text-white text-xs font-medium">{MILLENNIAL_CHARACTERS[1].name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phone mockup with glassmorphism and drop-in animation */}
        <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Glassmorphic outer shell */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl ring-1 ring-white/5"></div>
          
          {/* Phone container */}
          <div 
            className="relative bg-black/80 backdrop-blur-sm border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 animate-scale-in"
            style={{
              width: '320px',
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

            {/* Messages area */}
            <div className="flex-1 p-4 space-y-4 bg-gradient-to-br from-burgundy-900/90 to-burgundy-800/90 backdrop-blur-sm overflow-y-auto" style={{ maxHeight: '300px' }}>
              {visibleMessages.map((message, index) => (
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
                <div className="flex justify-start animate-fade-in">
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