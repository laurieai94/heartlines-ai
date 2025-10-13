import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { ScrollToTopArrow } from './ScrollToTopArrow';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";
import { ChatHeader } from './chat/ChatHeader';
import { useViewport } from '@/contexts/ViewportContext';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import OnboardingStepNudge from './OnboardingStepNudge';

export interface ChatContainerRef {
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void;
  scrollToBottomIfScrolledUp: () => void;
}

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
  profileCompletion?: number;
  onCompleteProfile?: () => void;
  showProfileNudge?: boolean;
  inputSectionHeight?: number;
}

const ChatContainer = forwardRef<ChatContainerRef, ChatContainerProps>(({ 
  chatHistory, 
  loading, 
  userName, 
  isConfigured, 
  conversationStarter, 
  isHistoryLoaded,
  userTyping,
  onNewConversation = () => {},
  onOpenSidebar,
  profileCompletion = 100,
  onCompleteProfile,
  showProfileNudge = false,
  inputSectionHeight
}, ref) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const prevChatLengthRef = useRef(chatHistory.length);
  const { isKeyboardVisible } = useViewport();
  const { forceVisible } = useMobileHeaderVisibility();
  const userIsScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced scroll to bottom with buffer
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    requestAnimationFrame(() => {
      const scrollTarget = viewport.scrollHeight - viewport.clientHeight + 10;
      viewport.scrollTo({
        top: scrollTarget,
        behavior
      });
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

  // Reveal navigation and scroll to top
  const revealNavigationAndScrollTop = useCallback(() => {
    forceVisible(); // Show the header/navigation
    scrollToTop('smooth'); // Scroll chat to top
    
    // Also scroll page to top to fully reveal header
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [forceVisible, scrollToTop]);

  // Smart scroll to bottom only if user has scrolled up
  const scrollToBottomIfScrolledUp = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const scrollTop = viewport.scrollTop;
    const scrollHeight = viewport.scrollHeight;
    const clientHeight = viewport.clientHeight;
    
    // Calculate if user is near bottom (within 100px tolerance)
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 100;
    
    // Only scroll if user has scrolled away from bottom
    if (!isNearBottom) {
      scrollToBottom('smooth');
    }
  }, [scrollToBottom]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollToBottom,
    scrollToBottomIfScrolledUp
  }), [scrollToBottom, scrollToBottomIfScrolledUp]);


  // Auto-scroll to bottom ONLY for new AI messages
  useEffect(() => {
    const hasNewMessage = prevChatLengthRef.current < chatHistory.length;
    const lastMessage = chatHistory[chatHistory.length - 1];
    const isAIMessage = lastMessage?.type === 'ai';
    
    // Only auto-scroll if it's a new AI message (not user's own message)
    if ((hasNewMessage && isAIMessage) || chatHistory.length <= 1) {
      // Double RAF ensures DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(hasNewMessage ? 'smooth' : 'auto');
        });
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

  // Track user manual scrolling
  useEffect(() => {
    if (!isMobilePhone || !viewportRef.current) return;
    
    const viewport = viewportRef.current;
    
    const handleTouchStart = () => {
      userIsScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
    
    const handleTouchEnd = () => {
      // Keep flag true for 2 seconds to prevent auto-scroll interference
      scrollTimeoutRef.current = setTimeout(() => {
        userIsScrollingRef.current = false;
      }, 2000);
    };
    
    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewport.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobilePhone]);

  // Intersection Observer failsafe - ensure last message is visible (but not during manual scroll)
  useEffect(() => {
    if (!isMobilePhone || chatHistory.length === 0) return;
    if (!lastMessageRef.current || !viewportRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only auto-scroll if user is NOT manually scrolling
        if (entry.intersectionRatio < 0.9 && !userIsScrollingRef.current) {
          requestAnimationFrame(() => {
            scrollToBottom('smooth');
          });
        }
      },
      {
        root: viewportRef.current,
        threshold: 0.9
      }
    );

    observer.observe(lastMessageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatHistory.length, isMobilePhone, scrollToBottom]);

  // Render chat messages (shared between mobile and desktop)
  const renderMessages = () => (
    <>
      {/* Chat Messages */}
      {chatHistory.map((message, index) => {
        const isUser = message.type === 'user';
        const prevMessage = index > 0 ? chatHistory[index - 1] : null;
        const nextMessage = index < chatHistory.length - 1 ? chatHistory[index + 1] : null;
        const isLastMessage = index === chatHistory.length - 1;
        
        // Group consecutive messages from the same sender within 5 minutes
        const isFirstInGroup = !prevMessage || 
          prevMessage.type !== message.type || 
          (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 300000;
        
        const isLastInGroup = !nextMessage || 
          nextMessage.type !== message.type || 
          (nextMessage ? new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() : 0) > 300000;

        return (
          <div 
            key={message.id} 
            ref={isLastMessage ? lastMessageRef : null}
            data-message-id={message.id}
          >
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
            className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch px-1"
            style={{ 
              paddingTop: '0.5rem',
              paddingBottom: `${(inputSectionHeight || 280) + 24}px`
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
          role="log"
          aria-live="polite"
          aria-label="Chat conversation history"
        >
          <div 
            className={`pt-2 md:pt-3 pb-4 md:pb-6 ${showProfileNudge ? 'md:pb-64' : ''}`}
            style={{
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

      {/* Scroll to top arrow - handles its own logic */}
      <ScrollToTopArrow scrollContainerRef={viewportRef} chatHistory={chatHistory} />
      
      {/* Fixed profile completion nudge - floats above scrolling messages */}
      {showProfileNudge && !loading && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{
            top: isMobilePhone 
              ? 'calc(50vh - 2rem)' // Center in mobile viewport
              : '50%', // Center in desktop viewport
            transform: isMobilePhone 
              ? 'translate(-50%, -50%)' 
              : 'translate(-50%, -50%)'
          }}
        >
          <div className="pointer-events-auto">
            <OnboardingStepNudge 
              completion={profileCompletion}
              onStartProfile={onCompleteProfile || (() => {})}
              variant="centered"
            />
          </div>
        </div>
      )}
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
