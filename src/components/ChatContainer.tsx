import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import OnboardingStepNudge from './OnboardingStepNudge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import { BRAND } from '@/branding';

import DateSeparator from './chat/DateSeparator';
import { isSameDay } from 'date-fns';

export interface ChatContainerRef {
  scrollToBottom: (behavior?: 'auto' | 'smooth', offset?: number) => void;
  scrollToBottomIfScrolledUp: () => void;
  scrollToShowMessages: (offset?: number) => void;
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
  currentConversationId?: string | null;
  hasLimitBanner?: boolean;
  onRetry?: (errorMessageId: number, originalMessage: string) => void;
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
  inputSectionHeight,
  currentConversationId,
  hasLimitBanner = false,
  onRetry
}, ref) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useOptimizedMobile();
  const prevChatLengthRef = useRef(chatHistory.length);


  // Enhanced scroll to bottom with buffer and optional offset
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth', offset: number = 0) => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    requestAnimationFrame(() => {
      const scrollTarget = viewport.scrollHeight - viewport.clientHeight - offset;
      viewport.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior
      });
    });
  }, []);

  // Scroll to show messages (not spacer) when keyboard is visible
  const scrollToShowMessages = useCallback((offset: number = 280) => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    requestAnimationFrame(() => {
      // Scroll to show messages, accounting for input section + keyboard space
      const scrollTarget = viewport.scrollHeight - viewport.clientHeight - offset;
      viewport.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    });
  }, []);

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
    scrollToBottomIfScrolledUp,
    scrollToShowMessages
  }), [scrollToBottom, scrollToBottomIfScrolledUp, scrollToShowMessages]);


  // Optimized: Combined scroll effects to reduce effect overhead
  useEffect(() => {
    const hasNewMessage = prevChatLengthRef.current < chatHistory.length;
    const lastMessage = chatHistory[chatHistory.length - 1];
    const isUserMessage = lastMessage?.type === 'user';
    
    // Handle initial scroll when history loads
    if (isHistoryLoaded && prevChatLengthRef.current === 0 && chatHistory.length > 0) {
      scrollToBottom('auto');
      prevChatLengthRef.current = chatHistory.length;
      return;
    }
    
    // Handle conversation switching
    if (currentConversationId && chatHistory.length > 0 && hasNewMessage) {
      setTimeout(() => scrollToBottom('auto'), 50);
      prevChatLengthRef.current = chatHistory.length;
      return;
    }
    
    // Handle new messages
    if (hasNewMessage) {
      requestAnimationFrame(() => {
        scrollToBottom(isUserMessage ? 'auto' : 'smooth');
      });
      prevChatLengthRef.current = chatHistory.length;
    }
  }, [chatHistory.length, isHistoryLoaded, currentConversationId, scrollToBottom]);

  // Scroll to bottom during streaming (when loading is true)
  useEffect(() => {
    if (loading && chatHistory.length > 0) {
      const interval = setInterval(() => {
        scrollToBottom('auto');
      }, 100); // Scroll every 100ms while streaming
      
      return () => clearInterval(interval);
    }
  }, [loading, scrollToBottom, chatHistory.length]);

  // Memoized style objects to prevent recreation on every render
  const mobileScrollStyle = useMemo(() => ({
    WebkitOverflowScrolling: 'touch' as const,
    overscrollBehaviorY: 'auto' as const,
    paddingBottom: `${Math.max(inputSectionHeight || 0, 120) + (hasLimitBanner ? 60 : 16)}px`,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    position: 'relative' as const
  }), [inputSectionHeight, hasLimitBanner]);

  const contentPaddingStyle = useMemo(() => ({
    paddingLeft: isMobile ? 'max(8px, env(safe-area-inset-left))' : 'max(4px, env(safe-area-inset-left))',
    paddingRight: isMobile ? 'max(8px, env(safe-area-inset-right))' : 'max(4px, env(safe-area-inset-right))'
  }), [isMobile]);

  const containerStyle = useMemo(() => ({}), []);

  const desktopScrollStyle = useMemo(() => ({ 
    height: '100%'
  }), []);

  const desktopContentPaddingStyle = useMemo(() => ({
    paddingLeft: 'max(4px, env(safe-area-inset-left))',
    paddingRight: 'max(4px, env(safe-area-inset-right))'
  }), []);

  const desktopSpacerStyle = useMemo(() => ({}), []);


  // Render chat messages (shared between mobile and desktop)
  const renderMessages = () => (
    <>
      {/* Chat Messages */}
      {chatHistory.map((message, index) => {
        const isUser = message.type === 'user';
        const prevMessage = index > 0 ? chatHistory[index - 1] : null;
        const nextMessage = index < chatHistory.length - 1 ? chatHistory[index + 1] : null;
        
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
            data-message-id={message.id}
          >
            {showDateSeparator && <DateSeparator date={currentDate} />}
            <AIChatMessage 
              message={message} 
              userName={userName}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              isLoading={loading && index === chatHistory.length - 1 && message.type === 'ai'}
              onRetry={message.isError && message.originalUserMessage && onRetry 
                ? () => onRetry(message.id, message.originalUserMessage!) 
                : undefined}
            />
          </div>
        );
      })}

      {/* Kai thinking avatar - shown when no AI message exists yet */}
      {loading && (chatHistory.length === 0 || chatHistory[chatHistory.length - 1]?.type === 'user') && (
        <div className={`${isMobile ? 'px-2' : 'md:max-w-3xl lg:max-w-4xl md:mx-auto md:px-6'} animate-fade-in`}>
          <div className="flex gap-2 md:gap-3 mb-2 md:mb-3">
            {/* Kai's Pulsing Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-[40px] h-[40px] md:w-[44px] md:h-[44px]">
                {/* Pulsing glow */}
                <div className={`absolute inset-0 rounded-full blur-sm drop-shadow-lg ${
                  isMobile ? 'opacity-30' : 'opacity-25'
                } bg-gradient-to-r from-pink-400 to-coral-400 animate-pulse`}></div>
                
                {/* Avatar */}
                <Avatar className="relative z-10 shadow-lg drop-shadow-lg w-[40px] h-[40px] md:w-[44px] md:h-[44px] md:border-2 md:border-white bg-gradient-to-br from-coral-400 to-burgundy-500 ring-4 ring-pink-400/40 animate-pulse">
                  <AvatarImage 
                    src={BRAND.coach.avatarSrc} 
                    alt={BRAND.coach.name} 
                    className="object-cover"
                    loading="eager" 
                    fetchPriority="high"
                    decoding="async" 
                  />
                  <AvatarFallback delayMs={Infinity} className="bg-gradient-to-br from-coral-400 to-burgundy-500 text-white text-sm md:text-xs font-medium">
                    <Heart className="w-4 h-4 md:w-4 md:h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Thinking text indicator */}
            <div className="flex items-center">
              <span className="text-xs text-pink-200/60 italic">
                pondering
                <span className="inline-flex ml-0.5 gap-[2px]">
                  <span className="animate-dot-pulse [animation-delay:0s]">.</span>
                  <span className="animate-dot-pulse [animation-delay:0.15s]">.</span>
                  <span className="animate-dot-pulse [animation-delay:0.3s]">.</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="h-[33px] md:h-4" />
    </>
  );

  return (
    <div 
      className="chat-root absolute inset-0 flex flex-col md:relative md:flex-1 md:min-h-0"
      style={containerStyle}
    >
      {/* Conditional rendering: Native scroll on mobile, Radix ScrollArea on desktop */}
      {isMobile ? (
        /* Native scrolling for mobile */
        <div
          id="chat-scroll"
          ref={viewportRef}
          className="chat-scroll mobile-native-scroll absolute left-0 right-0 top-0 md:top-0 bottom-0 overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation history"
        style={mobileScrollStyle}
        >
        <div 
          className="pt-[88px] md:pt-[16px]"
          style={contentPaddingStyle}
          data-message-container
        >
            <div role="list" aria-label="Chat messages">
              {renderMessages()}
            </div>
          </div>
        </div>
      ) : (
        /* Radix ScrollArea for desktop/tablet */
        <ScrollArea 
          viewportRef={viewportRef}
          className="h-full w-full bg-burgundy-800"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation history"
          style={desktopScrollStyle}
        >
          <div 
            className="pt-[15px] bg-burgundy-800"
            style={desktopContentPaddingStyle}
          >
            <div role="list" aria-label="Chat messages">
              {renderMessages()}
            </div>
            
            {/* Content spacer instead of padding - prevents purple rectangle */}
            <div 
              className="md:h-[32px] w-full bg-burgundy-800"
              style={desktopSpacerStyle}
              aria-hidden="true"
            />
          </div>
        </ScrollArea>
      )}

      
      {/* Fixed profile completion nudge - floats above scrolling messages */}
      {showProfileNudge && !loading && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
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
