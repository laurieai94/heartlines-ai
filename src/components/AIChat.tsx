
import React, { useState, useEffect, useCallback } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { UseProfileGoalsReturn } from "@/hooks/useProfileGoals";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useChatEffects } from "./chat/ChatEffects";
import { useChatMessageHandler } from "./chat/ChatMessageHandler";
import { ChatLayout } from "./chat/ChatLayout";
import { MemoizedChatContainer } from "./chat/MemoizedChatContainer";
import MemoizedChatInputSection from "./chat/MemoizedChatInputSection";

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
  const [userTyping, setUserTyping] = useState(false);
  const { profile } = useUserProfile();
  const { canInteract } = useProgressiveAccess();

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  const { loading, sendMessage } = useChatMessageHandler({
    profiles,
    demographicsData,
    profileGoals,
    chatHistory,
    setChatHistory,
    canInteract
  });

  // Handle new conversation
  const handleNewConversation = useCallback(() => {
    setChatHistory([]);
    if (onNewConversation) {
      onNewConversation();
    }
  }, [onNewConversation, setChatHistory]);

  // Mark history as loaded only when both canInteract is true and history loading is complete
  useEffect(() => {
    if (canInteract && !historyLoading) {
      setIsHistoryLoaded(true);
    }
  }, [canInteract, historyLoading]);

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
    <ChatLayout 
      userName={userName} 
      onNewConversation={handleNewConversation} 
      onOpenSidebar={onOpenSidebar}
      conversations={conversations}
      currentConversationId={currentConversationId}
      loading={historyLoading}
      onLoadConversation={onLoadConversation}
      onDeleteConversation={onDeleteConversation}
    >
      <div className="flex flex-col h-full min-h-0">
        <MemoizedChatContainer
          chatHistory={chatHistory}
          loading={loading}
          userName={userName}
          isConfigured={isConfigured}
          conversationStarter={conversationStarter}
          isHistoryLoaded={isHistoryLoaded}
          userTyping={userTyping}
          onNewConversation={handleNewConversation}
          onOpenSidebar={onOpenSidebar}
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
          onUserTypingChange={setUserTyping}
        />
      </div>
    </ChatLayout>
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
