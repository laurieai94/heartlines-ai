import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, ChevronDown } from "lucide-react";
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
}
const ChatContainer = ({
  chatHistory,
  loading,
  userName,
  isConfigured,
  conversationStarter,
  isHistoryLoaded
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
    () => throttle((event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const threshold = 48;
      const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
      const isNear = distanceToBottom < threshold;
      const currentScrollTop = target.scrollTop;
      
      // Detect user scrolling up to lock auto-scroll
      if (currentScrollTop < lastScrollTopRef.current) {
        userIntentLockRef.current = true;
      }
      
      // Unlock when user reaches bottom
      if (isNear) {
        userIntentLockRef.current = false;
      }
      
      lastScrollTopRef.current = currentScrollTop;
      setIsNearBottom(isNear);
      setShowScrollToBottom(!isNear && chatHistory.length > 0);

      // Simplified mobile header visibility: hide once chatting starts
      if (isMobile) {
        // Show header only when no chat content OR at very top (within 10px)
        if (chatHistory.length === 0 || currentScrollTop < 10) {
          debouncedSetVisible(true);
        } else {
          // Hide header when there's chat content and user has scrolled
          debouncedSetVisible(false);
        }
      }
    }, 16), // 60fps throttling
    [chatHistory.length, isMobile, debouncedSetVisible]
  );

  // Smart auto-scroll: only when near bottom, not locked by user intent, and something actually changed
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

  // Removed auto-scroll on window/viewport resize to prevent scroll catching on mobile

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

      // Keyboard likely opened if viewport height decreased significantly
      const keyboardLikelyOpen = heightDiff > 150;

      const v = viewportRef.current;
      const distanceToBottom = v.scrollHeight - v.scrollTop - v.clientHeight;
      const nearBottom = distanceToBottom < 48;

      if (keyboardLikelyOpen && nearBottom && !userIntentLockRef.current) {
        // Small delay to ensure the viewport has stabilized
        setTimeout(() => scrollToBottom('auto'), 50);
      }
    };

    vv.addEventListener('resize', handleViewportChange);
    return () => vv.removeEventListener('resize', handleViewportChange);
  }, [isMobile, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (isHistoryLoaded) {
      scrollToBottom('auto');
    }
  }, [isHistoryLoaded, scrollToBottom]);
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
        <div className="pt-1 pb-1 px-1 md:px-4 md:pt-3 md:pb-2">
          <div className="md:space-y-3 md:max-w-[54rem] md:mx-auto md:px-12" role="list" aria-label="Chat messages">
            
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
              <div className="flex gap-2 md:gap-3 items-end">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 border border-white/20">
                    <AvatarImage src={BRAND.coach.avatarSrc} alt={BRAND.coach.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4 md:w-6 md:h-6" />
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
        className={`absolute bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg ${isMobile ? '' : 'border border-white/20'}`}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>}
    </div>;
};
export default ChatContainer;