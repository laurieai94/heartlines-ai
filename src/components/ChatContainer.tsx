import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AIChatMessage from './AIChatMessage';
import { ChatMessage } from '@/types/AIInsights';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { ScrollToTopArrow } from './ScrollToTopArrow';
import OnboardingStepNudge from './OnboardingStepNudge';

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
  const { isMobile } = useOptimizedMobile();
  const prevChatLengthRef = useRef(chatHistory.length);


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
            />
          </div>
        );
      })}

      <div className="h-2 md:h-4" />
    </>
  );

  return (
    <div className="flex-1 md:min-h-0 md:max-h-none relative md:h-full bg-burgundy-800 md:bg-transparent">
      {/* ScrollArea for all screen sizes */}
      <ScrollArea 
        id="chat-scroll"
        viewportRef={viewportRef}
        className="h-full w-full bg-burgundy-800 md:bg-transparent"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
        style={{ height: '100%' }}
      >
        <div 
          className="pt-2 md:pt-3"
          style={{
            paddingBottom: `${(inputSectionHeight || 280) + 16}px`,
            paddingTop: 'max(8px, env(safe-area-inset-top))',
            paddingLeft: 'max(4px, env(safe-area-inset-left))',
            paddingRight: 'max(4px, env(safe-area-inset-right))'
          }}
        >
          <div role="list" aria-label="Chat messages">
            {renderMessages()}
          </div>
        </div>
      </ScrollArea>

      {/* Scroll to top arrow - handles its own logic */}
      <ScrollToTopArrow scrollContainerRef={viewportRef} chatHistory={chatHistory} />
      
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
