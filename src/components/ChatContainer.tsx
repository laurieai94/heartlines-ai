import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, ChevronDown, Heart } from "lucide-react";
import { ChatMessage } from "@/types/AIInsights";
import AIChatMessage from "./AIChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/branding";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileHeaderVisibility } from "@/contexts/MobileHeaderVisibilityContext";
import { throttle, debounce } from "@/utils/throttle";

interface ChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  userTyping?: boolean;
}
const ChatContainer = ({
  chatHistory,
  loading,
  userName,
  isConfigured,
  conversationStarter,
  isHistoryLoaded,
  userTyping = false
}: ChatContainerProps) => {
  const { accessLevel } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { setVisible } = useMobileHeaderVisibility();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  const prevLoadingRef = useRef(loading);
  const lastScrollTopRef = useRef(0);
  const isInitializedRef = useRef(false);
  const vvPrevHeightRef = useRef<number | null>(null);
  const userIntentLockRef = useRef(false);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const keyboardHeightRef = useRef(0);
  const isKeyboardOpenRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingStickyInterval = useRef<NodeJS.Timeout | null>(null);
  
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    
    // Use viewport.scrollTo for better control instead of scrollIntoView
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
    
    // Update scroll reference after scrolling to bottom on mobile
    if (isMobile) {
      setTimeout(() => {
        if (viewportRef.current) {
          lastScrollTopRef.current = viewportRef.current.scrollTop;
        }
      }, 100);
    }
  }, [isMobile]);

  // Debounced header visibility update to prevent rapid state changes
  const debouncedSetVisible = useMemo(
    () => debounce((visible: boolean) => setVisible(visible), 50),
    [setVisible]
  );

  // Optimized scroll handler with throttling and user intent detection
  const handleScroll = useMemo(
    () => throttle(() => {
      const target = viewportRef.current;
      if (!target) return;
      // More refined threshold calculation
      const isMobileLocal = isMobile; // capture
      const baseThreshold = isMobileLocal ? 60 : 48;
      const keyboardThreshold = isKeyboardOpenRef.current ? 150 : baseThreshold;
      const threshold = keyboardThreshold;
      const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
      const isNear = distanceToBottom < threshold;
      const currentScrollTop = target.scrollTop;
      
      // Detect scroll direction
      const scrollDelta = currentScrollTop - lastScrollTopRef.current;
      if (Math.abs(scrollDelta) > 5) { // Only track significant scrolls
        scrollDirection.current = scrollDelta > 0 ? 'down' : 'up';
      }
      
      // Detect user scrolling up to lock auto-scroll - more sensitive when keyboard is open
      if (scrollDirection.current === 'up' && !isNear) {
        // When keyboard is open, be less aggressive about locking scroll
        if (!isKeyboardOpenRef.current || Math.abs(scrollDelta) > 30) {
          userIntentLockRef.current = true;
        }
      }
      
      // Immediate header visibility on any upward scroll intent
      if (isMobileLocal && scrollDirection.current === 'up' && Math.abs(scrollDelta) > 5) {
        debouncedSetVisible(true);
      }
      
      // Unlock when user reaches bottom
      if (isNear) {
        userIntentLockRef.current = false;
      }
      
      lastScrollTopRef.current = currentScrollTop;
      setIsNearBottom(isNear);
      setShowScrollToBottom(!isNear && chatHistory.length > 0);

      // Direction-aware mobile header visibility
      if (isMobileLocal && chatHistory.length > 0) {
        // Show header when scrolling up OR at very top
        if (scrollDirection.current === 'up' || currentScrollTop < 20) {
          debouncedSetVisible(true);
        } else if (scrollDirection.current === 'down' && currentScrollTop > 60) {
          // Hide header when scrolling down past initial area
          debouncedSetVisible(false);
        }
      }
    }, 16), // 60fps throttling
    [chatHistory.length, isMobile, debouncedSetVisible]
  );

  // Enhanced auto-scroll with ResizeObserver for content growth detection
  useEffect(() => {
    const chatLengthChanged = prevChatLengthRef.current !== chatHistory.length;
    const loadingChanged = prevLoadingRef.current !== loading;
    
    if (isNearBottom && !userIntentLockRef.current && (chatLengthChanged || (loadingChanged && loading)) && chatHistory.length > 0) {
      const timeoutId = setTimeout(() => scrollToBottom('smooth'), 50);
      
      prevChatLengthRef.current = chatHistory.length;
      prevLoadingRef.current = loading;
      
      return () => clearTimeout(timeoutId);
    }
    
    prevChatLengthRef.current = chatHistory.length;
    prevLoadingRef.current = loading;
  }, [chatHistory.length, loading, isNearBottom, scrollToBottom]);

  // ResizeObserver for content growth detection and auto-scroll
  useEffect(() => {
    if (!contentRef.current || !viewportRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Only auto-scroll if near bottom and not locked by user intent
      if (isNearBottom && !userIntentLockRef.current) {
        // Small delay to ensure content has rendered
        setTimeout(() => scrollToBottom('smooth'), 20);
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [isNearBottom, scrollToBottom]);

  // Loading state sticky bottom with interval
  useEffect(() => {
    if (loading && isNearBottom && !userIntentLockRef.current) {
      loadingStickyInterval.current = setInterval(() => {
        if (viewportRef.current && isNearBottom && !userIntentLockRef.current) {
          const viewport = viewportRef.current;
          const distanceToBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
          if (distanceToBottom > 10) { // Only scroll if there's meaningful distance
            scrollToBottom('auto');
          }
        }
      }, 100);
    } else if (loadingStickyInterval.current) {
      clearInterval(loadingStickyInterval.current);
      loadingStickyInterval.current = null;
    }

    return () => {
      if (loadingStickyInterval.current) {
        clearInterval(loadingStickyInterval.current);
        loadingStickyInterval.current = null;
      }
    };
  }, [loading, isNearBottom, scrollToBottom]);

  // Strengthened initial scroll and conversation switches
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
      // Double-check with delay to ensure all content is rendered
      setTimeout(() => scrollToBottom('auto'), 100);
      setTimeout(() => scrollToBottom('auto'), 300);
    }
  }, [isHistoryLoaded, scrollToBottom]);

  // Handle mobile keyboard visibility changes (guarded)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    if (!isMobile) return;

    const vv = window.visualViewport;
    // Initialize previous height
    vvPrevHeightRef.current = vvPrevHeightRef.current ?? vv.height;

    const handleViewportChange = () => {
      if (!viewportRef.current) {
        vvPrevHeightRef.current = vv.height;
        return;
      }
      const prev = vvPrevHeightRef.current ?? vv.height;
      const heightDiff = prev - vv.height;
      vvPrevHeightRef.current = vv.height;

      // Update keyboard state and height
      keyboardHeightRef.current = Math.max(0, heightDiff);
      isKeyboardOpenRef.current = heightDiff > 150;

      const v = viewportRef.current;
      const distanceToBottom = v.scrollHeight - v.scrollTop - v.clientHeight;
      const nearBottom = distanceToBottom < (isKeyboardOpenRef.current ? 150 : 48);

      if (isKeyboardOpenRef.current && nearBottom && !userIntentLockRef.current) {
        // Small delay to ensure the viewport has stabilized
        setTimeout(() => scrollToBottom('auto'), 50);
      }
    };

    vv.addEventListener('resize', handleViewportChange);
    return () => vv.removeEventListener('resize', handleViewportChange);
  }, [isMobile, scrollToBottom]);
  return <div className="flex-1 min-h-0 relative">
      <ScrollArea 
        viewportRef={viewportRef} 
        className={`h-full ${isMobile ? '' : 'overscroll-contain'}`}
        style={isMobile ? { WebkitOverflowScrolling: 'touch' } : undefined}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
      >
        <div 
          className="pt-1 md:px-4 md:pt-3 md:pb-2"
          style={{
            paddingBottom: isMobile && isKeyboardOpenRef.current 
              ? `${Math.max(keyboardHeightRef.current * 0.1, 4)}px` 
              : '4px',
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
      
      {/* Scroll to Bottom Button */}
      {showScrollToBottom && <Button 
        onClick={() => {
          userIntentLockRef.current = false; // Unlock when user clicks button
          scrollToBottom('smooth');
        }} 
        size="sm" 
        className={`absolute bottom-4 right-4 z-40 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg ${isMobile ? '' : 'border border-white/20'}`}
        style={{ touchAction: 'manipulation' }}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>}
    </div>;
};
export default ChatContainer;