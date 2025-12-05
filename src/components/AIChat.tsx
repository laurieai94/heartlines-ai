import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { UseProfileGoalsReturn } from "@/hooks/useProfileGoals";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useOptimizedSubscription } from "@/hooks/useOptimizedSubscription";
import { useChatEffects } from "./chat/ChatEffects";
import { useChatMessageHandler } from "./chat/ChatMessageHandler";
import { ChatLayout } from "./chat/ChatLayout";
import { ChatHeader } from "./chat/ChatHeader";
import { MemoizedChatContainer } from "./chat/MemoizedChatContainer";
import MemoizedChatInputSection from "./chat/MemoizedChatInputSection";
import { useNavigation } from "@/contexts/NavigationContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChatContainerRef } from "./ChatContainer";
import { useOptimizedMobile } from "@/hooks/useOptimizedMobile";
import { useKeyboardDetection } from "@/hooks/useKeyboardDetection";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  profileGoals?: UseProfileGoalsReturn;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isConfigured: boolean;
  conversationStarter?: string;
  onNewConversation?: () => void;
  onOpenSidebar?: () => void;
  onSupabaseConfigured: (configured: boolean) => void;
  onPersistChat?: (messages: ChatMessage[]) => void;
  // Chat history props
  conversations?: any[];
  currentConversationId?: string | null;
  historyLoading?: boolean;
  onLoadConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  isStartingNewConversation?: boolean;
  showStarters?: boolean;
  onCloseStarters?: () => void;
}

const AIChat = ({ 
  profiles, 
  demographicsData, 
  profileGoals,
  chatHistory, 
  setChatHistory, 
  isConfigured, 
  conversationStarter,
  onNewConversation,
  onOpenSidebar,
  onSupabaseConfigured,
  onPersistChat,
  conversations = [],
  currentConversationId = null,
  historyLoading = false,
  onLoadConversation = () => {},
  onDeleteConversation = () => {},
  isStartingNewConversation = false,
  showStarters = false,
  onCloseStarters = () => {}
}: AIChatProps) => {
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [inputSectionHeight, setInputSectionHeight] = useState(150);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useUserProfile();
  const { canInteract, accessLevel, profileCompletion } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const chatContainerRef = useRef<ChatContainerRef>(null);
  const isKeyboardVisible = useKeyboardDetection();
  const prevKeyboardVisible = useRef(isKeyboardVisible);
  const prevInputHeightRef = useRef(inputSectionHeight);

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  // Get subscription data to determine if limit banner should show
  const { message_limit, messages_used, subscribed } = useOptimizedSubscription();
  const messagesRemaining = (message_limit || 0) - (messages_used || 0);
  const hasLimitBanner = messagesRemaining <= 3 && !subscribed;

  const { loading, sendMessage } = useChatMessageHandler({
    profiles,
    demographicsData,
    profileGoals,
    chatHistory,
    setChatHistory,
    canInteract,
    isStartingNewConversation
  });

  // Handle new conversation
  const handleNewConversation = useCallback(() => {
    setChatHistory([]);
    if (onNewConversation) {
      onNewConversation();
    }
  }, [onNewConversation, setChatHistory]);

  // Handle opening sidebar
  const handleOpenChatSidebar = useCallback(() => {
    onOpenSidebar?.();
    setIsSidebarOpen(true);
  }, [onOpenSidebar]);

  // Handle input focus - scroll to bottom to show latest message (mobile only)
  const handleInputFocus = useCallback(() => {
    if (!isMobilePhone) return;
    
    // Immediate scroll to bottom to show latest message
    chatContainerRef.current?.scrollToBottom?.('smooth');
    
    // Delayed scroll to account for keyboard animation
    setTimeout(() => {
      chatContainerRef.current?.scrollToBottom?.('smooth');
    }, 300);
  }, [isMobilePhone]);

  // Mark history as loaded only when both canInteract is true and history loading is complete
  useEffect(() => {
    if (canInteract && !historyLoading) {
      setIsHistoryLoaded(true);
    }
  }, [canInteract, historyLoading]);

  // Phase 1: Scroll to show messages when keyboard becomes visible
  useEffect(() => {
    if (!isMobilePhone) return;
    
    // Detect keyboard visibility transition
    if (isKeyboardVisible && !prevKeyboardVisible.current) {
      const offset = inputSectionHeight + 100;
      chatContainerRef.current?.scrollToShowMessages?.(offset);
    }
    
    prevKeyboardVisible.current = isKeyboardVisible;
  }, [isKeyboardVisible, isMobilePhone, inputSectionHeight]);

  // Phase 3: Listen for visualViewport resize events (optimized with debouncing)
  useEffect(() => {
    if (!isMobilePhone || !window.visualViewport) return;

    let lastHeight = window.visualViewport.height;
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentHeight = window.visualViewport?.height || 0;
        
        // Keyboard appearing (viewport shrinking)
        if (currentHeight < lastHeight) {
          const offset = inputSectionHeight + 100;
          chatContainerRef.current?.scrollToShowMessages?.(offset);
        }
        
        lastHeight = currentHeight;
      }, 50); // Debounce by 50ms
    };

    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [isMobilePhone, inputSectionHeight]);

  // Scroll to keep messages visible when input section grows (banner appears)
  useEffect(() => {
    if (!isMobilePhone) return;
    
    const heightDiff = inputSectionHeight - prevInputHeightRef.current;
    
    // If height increased by more than 50px (banner appeared), scroll to show latest message
    if (heightDiff > 50) {
      setTimeout(() => {
        chatContainerRef.current?.scrollToBottom?.('smooth');
      }, 100);
    }
    
    prevInputHeightRef.current = inputSectionHeight;
  }, [inputSectionHeight, isMobilePhone]);

  // Auto-scroll to latest message when navigating to /coach on mobile
  useEffect(() => {
    if (!isMobilePhone) return;
    
    // Detect when user navigates to this page/tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && chatHistory.length > 0) {
        // Small delay to ensure component is fully rendered
        setTimeout(() => {
          chatContainerRef.current?.scrollToBottom?.('smooth');
        }, 100);
      }
    };
    
    // Also handle when component becomes visible via tab change
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail?.tab === 'insights' && chatHistory.length > 0) {
        setTimeout(() => {
          chatContainerRef.current?.scrollToBottom?.('smooth');
        }, 150);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('dashboard:tabChange', handleTabChange as EventListener);
    
    // Always scroll on mount if there are messages
    if (chatHistory.length > 0) {
      setTimeout(() => {
        chatContainerRef.current?.scrollToBottom?.('smooth');
      }, 200);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('dashboard:tabChange', handleTabChange as EventListener);
    };
  }, [isMobilePhone, chatHistory.length]);

