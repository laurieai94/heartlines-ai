
import { useState, useEffect } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
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
}

const AIChat = ({ 
  profiles, 
  demographicsData, 
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
  isStartingNewConversation = false
}: AIChatProps) => {
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
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
    chatHistory,
    setChatHistory,
    canInteract
  });

  // Handle new conversation
  const handleNewConversation = () => {
    setChatHistory([]);
    if (onNewConversation) {
      onNewConversation();
    }
  };

  // Mark history as loaded after effects have run
  useEffect(() => {
    if (canInteract) {
      setIsHistoryLoaded(true);
    }
  }, [canInteract]);

useChatEffects({
  chatHistory,
  setChatHistory,
  canInteract,
  isHistoryLoaded,
  conversationStarter,
  isConfigured,
  onSendMessage: sendMessage,
  isStartingNewConversation,
  persistConversation: onPersistChat || (() => {}),
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
        conversationStarter={conversationStarter}
        isHistoryLoaded={isHistoryLoaded}
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
      />
    </ChatLayout>
  );
};

export default AIChat;
