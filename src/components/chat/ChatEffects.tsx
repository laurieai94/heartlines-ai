
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/AIInsights';
import { useChatHistory } from '@/hooks/useChatHistory';

interface ChatEffectsProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
  isHistoryLoaded: boolean;
  conversationStarter?: string;
  isConfigured: boolean;
  onSendMessage: (message: string) => void;
  isStartingNewConversation?: boolean;
}

export const useChatEffects = ({
  chatHistory,
  setChatHistory,
  canInteract,
  isHistoryLoaded,
  conversationStarter,
  isConfigured,
  onSendMessage,
  isStartingNewConversation = false
}: ChatEffectsProps) => {
  const { saveConversation, loadMostRecentConversation, currentConversationId } = useChatHistory();
  const processedStarters = useRef(new Set<string>());

  // Load conversation history on mount
  useEffect(() => {
    if (!isHistoryLoaded && canInteract && !isStartingNewConversation) {
      console.log('Loading conversation history...');
      const savedHistory = loadMostRecentConversation();
      if (savedHistory.length > 0) {
        console.log(`Restored ${savedHistory.length} messages from conversation history`);
        setChatHistory(savedHistory);
      }
    }
  }, [canInteract, isHistoryLoaded, loadMostRecentConversation, setChatHistory, isStartingNewConversation]);

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
};
