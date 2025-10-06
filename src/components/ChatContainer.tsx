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
import OnboardingStepNudge from "./OnboardingStepNudge";

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
  accessLevel?: string;
  profileCompletion?: number;
  onStartProfile?: () => void;
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
  accessLevel,
  profileCompletion = 0,
  onStartProfile = () => {}
}: ChatContainerProps) => {
  const { isMobile } = useOptimizedMobile();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const prevChatLengthRef = useRef(chatHistory.length);

  // Simple scroll to bottom function
  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const viewport = viewportRef.current;
    const scrollFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    
    setShowScrollToBottom(scrollFromBottom > 100);
  }, []);

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


  // Show centered nudge when profile incomplete and no chat history
  const showCenteredNudge = accessLevel === 'profile-required' && chatHistory.length === 0;

  return (
    <div className="flex-1 min-h-0 overflow-hidden relative bg-burgundy-950">
      <ScrollArea 
        viewportRef={viewportRef}
        className="h-full w-full"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation history"
      >
        <div 
          className="pt-2 md:px-4 md:pt-3 md:pb-2"
          style={{
            paddingBottom: '8px',
            paddingLeft: isMobile ? 'max(4px, env(safe-area-inset-left))' : '16px',
            paddingRight: isMobile ? 'max(4px, env(safe-area-inset-right))' : '16px'
          }}
        >
          <div className="md:space-y-3 md:max-w-[54rem] md:mx-auto md:pl-12 md:pr-4" role="list" aria-label="Chat messages">
            
            {/* Centered Onboarding Nudge - shown when profile incomplete */}
            {showCenteredNudge && (
              <div className="flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
                <OnboardingStepNudge
                  completion={profileCompletion}
                  onStartProfile={onStartProfile}
                  className="max-w-md w-full scale-105 md:scale-110"
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
            
            <div className="h-4 md:h-6" />
          </div>
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <Button
          onClick={() => scrollToBottom('smooth')}
          className="fixed bottom-24 right-4 md:right-8 rounded-full w-12 h-12 shadow-lg z-10"
          size="icon"
          variant="secondary"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatContainer;