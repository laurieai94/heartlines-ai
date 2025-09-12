import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { throttle } from '@/utils/throttle';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { FloatingActionButtons } from './FloatingActionButtons';
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
  
  // Simplified state management - no complex header visibility logic
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

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
    
    // Unlock user intent when manually scrolling to bottom
    userIntentLockRef.current = false;
  }, []);

  // Simplified mobile scroll handler - no catching, always responsive
  const handleScroll = useMemo(() => throttle(
    () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      
      const currentScrollTop = viewport.scrollTop;
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewport.clientHeight;
      const distanceToBottom = scrollHeight - currentScrollTop - clientHeight;
      const isNear = distanceToBottom < 150;
      
      // Track scroll direction for header visibility
      const scrollDelta = currentScrollTop - lastScrollTopRef.current;
      lastScrollTopRef.current = currentScrollTop;
      
      if (Math.abs(scrollDelta) > 2) {
        scrollDirection.current = scrollDelta > 0 ? 'down' : 'up';
      }
      
      // Simplified mobile behavior - minimal user intent blocking
      if (isMobile) {
        // Only lock user intent on deliberate fast upward scrolls
        if (scrollDirection.current === 'up' && Math.abs(scrollDelta) > 30 && !isNear) {
          userIntentLockRef.current = true;
        }
        // Unlock as soon as user approaches bottom or stops scrolling
        if (distanceToBottom < 300) {
          userIntentLockRef.current = false;
        }
      } else {
        // Desktop behavior - more conservative
        if (scrollDirection.current === 'up' && !isNear && Math.abs(scrollDelta) > 15) {
          userIntentLockRef.current = true;
        }
        if (distanceToBottom < 100) {
          userIntentLockRef.current = false;
        }
      }
      
      setIsNearBottom(isNear);
      setShowScrollToBottom(!isNear && chatHistory.length > 0);
    }, 10),
    [chatHistory.length, isMobile]
  );

  // Aggressive mobile auto-scroll - always show new messages
  useEffect(() => {
    const chatLengthChanged = prevChatLengthRef.current !== chatHistory.length;
    const loadingChanged = prevLoadingRef.current !== loading;
    
    // Mobile: Always auto-scroll unless user is actively reading history
    // Desktop: More conservative behavior
    const shouldAutoScroll = isMobile 
      ? (chatLengthChanged && !userIntentLockRef.current) || (isNearBottom && !userIntentLockRef.current)
      : (isNearBottom && !userIntentLockRef.current);
      
    if (shouldAutoScroll && (chatLengthChanged || (loadingChanged && loading)) && chatHistory.length > 0) {
      const delay = isMobile ? 20 : 50; // Much faster on mobile
      const timeoutId = setTimeout(() => scrollToBottom('smooth'), delay);
      
      prevChatLengthRef.current = chatHistory.length;
      prevLoadingRef.current = loading;
      
      return () => clearTimeout(timeoutId);
    }
    
    prevChatLengthRef.current = chatHistory.length;
    prevLoadingRef.current = loading;
  }, [chatHistory.length, loading, isNearBottom, scrollToBottom, isMobile]);

  // Auto-scroll on content resize
  useEffect(() => {
    if (!contentRef.current || !viewportRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!userIntentLockRef.current && isNearBottom) {
        setTimeout(() => scrollToBottom('smooth'), 10);
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [isNearBottom, scrollToBottom]);

  // Initial scroll when history loads
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [isHistoryLoaded, scrollToBottom]);

  return (
    <div className="flex-1 min-h-0 relative bg-burgundy-950/95">
      <ScrollArea 
        viewportRef={viewportRef} 
        className={`h-full ${
          isMobile 
            ? 'touch-pan-y overscroll-contain' 
            : 'overscroll-contain'
        }`}
        style={isMobile ? { 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain'
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

            {/* User typing indicator */}
            {userTyping && (
              <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-3'} items-end justify-end`} aria-live="polite">
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
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Floating Action Buttons for Mobile */}
      <FloatingActionButtons
        onOpenSidebar={onOpenSidebar}
        onNewConversation={onNewConversation}
        showScrollToTop={showScrollToBottom}
        onScrollToTop={() => {
          if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

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