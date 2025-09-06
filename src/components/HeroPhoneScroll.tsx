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
        // Reset after 3 seconds to loop the conversation
        timeoutId = setTimeout(() => {
          setVisibleMessages([]);
          setCurrentMessageIndex(0);
          setIsTyping(false);
        }, 3000);
        return;
      }
      
      const currentMessage = DEMO_CONVERSATION[currentMessageIndex];
      
      // Show current message
      if (currentMessage.type === 'assistant') {
        // Show typing indicator first for assistant messages
        setIsTyping(true);
        
        // Variable typing time for more natural feel - slower for demo
        const typingTime = 2800 + (currentMessage.content.length * 55);
        
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
      }, 3000);
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
            className="relative bg-burgundy-900 border-4 border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 animate-scale-in flex flex-col"
            style={{
              width: 'clamp(260px, 24vw, 320px)',
              aspectRatio: '9/18',
              animationDelay: '0.6s'
            }}
          >
            {/* Status bar */}
            <div className="bg-burgundy-800 px-6 py-2 flex justify-between items-center text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white/50 rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* Chat header with Kai styling */}
            <div className="bg-gradient-to-r from-burgundy-700/30 to-burgundy-600/20 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center">
              <Avatar className="w-10 h-10 mr-3 ring-2 ring-white/20">
                <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} />
                <AvatarFallback className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white font-semibold">
                  {BRAND.coach.name[0]}
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
              className="flex-1 p-3 space-y-2 bg-gradient-to-br from-burgundy-900/40 to-burgundy-800/40 backdrop-blur-sm overflow-y-auto"
              aria-live="polite"
            >
              {visibleMessages.map((message, index) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <ChatBubble isUser={message.type === 'user'} variant="kai" className="animate-fade-in">
                    {message.content}
                  </ChatBubble>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 shadow-lg shadow-black/30 max-w-[80%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area with Kai styling */}
            <div className="bg-gradient-to-r from-burgundy-700/20 to-burgundy-600/20 backdrop-blur-md border-t border-white/10 p-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                  disabled
                />
                <button className="bg-gradient-to-r from-burgundy-500 to-coral-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
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