
import { useState, useEffect } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import ChatInterface from "./ChatInterface";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useChatEffects } from "./chat/ChatEffects";
import { useChatMessageHandler } from "./chat/ChatMessageHandler";
import { ChatLayout } from "./chat/ChatLayout";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isConfigured: boolean;
  conversationStarter?: string;
  onNewConversation?: () => void;
}

const AIChat = ({ 
  profiles, 
  demographicsData, 
  chatHistory, 
  setChatHistory, 
  isConfigured, 
  conversationStarter,
  onNewConversation 
}: AIChatProps) => {
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { profile } = useUserProfile();
  const { canInteract } = useProgressiveAccess();

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  const { loading, sendMessage, handleSpeakResponse } = useChatMessageHandler({
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
    onSendMessage: sendMessage
  });

  return (
    <ChatLayout userName={userName} onNewConversation={handleNewConversation}>
      <ChatInterface
        chatHistory={chatHistory}
        loading={loading}
        userName={userName}
        partnerName={partnerName}
        isConfigured={isConfigured}
        conversationStarter={conversationStarter}
        isHistoryLoaded={isHistoryLoaded}
        onSendMessage={sendMessage}
        onSpeakResponse={handleSpeakResponse}
      />
    </ChatLayout>
  );
};

export default AIChat;
