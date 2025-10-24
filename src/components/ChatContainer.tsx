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
import TypingIndicator from './chat/TypingIndicator';
import DateSeparator from './chat/DateSeparator';
import { isSameDay } from 'date-fns';

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
  const [viewportHeight, setViewportHeight] = useState(() => 
    window.visualViewport?.height || window.innerHeight
  );

  // Track viewport height changes for keyboard detection
  useEffect(() => {
    if (!isMobilePhone) return;
    
    const handleViewportResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [isMobilePhone]);

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


  // Auto-scroll to bottom for ALL new messages (user and AI)
  useEffect(() => {
    const hasNewMessage = prevChatLengthRef.current < chatHistory.length;
    const lastMessage = chatHistory[chatHistory.length - 1];
    const isUserMessage = lastMessage?.type === 'user';
    
    // Auto-scroll for all new messages
    if (hasNewMessage) {
      // Double RAF ensures DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Instant scroll for user messages, smooth for AI messages
          scrollToBottom(isUserMessage ? 'auto' : 'smooth');
        });
      });
    } else if (chatHistory.length <= 1) {
      scrollToBottom('auto');
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
        
        // Check if we need a date separator
        const currentDate = new Date(message.timestamp);
        const prevDate = prevMessage ? new Date(prevMessage.timestamp) : null;
        const showDateSeparator = prevDate && !isSameDay(currentDate, prevDate);
        
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
            {showDateSeparator && <DateSeparator date={currentDate} />}
            <AIChatMessage 
              message={message} 
              userName={userName}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          </div>
        );
      })}

      <div className="h-2 md:h-4" />
    </>
  );

  return (
    <div className="flex-1 min-h-0 md:max-h-none relative bg-burgundy-800">
      {isMobilePhone ? (
        /* Mobile: Fixed height container with keyboard-aware positioning */
        <div 
          className="fixed inset-0 flex flex-col"
          style={{ 
            top: 'calc(env(safe-area-inset-top) + 7rem)', // Account for site nav bar (3rem/48px) + ChatHeader (4rem/64px)
            height: isMobilePhone && window.visualViewport
              ? `${viewportHeight - 112}px` // 112px = 7rem converted to px
              : 'calc(100dvh - env(safe-area-inset-top) - 7rem)',
            zIndex: 10,
            transition: 'height 0.2s ease-out',
            background: 'linear-gradient(180deg, rgb(86, 18, 31) 0%, rgb(86, 18, 31) 80%, rgba(251, 146, 60, 0.03) 100%)' // Subtle coral warmth at bottom
          }}
        >
          
          {/* Scrollable Messages - fills remaining space */}
          <div 
            ref={viewportRef}
            className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch px-1"
            style={{ 
              paddingTop: '0.5rem',
              paddingBottom: `${(inputSectionHeight || 280) + 40 + (showProfileNudge ? 200 : 0)}px`, // Reduced from 80 to 40 since keyboard handling is now in container height
              background: 'rgb(86, 18, 31)', // burgundy-800 - prevent white screen
              minHeight: '100%'
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
            className={`pt-2 md:pt-3 pb-8 md:pb-12 ${showProfileNudge ? 'md:pb-64' : ''}`}
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
