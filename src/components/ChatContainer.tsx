import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useViewport } from '@/contexts/ViewportContext';
import NavigationPullTab from './NavigationPullTab';
import { BurgundyNavCarrot } from './BurgundyNavCarrot';

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
  const { isMobile, isTablet } = useOptimizedMobile();
  const { visible: headerVisible, setVisible: setHeaderVisible, forceVisible } = useMobileHeaderVisibility();
  const { isKeyboardVisible } = useViewport();
  
  // Simple references for scroll management
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  const prevUserTypingRef = useRef(userTyping);
  const carrotResetFnRef = useRef<(() => void) | null>(null);
  
  // Scroll tracking for carrot management
  const lastScrollTopRef = useRef(0);
  const touchStartYRef = useRef(0);
  
  // Carrot appears immediately when scrolling up with keyboard visible

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
    });
  }, []);

  // Enhanced scroll handler with carrot state management
  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const currentScrollTop = viewport.scrollTop;
    const scrollFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    const scrollDelta = currentScrollTop - lastScrollTopRef.current;
    
    // Desktop scroll-to-bottom button
    if (!isMobile) {
      setShowScrollToBottom(scrollFromBottom > 100);
    }
    
    // Simplified mobile logic - carrot appears at 20px scroll threshold
    if (isMobile) {
      const isScrollingUpNow = scrollDelta < -2;
      const isScrollingDownNow = scrollDelta > 5;
      
      // Reset isScrollingUp when near top (50px threshold)
      if (currentScrollTop < 50) {
        setIsScrollingUp(false);
      } else if (isScrollingUpNow && !isTablet) {
        // Show carrot on scroll up
        setIsScrollingUp(true);
      } else if (isScrollingDownNow) {
        // Hide carrot on downward scroll
        setIsScrollingUp(false);
      }
      
      // Show header on upward scroll
      if (scrollDelta < -2) {
        setHeaderVisible(true);
      }
    }
    
    lastScrollTopRef.current = currentScrollTop;
  }, [isMobile, isTablet, setHeaderVisible, isScrollingUp]);

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

  // Track typing state without interfering with iOS keyboard behavior
  useEffect(() => {
    prevUserTypingRef.current = userTyping;
  }, [userTyping]);


  // Enhanced touch detection for immediate header reveal
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    if (touch) {
      touchStartYRef.current = touch.clientY;
      
      // If touching near top of screen, immediately show header  
      if (touch.clientY < 150) {
        forceVisible();
      }
    }
  }, [isMobile, forceVisible, isKeyboardVisible]);

  // Immediate upward swipe detection
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    if (touchStartYRef.current > 0) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStartYRef.current;
      
      // Show header immediately on downward swipe (pulling down)
      if (deltaY > 15) {
        forceVisible();
        // Also trigger scroll up state for carrot if scrolled down
        if (viewportRef.current && viewportRef.current.scrollTop > 50) {
          setIsScrollingUp(true);
        }
        // Prevent further processing
        touchStartYRef.current = 0;
      }
    }
  }, [isMobile, forceVisible]);

  // Handle navigation open - reset carrot and scroll to top
  const handleOpenNavigation = useCallback(() => {
    setIsScrollingUp(false);
    scrollToBottom('auto');
    onOpenSidebar?.();
  }, [onOpenSidebar, scrollToBottom]);

  return (
    <div className="flex-1 min-h-0 relative bg-burgundy-950">
      {/* Pull tab for navigation access when keyboard is active */}
      <NavigationPullTab onOpenNavigation={onOpenSidebar} />
      
      {/* Burgundy carrot navigation for scroll up scenarios */}
      <BurgundyNavCarrot 
        isScrollingUp={isScrollingUp} 
        onOpenNavigation={handleOpenNavigation}
        scrollPosition={lastScrollTopRef.current}
      />
      
      <ScrollArea 
        viewportRef={viewportRef}
        className="h-full"
        style={isMobile ? { 
          WebkitOverflowScrolling: 'touch' as any,
        } : undefined}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
      >
        <div 
          className="pt-2 md:px-4 md:pt-3 md:pb-2"
          style={{
            paddingBottom: '4px',
            paddingLeft: isMobile ? 'max(4px, env(safe-area-inset-left))' : '16px',
            paddingRight: isMobile ? 'max(4px, env(safe-area-inset-right))' : '16px'
          }}
        >
          <div className="md:space-y-3 md:max-w-[54rem] md:mx-auto md:pl-12 md:pr-4" role="list" aria-label="Chat messages">
            
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
          </div>
        </div>
      </ScrollArea>

    </div>
  );
};

export default ChatContainer;