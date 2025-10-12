import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";
import { ChatHeader } from './chat/ChatHeader';
import { usePullToReveal } from '@/hooks/usePullToReveal';
import { useViewport } from '@/contexts/ViewportContext';

interface ChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName?: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  userTyping: boolean;
  onNewConversation?: () => void;
  onOpenSidebar?: () => void;
}

const ChatContainer = ({ 
  chatHistory, 
  loading, 
  userName, 
  isConfigured, 
  conversationStarter, 
  isHistoryLoaded,
  userTyping,
  onNewConversation = () => {},
  onOpenSidebar
}: ChatContainerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [lastScrollDirection, setLastScrollDirection] = useState<'up' | 'down'>('down');
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const prevChatLengthRef = useRef(chatHistory.length);
  const { isKeyboardVisible } = useViewport();
  
  const { handleScroll: handlePullScroll } = usePullToReveal({
    enabled: isMobilePhone
  });

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
    });
  }, []);

  // Scroll to top of chat
  const scrollToTop = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: 0,
      behavior
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    
    // Track scroll direction
    const prevScrollTop = viewport.dataset.prevScrollTop 
      ? parseInt(viewport.dataset.prevScrollTop) 
      : viewport.scrollTop;
    const currentScrollTop = viewport.scrollTop;
    const scrollDirection = currentScrollTop > prevScrollTop ? 'down' : 'up';
    viewport.dataset.prevScrollTop = currentScrollTop.toString();
    
    // Show "scroll to top" button only when scrolling UP and away from top (mobile only)
    if (isMobilePhone) {
      const isScrolledAway = currentScrollTop > 100;
      const isNearBottom = currentScrollTop + viewport.clientHeight >= viewport.scrollHeight - 50;
      
      // Force hide if near bottom or scrolling down
      if (scrollDirection === 'down' || isNearBottom) {
        setShowScrollToTop(false);
        setLastScrollDirection('down');
      } 
      // Show only if scrolling up AND away from top AND not at bottom
      else if (scrollDirection === 'up' && isScrolledAway && !isNearBottom) {
        setShowScrollToTop(true);
        setLastScrollDirection('up');
      } 
      // Hide when near the top
      else if (currentScrollTop <= 100) {
        setShowScrollToTop(false);
      }
    }
    
    // Enable pull-to-reveal navigation on mobile
    if (isMobilePhone) {
      handlePullScroll(currentScrollTop, scrollDirection);
    }
  }, [isMobilePhone, handlePullScroll]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const hasNewMessage = prevChatLengthRef.current < chatHistory.length;
    
    if (hasNewMessage || chatHistory.length <= 1) {
      // Always scroll to bottom on new messages
      requestAnimationFrame(() => {
        scrollToBottom(hasNewMessage ? 'smooth' : 'auto');
      });
    }
    
    prevChatLengthRef.current = chatHistory.length;
  }, [chatHistory.length, scrollToBottom]);

  // Initial scroll when history loads
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
    }
  }, [isHistoryLoaded, scrollToBottom]);

  // Auto-scroll to bottom when keyboard opens on mobile (only if user has scrolled away)
  useEffect(() => {
    if (!isMobilePhone || !isKeyboardVisible) return;
    
    // Small delay to ensure keyboard animation has started
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isKeyboardVisible, isMobilePhone, scrollToBottom]);

  // Render chat messages (shared between mobile and desktop)
  const renderMessages = () => (
    <>
      {/* Chat Messages */}
      {chatHistory.map((message, index) => {
        const isUser = message.type === 'user';
        const prevMessage = index > 0 ? chatHistory[index - 1] : null;
        const nextMessage = index < chatHistory.length - 1 ? chatHistory[index + 1] : null;
        
        // Group consecutive messages from the same sender within 5 minutes
        const isFirstInGroup = !prevMessage || 
          prevMessage.type !== message.type || 
          (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 300000;
        
        const isLastInGroup = !nextMessage || 
          nextMessage.type !== message.type || 
          (nextMessage ? new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() : 0) > 300000;

        return (
          <div key={message.id}>
            <AIChatMessage 
              message={message} 
              userName={userName}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          </div>
        );
      })}
      
      {/* Typing indicator - only show when loading */}
      {loading && (
        <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} items-end`}>
          <div className="relative flex-shrink-0">
            <Avatar className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
              <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" loading="eager" decoding="async" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Heart className="w-4 h-4 md:w-6 md:h-6" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className={`bg-white/10 backdrop-blur-sm px-3 py-2 md:px-5 md:py-3 shadow-xl ${isMobile ? 'rounded-2xl' : 'rounded-3xl border border-white/10'}`}>
            <div className="flex gap-1 md:gap-1.5">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{
                animationDelay: '0.1s'
              }}></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{
                animationDelay: '0.2s'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* User typing indicator - always rendered to prevent height changes */}
      <div 
        className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} items-end justify-end transition-opacity duration-200 ${userTyping ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-live="polite"
        aria-hidden={!userTyping}
      >
        <div className={`bg-gradient-to-r from-coral-400 to-pink-500 text-white px-3 py-2 md:px-5 md:py-3 shadow-xl ${isMobile ? 'rounded-2xl' : 'rounded-3xl border border-white/10'}`}>
          <div className="flex gap-1 md:gap-1.5">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full animate-bounce" style={{
              animationDelay: '0.1s'
            }}></div>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full animate-bounce" style={{
              animationDelay: '0.2s'
            }}></div>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <Avatar className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-coral-400 to-pink-500 border border-white/20">
            <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white">
              {userName ? userName[0]?.toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="sr-only">{userName || 'User'} is typing...</span>
      </div>
      
      <div className="h-2 md:h-4" />
    </>
  );

  return (
    <div className="flex-1 min-h-0 md:max-h-none relative bg-burgundy-950">
      {isMobilePhone ? (
        /* Mobile: Fixed height container with absolute input positioning */
        <div 
          className="fixed inset-0 flex flex-col"
          style={{ 
            top: 'calc(env(safe-area-inset-top) + 7rem)', // Account for site nav bar (3rem/48px) + ChatHeader (4rem/64px)
            height: 'calc(100dvh - env(safe-area-inset-top) - 7rem)',
            zIndex: 10
          }}
        >
          
          {/* Scrollable Messages - fills remaining space */}
          <div 
            ref={viewportRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch px-1"
            style={{ 
              paddingTop: '0.5rem',
              paddingBottom: '8rem' // Space for input (reduced for better spacing)
            }}
            role="log"
            aria-live="polite"
            aria-label="Chat conversation history"
          >
            <div
              style={{
                paddingLeft: 'max(4px, env(safe-area-inset-left))',
                paddingRight: 'max(4px, env(safe-area-inset-right))'
              }}
            >
              <div role="list" aria-label="Chat messages">
                {renderMessages()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ScrollArea for tablets and desktop */
        <ScrollArea 
          viewportRef={viewportRef}
          className="h-full w-full"
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Chat conversation history"
        >
          <div 
            className="pt-2 md:pt-3 md:pb-2"
            style={{
              paddingBottom: '4px',
              paddingLeft: isMobile ? 'max(4px, env(safe-area-inset-left))' : '0',
              paddingRight: isMobile ? 'max(4px, env(safe-area-inset-right))' : '0'
            }}
          >
            <div role="list" aria-label="Chat messages">
              {renderMessages()}
            </div>
          </div>
        </ScrollArea>
      )}

      {/* Scroll to top button - mobile only */}
      {showScrollToTop && isMobilePhone && (
        <Button
          onClick={() => scrollToTop('smooth')}
          className="fixed bottom-24 right-4 rounded-full w-12 h-12 shadow-lg z-10"
          size="icon"
          variant="secondary"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatContainer;
