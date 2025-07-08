
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
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory, isConfigured, conversationStarter }: AIChatProps) => {
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
    <ChatLayout>
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
        onSpeakResponse={handleSpeakResponse}
        isConfigured={isConfigured}
        canInteract={canInteract}
        isHistoryLoaded={isHistoryLoaded}
      />
    </ChatLayout>
  );
};

export default AIChat;
