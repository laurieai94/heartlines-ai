import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
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
  const isMobile = useIsMobile();
  const { visible: headerVisible, setVisible: setHeaderVisible, forceVisible } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  
  // Simple references for scroll management
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  
  // Scroll direction tracking - simplified
  const lastScrollTopRef = useRef(0);
  const scrollUpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef(0);

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
    });
  }, []);

  // Immediate scroll handler - show header on any upward scroll
  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const currentScrollTop = viewport.scrollTop;
    const scrollFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    
    // Debug logging
    console.log('📱 Scroll event:', { 
      currentScrollTop, 
      lastScrollTop: lastScrollTopRef.current, 
      scrollDelta: currentScrollTop - lastScrollTopRef.current,
      isMobile, 
      isKeyboardVisible 
    });
    
    // Desktop scroll-to-bottom button
    if (!isMobile) {
      setShowScrollToBottom(scrollFromBottom > 100);
    }
    
  // Mobile header visibility and scroll direction tracking
  if (isMobile) {
    const scrollDelta = currentScrollTop - lastScrollTopRef.current;
    const isScrollingUpNow = scrollDelta < -5; // Detect upward scrolling
    const isScrollingDownNow = scrollDelta > 5; // Detect downward scrolling
    
    // Update scroll direction state for burgundy carrot with persistence
    if (isScrollingUpNow) {
      // Clear any existing timer and show carrot immediately
      if (scrollUpTimerRef.current) {
        clearTimeout(scrollUpTimerRef.current);
      }
      setIsScrollingUp(true);
      
      // Set timer to hide carrot after 2.5 seconds of no upward scrolling
      scrollUpTimerRef.current = setTimeout(() => {
        setIsScrollingUp(false);
      }, 2500);
    } else if (isScrollingDownNow) {
      // Hide carrot immediately on downward scroll
      if (scrollUpTimerRef.current) {
        clearTimeout(scrollUpTimerRef.current);
        scrollUpTimerRef.current = null;
      }
      setIsScrollingUp(false);
    }
      
      // Show header immediately on ANY upward scroll (especially when keyboard is active)
      if (scrollDelta < -1) { // More sensitive threshold
        console.log('🔝 Showing header - upward scroll detected', { scrollDelta });
        setHeaderVisible(true);
      }
      
      lastScrollTopRef.current = currentScrollTop;
    }
  }, [isMobile, setHeaderVisible, isKeyboardVisible]);

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollUpTimerRef.current) {
        clearTimeout(scrollUpTimerRef.current);
      }
    };
  }, []);

  // Enhanced touch detection for immediate header reveal
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    if (touch) {
      touchStartYRef.current = touch.clientY;
      
      console.log('👆 Touch start:', { 
        touchY: touch.clientY, 
        isKeyboardVisible,
        screenHeight: window.innerHeight 
      });
      
      // If touching near top of screen, immediately show header  
      if (touch.clientY < 150) {
        console.log('🔝 FORCE showing header - top touch detected');
        forceVisible();
      }
    }
  }, [isMobile, forceVisible, isKeyboardVisible]);

  // Immediate upward swipe detection
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    if (touch && touchStartYRef.current > 0) {
      const deltaY = touch.clientY - touchStartYRef.current;
      
      console.log('👆 Touch move:', { 
        deltaY, 
        currentY: touch.clientY, 
        startY: touchStartYRef.current 
      });
      
      // Show header immediately on downward swipe (pulling down) - more sensitive
      if (deltaY > 20) {
        console.log('🔝 FORCE showing header - downward swipe detected');
        forceVisible();
        // Prevent further processing to avoid bounce
        touchStartYRef.current = 0;
      }
    }
  }, [isMobile, forceVisible]);

  return (
    <div className="flex-1 min-h-0 relative bg-burgundy-950">
      {/* Pull tab for navigation access when keyboard is active */}
      <NavigationPullTab onOpenNavigation={onOpenSidebar} />
      
      {/* Burgundy carrot navigation for keyboard + scroll up scenarios */}
      <BurgundyNavCarrot isScrollingUp={isScrollingUp} onOpenNavigation={onOpenSidebar} />
      
      <ScrollArea 
        viewportRef={viewportRef}
        className="h-full"
        style={isMobile ? { 
          WebkitOverflowScrolling: 'touch' as any,
          overscrollBehavior: 'contain',
        } : undefined}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
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
            
            <div className="h-1" />
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