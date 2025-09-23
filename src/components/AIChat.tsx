
import React, { useState, useEffect } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { UseProfileGoalsReturn } from "@/hooks/useProfileGoals";
import ChatContainer from "./ChatContainer";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useChatEffects } from "./chat/ChatEffects";
import { useChatMessageHandler } from "./chat/ChatMessageHandler";
import { ChatLayout } from "./chat/ChatLayout";
import { ChatInputSection } from "./chat/ChatInputSection";

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
  const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);
  const { profile } = useUserProfile();
  const { canInteract } = useProgressiveAccess();

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log('AIChat - userName resolved:', userName);
    console.log('AIChat - demographicsData.your:', demographicsData.your);
    console.log('AIChat - profile:', profile);
  }

  const { loading, sendMessage } = useChatMessageHandler({
    profiles,
    demographicsData,
    profileGoals,
    chatHistory,
    setChatHistory,
    canInteract
  });

  // Handle new conversation
  const handleNewConversation = () => {
    setChatHistory([]);
    setLastSentMessage(null);
    if (onNewConversation) {
      onNewConversation();
    }
  };

  // Handle user typing changes  
  const handleUserTypingChange = (typing: boolean) => {
    setUserTyping(typing);
  };

  // Handle last sent message changes
  const handleLastSentMessageChange = (message: string | null) => {
    setLastSentMessage(message);
  };

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
      <ChatContainer
        chatHistory={chatHistory}
        loading={loading}
        userName={userName}
        isConfigured={isConfigured}
        showStarters={!!conversationStarter}
        isHistoryLoaded={isHistoryLoaded}
        showTyping={userTyping}
        onNewConversation={handleNewConversation}
        onOpenSidebar={onOpenSidebar}
        lastSentMessage={lastSentMessage}
      />

      <ChatInputSection
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
        onUserTypingChange={handleUserTypingChange}
        onLastSentMessageChange={handleLastSentMessageChange}
      />
    </ChatLayout>
  );
};

export default AIChat;
