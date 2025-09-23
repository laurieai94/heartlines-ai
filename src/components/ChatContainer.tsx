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
  const { setVisible: setHeaderVisible } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  
  // Simple references for scroll management
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);
  
  // Scroll direction tracking
  const lastScrollTopRef = useRef(0);
  const scrollThresholdRef = useRef(0);

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
    });
  }, []);

  // Enhanced scroll handler with keyboard-aware direction detection
  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const currentScrollTop = viewport.scrollTop;
    const scrollFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    
    // Desktop scroll-to-bottom button
    if (!isMobile) {
      setShowScrollToBottom(scrollFromBottom > 100);
    }
    
    // Mobile header visibility on upward scroll - more sensitive when keyboard is visible
    if (isMobile) {
      const scrollDelta = currentScrollTop - lastScrollTopRef.current;
      
      // Dynamic threshold based on keyboard state
      const threshold = isKeyboardVisible ? 10 : 30; // Much lower threshold when keyboard is active
      
      // If scrolling up, show header
      if (scrollDelta < 0) {
        scrollThresholdRef.current += Math.abs(scrollDelta);
        if (scrollThresholdRef.current > threshold) {
          setHeaderVisible(true);
          scrollThresholdRef.current = 0;
        }
      } else {
        // Reset threshold when scrolling down
        scrollThresholdRef.current = 0;
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

  // Handle touch events for better keyboard interaction
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isKeyboardVisible) return;
    
    const touch = e.touches[0];
    if (touch && touch.clientY < 100) {
      // If touching near top of screen with keyboard visible, immediately show header
      setHeaderVisible(true);
    }
  }, [isMobile, isKeyboardVisible, setHeaderVisible]);

  // Direct touch move detection for enhanced mobile responsiveness
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isKeyboardVisible) return;
    
    const touch = e.touches[0];
    const startY = e.currentTarget.getAttribute('data-start-y');
    
    if (startY && touch) {
      const deltaY = touch.clientY - parseInt(startY);
      // If user is swiping down from near the top, show header immediately
      if (deltaY > 20 && touch.clientY < 150) {
        setHeaderVisible(true);
      }
    }
  }, [isMobile, isKeyboardVisible, setHeaderVisible]);

  return (
    <div className="flex-1 min-h-0 relative bg-burgundy-950">
      {/* Pull tab for navigation access when keyboard is active */}
      <NavigationPullTab onOpenNavigation={onOpenSidebar} />
      
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