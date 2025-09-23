import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { throttle } from '@/utils/throttle';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePullToReveal } from '@/hooks/usePullToReveal';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";

// Create a debounced function for better performance
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

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
  const isMobile = useIsMobile();
  
  // Mobile optimizations
  const { simulateHapticFeedback } = useMobileOptimizations();
  
  // Pull-to-reveal functionality with enhanced mobile support
  const { handleScroll: handlePullToRevealScroll, setScrollElement } = usePullToReveal({
    enabled: isMobile,
    threshold: 30,
    velocityThreshold: 0.3
  });

  // References for scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  const prevLoadingRef = useRef(loading);
  const lastScrollTopRef = useRef(0);
  const userIntentLockRef = useRef(false);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const targetScrollTop = viewport.scrollHeight - viewport.clientHeight;
    
    if (behavior === 'smooth') {
      viewport.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    } else {
      viewport.scrollTop = targetScrollTop;
    }
    
    // Provide haptic feedback on mobile for scroll actions
    if (isMobile && behavior === 'smooth') {
      simulateHapticFeedback(viewport, 'light');
    }
    
    // Unlock user intent when manually scrolling to bottom
    userIntentLockRef.current = false;
  }, [isMobile, simulateHapticFeedback]);

  // Simplified scroll handler to prevent conflicts and flickering
  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (!viewportRef.current) return;
      
      const viewport = viewportRef.current;
      const scrollTop = viewport.scrollTop;
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewport.clientHeight;
      const scrollFromBottom = scrollHeight - scrollTop - clientHeight;
      
      const nearBottom = scrollFromBottom <= 100;
      setIsNearBottom(nearBottom);
      
      // Show scroll button only on desktop to reduce mobile complexity
      if (!isMobile) {
        setShowScrollToBottom(!nearBottom);
      }
      
      // Simplified mobile pull-to-reveal
      if (isMobile) {
        const scrollDirection = scrollTop > lastScrollTopRef.current ? 'down' : 'up';
        handlePullToRevealScroll(scrollTop, scrollDirection);
      }
      
      lastScrollTopRef.current = scrollTop;
      
      // Simplified user intent - only track significant scroll away from bottom
      userIntentLockRef.current = scrollFromBottom > 200;
    }, 50); // Consistent throttling for better performance
  }, [isMobile, handlePullToRevealScroll]);

  // Simplified auto-scroll effect to prevent flickering
  useEffect(() => {
    if (!viewportRef.current) return;
    
    const hasNewMessage = prevChatLengthRef.current < chatHistory.length;
    const shouldAutoScroll = (
      chatHistory.length <= 1 || // Initial state
      (!loading && hasNewMessage && !userIntentLockRef.current) // New message and user hasn't scrolled away
    );
    
    if (shouldAutoScroll) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        scrollToBottom(hasNewMessage ? 'smooth' : 'auto');
      });
    }
    
    prevChatLengthRef.current = chatHistory.length;
  }, [chatHistory, loading, scrollToBottom]);

  // Optimized resize handling with debounced updates
  useEffect(() => {
    if (!contentRef.current || !viewportRef.current) return;

    // Set scroll element for pull-to-reveal
    setScrollElement(viewportRef.current);

    // Debounced resize handler for better performance
    const debouncedResizeHandler = debounce(() => {
      if (!userIntentLockRef.current && (isNearBottom || isMobile)) {
        setTimeout(() => scrollToBottom('smooth'), isMobile ? 5 : 10);
      }
    }, isMobile ? 50 : 100);

    const resizeObserver = new ResizeObserver(debouncedResizeHandler);
    resizeObserver.observe(contentRef.current);
    
    return () => resizeObserver.disconnect();
  }, [isNearBottom, scrollToBottom, setScrollElement, isMobile]);

  // Initial scroll when history loads
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [isHistoryLoaded, scrollToBottom]);

  return (
    <div className="flex-1 min-h-0 relative bg-burgundy-950">
      <ScrollArea 
        viewportRef={viewportRef}
        className={`h-full ${
          isMobile 
            ? 'touch-pan-y overscroll-contain scroll-smooth-mobile' 
            : 'overscroll-contain'
        }`}
        style={isMobile ? { 
          // Enhanced mobile scrolling performance
          WebkitOverflowScrolling: 'touch' as any,
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth',
          willChange: 'scroll-position',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)', // Force hardware acceleration
        } : undefined}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
      >
        <div 
          className="pt-1 md:px-4 md:pt-3 md:pb-2"
          style={{
            paddingBottom: '4px',
            paddingLeft: isMobile ? 'max(4px, env(safe-area-inset-left))' : '16px',
            paddingRight: isMobile ? 'max(4px, env(safe-area-inset-right))' : '16px'
          }}
        >
          <div ref={contentRef} className="md:space-y-3 md:max-w-[54rem] md:mx-auto md:pl-12 md:pr-4" role="list" aria-label="Chat messages">
            
            {/* Chat Messages - Only show AI messages */}
            {chatHistory.filter(msg => msg.type !== 'user').map((message, index, filteredMessages) => {
              const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
              const nextMessage = index < filteredMessages.length - 1 ? filteredMessages[index + 1] : null;
              
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
              <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} items-center`}>
                <div className="relative flex-shrink-0">
                  <Avatar className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-pink-500">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Heart className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-white/70 text-sm py-1">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>

      {/* Desktop Scroll to Bottom Button */}
      {!isMobile && showScrollToBottom && (
        <div className="fixed bottom-24 right-8 z-50">
          <Button
            onClick={() => scrollToBottom('smooth')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
            size="sm"
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;