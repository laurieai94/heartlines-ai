
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/AIInsights';


interface ChatEffectsProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
  isHistoryLoaded: boolean;
  conversationStarter?: string;
  isConfigured: boolean;
  onSendMessage: (message: string) => void;
  isStartingNewConversation?: boolean;
  persistConversation: (messages: ChatMessage[]) => void;
  currentConversationId: string | null;
}

export const useChatEffects = ({
  chatHistory,
  setChatHistory,
  canInteract,
  isHistoryLoaded,
  conversationStarter,
  isConfigured,
  onSendMessage,
  isStartingNewConversation = false,
  persistConversation,
  currentConversationId
}: ChatEffectsProps) => {
  
  const processedStarters = useRef(new Set<string>());


  // Handle conversation starter
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract && isHistoryLoaded) {
      processedStarters.current.add(conversationStarter);
      onSendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract, isHistoryLoaded, onSendMessage]);

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
        persistConversation(chatHistory);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory, persistConversation, canInteract, isHistoryLoaded, currentConversationId]);

  // Listen for page visibility changes to save conversation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && chatHistory.length > 0) {
        persistConversation(chatHistory);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [chatHistory, persistConversation]);

  // Save conversation before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatHistory.length > 0) {
        persistConversation(chatHistory);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chatHistory, persistConversation]);
};