useChatEffects({
  chatHistory,
  setChatHistory,
  canInteract,
  isHistoryLoaded,
  conversationStarter,
  isConfigured,
  onSendMessage: sendMessage,
  isStartingNewConversation,
  onPersistConversation: onPersistChat || (() => {}),
  currentConversationId: currentConversationId || null
});

  return (
    <>
      {/* Chat Header - Mobile only, renders above ChatLayout */}
      {isMobilePhone && (
        <div className="sticky top-[60px] left-0 right-0 z-30">
          <ChatHeader
            userName={userName} 
            onNewConversation={handleNewConversation} 
            onOpenSidebar={handleOpenChatSidebar} 
          />
        </div>
      )}
      
      <ChatLayout 
        userName={userName} 
        onNewConversation={handleNewConversation} 
        onOpenSidebar={handleOpenChatSidebar}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        loading={historyLoading}
        onLoadConversation={onLoadConversation}
        onDeleteConversation={onDeleteConversation}
        hideHeader={isMobilePhone}
      >
        <div className="relative flex flex-col h-full">
          <MemoizedChatContainer
          ref={chatContainerRef}
          chatHistory={chatHistory}
          loading={loading}
          userName={userName}
          isConfigured={isConfigured}
          conversationStarter={conversationStarter}
          isHistoryLoaded={isHistoryLoaded}
          onNewConversation={handleNewConversation}
          onOpenSidebar={onOpenSidebar}
          profileCompletion={profileCompletion}
          onCompleteProfile={() => goToProfile('chat')}
          showProfileNudge={(() => {
            const isCompleting = sessionStorage.getItem('questionnaire-completing');
            if (isCompleting) {
              if (!import.meta.env.PROD) {
                console.log('[AIChat] Questionnaire completing - hiding nudge');
              }
              return false;
            }
            
            const shouldShowNudge = accessLevel === 'profile-required' && !!user && profileCompletion < 100;
            if (!import.meta.env.PROD) {
              console.log('[AIChat] Nudge logic:', { accessLevel, hasUser: !!user, profileCompletion, shouldShowNudge, isCompleting });
            }
            return shouldShowNudge;
          })()}
          inputSectionHeight={inputSectionHeight}
          currentConversationId={currentConversationId}
          hasLimitBanner={hasLimitBanner}
        />

        <MemoizedChatInputSection
          onSendMessage={sendMessage}
          loading={loading}
          userName={userName}
          partnerName={partnerName}
          chatHistory={chatHistory}
          isConfigured={isConfigured}
          canInteract={canInteract}
          isHistoryLoaded={isHistoryLoaded}
          showStarters={showStarters}
          onCloseStarters={onCloseStarters}
          onHeightChange={setInputSectionHeight}
          onInputFocus={handleInputFocus}
        />
      </div>
    </ChatLayout>
    </>
  );
};

export default React.memo(AIChat, (prev, next) => {
  return (
    prev.chatHistory.length === next.chatHistory.length &&
    prev.profiles === next.profiles &&
    prev.demographicsData === next.demographicsData &&
    prev.isConfigured === next.isConfigured &&
    prev.conversationStarter === next.conversationStarter &&
    prev.currentConversationId === next.currentConversationId &&
    prev.isStartingNewConversation === next.isStartingNewConversation &&
    prev.showStarters === next.showStarters &&
    prev.historyLoading === next.historyLoading
  );
});
