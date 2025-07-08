
import { useState, useEffect, useRef } from "react";
import { ChatMessage, ProfileData, DemographicsData } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChatInput from "./AIChatInput";
import ChatContainer from "./ChatContainer";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useConversationTopics } from "@/hooks/useConversationTopics";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";

interface AIChatProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isConfigured: boolean;
  conversationStarter?: string;
}

const AIChat = ({ profiles, demographicsData, chatHistory, setChatHistory, isConfigured, conversationStarter }: AIChatProps) => {
  const [loading, setLoading] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const speakResponseRef = useRef<((text: string) => void) | null>(null);
  const { profile } = useUserProfile();
  const { extractTopicsFromMessage, addOrUpdateTopic } = useConversationTopics();
  const { saveConversation, loadMostRecentConversation, currentConversationId } = useChatHistory();
  const { accessLevel, canInteract } = useProgressiveAccess();
  const processedStarters = useRef(new Set<string>());

  const userName = demographicsData.your?.name || profile?.name || '';
  const partnerName = demographicsData.partner?.name || '';

  // Load conversation history on mount
  useEffect(() => {
    if (!isHistoryLoaded && canInteract) {
      console.log('Loading conversation history...');
      const savedHistory = loadMostRecentConversation();
      if (savedHistory.length > 0) {
        console.log(`Restored ${savedHistory.length} messages from conversation history`);
        setChatHistory(savedHistory);
      }
      setIsHistoryLoaded(true);
    }
  }, [canInteract, isHistoryLoaded, loadMostRecentConversation, setChatHistory]);

  // Handle conversation starter
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract && isHistoryLoaded) {
      processedStarters.current.add(conversationStarter);
      sendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract, isHistoryLoaded]);

  // Save conversation with immediate persistence and debouncing
  useEffect(() => {
    if (chatHistory.length > 0 && canInteract && isHistoryLoaded) {
      // Immediate save to sessionStorage for tab switching
      try {
        sessionStorage.setItem('current_chat', JSON.stringify({
          conversationId: currentConversationId,
          messages: chatHistory,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }

      // Debounced save to database and localStorage
      const timeoutId = setTimeout(() => {
        saveConversation(chatHistory);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory, saveConversation, canInteract, isHistoryLoaded, currentConversationId]);

  // Listen for page visibility changes to save conversation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && chatHistory.length > 0) {
        saveConversation(chatHistory);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [chatHistory, saveConversation]);

  // Save conversation before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatHistory.length > 0) {
        saveConversation(chatHistory);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chatHistory, saveConversation]);

  const sendMessage = async (userMessage: string) => {
    if (!canInteract) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    const topics = extractTopicsFromMessage(userMessage);
    topics.forEach(topic => addOrUpdateTopic(topic));

    try {
      const context = AICoachEngine.buildPersonContext(profiles, demographicsData);
      const conversationalPrompt = AICoachEngine.buildConversationalPrompt(context, chatHistory);
      const aiResponse = await AICoachEngine.getAIResponse(userMessage, context, chatHistory, conversationalPrompt);
      
      const aiTopics = extractTopicsFromMessage(aiResponse);
      aiTopics.forEach(topic => addOrUpdateTopic(topic));
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, aiMessage]);

      if (speakResponseRef.current) {
        speakResponseRef.current(aiResponse);
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message || "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakResponse = (speakFunction: (text: string) => void) => {
    speakResponseRef.current = speakFunction;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 flex items-stretch justify-center p-6">
        <div className="w-full max-w-4xl flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            
            <ChatContainer
              chatHistory={chatHistory}
              loading={loading}
              userName={userName}
              isConfigured={isConfigured}
              conversationStarter={conversationStarter}
              isHistoryLoaded={isHistoryLoaded}
            />

            <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="p-6 max-w-3xl mx-auto">
                <ProgressiveAccessWrapper action="chat">
                  <AIChatInput 
                    onSendMessage={sendMessage} 
                    loading={loading || !isConfigured || !canInteract || !isHistoryLoaded} 
                    userName={userName} 
                    partnerName={partnerName}
                    chatHistory={chatHistory}
                    onSpeakResponse={handleSpeakResponse}
                  />
                </ProgressiveAccessWrapper>
                {!isConfigured && accessLevel === 'full-access' && (
                  <p className="text-sm text-white/60 mt-3 text-center font-light">
                    Complete setup to start chatting
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
