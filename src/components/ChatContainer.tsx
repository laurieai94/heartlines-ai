import { useCallback, useEffect, useRef, useState } from 'react';
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
  onOpenSidebar,
  profileCompletion = 100,
  onCompleteProfile,
  showProfileNudge = false
}: ChatContainerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const prevChatLengthRef = useRef(chatHistory.length);
  const { isKeyboardVisible } = useViewport();
  const { forceVisible } = useMobileHeaderVisibility();

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
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

  // Auto-scroll to bottom when keyboard opens on mobile (only if user has scrolled away)
  useEffect(() => {
    if (!isMobilePhone || !isKeyboardVisible) return;
    
    // Small delay to ensure keyboard animation has started
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isKeyboardVisible, isMobilePhone, scrollToBottom]);

  // Render chat messages (shared between mobile and desktop)
  const renderMessages = () => (
    <>
      {/* Profile completion nudge - centered when chat is empty */}
      {showProfileNudge && chatHistory.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <OnboardingStepNudge 
            completion={profileCompletion}
            onStartProfile={onCompleteProfile || (() => {})}
            variant="centered"
          />
        </div>
      )}

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
              paddingBottom: isKeyboardVisible ? '8rem' : '16rem' // Reduce padding when keyboard is visible
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
            className="pt-2 md:pt-3 md:pb-2"
            style={{
              paddingBottom: '4px',
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
    </div>
  );
};

export default ChatContainer;
