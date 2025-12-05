
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/AIInsights';
import { useDebouncedPersistence } from '@/hooks/useDebouncedPersistence';


interface ChatEffectsProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  canInteract: boolean;
  isHistoryLoaded: boolean;
  conversationStarter?: string;
  isConfigured: boolean;
  onSendMessage: (message: string) => void;
  isStartingNewConversation?: boolean;
  onPersistConversation: (messages: ChatMessage[]) => void;
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
  onPersistConversation,
  currentConversationId
}: ChatEffectsProps) => {
  
  const processedStarters = useRef(new Set<string>());

  // Debounced persistence to prevent frequent saves causing flickering
  const { debouncedPersist, persistImmediately, cleanup } = useDebouncedPersistence(
    onPersistConversation,
    { delay: 1500 } // Wait 1.5s before persisting to avoid rapid saves
  );


  // Handle conversation starter
  useEffect(() => {
    if (conversationStarter && !processedStarters.current.has(conversationStarter) && isConfigured && canInteract && isHistoryLoaded) {
      processedStarters.current.add(conversationStarter);
      onSendMessage(conversationStarter);
    }
  }, [conversationStarter, isConfigured, canInteract, isHistoryLoaded, onSendMessage]);

  // Persist chat history changes with debounced persistence
  useEffect(() => {
    // Skip persistence only if starting new AND history is empty (prevents throwing away pending data)
    if (isStartingNewConversation && chatHistory.length === 0) return;
    if (!isHistoryLoaded || chatHistory.length === 0) return;
    
    // Save to sessionStorage immediately for quick recovery
    try {
      sessionStorage.setItem('current_chat', JSON.stringify({
        conversationId: currentConversationId,
        messages: chatHistory,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
    
    // Use debounced persistence for database/storage operations
    debouncedPersist(chatHistory);
  }, [chatHistory, isHistoryLoaded, currentConversationId, debouncedPersist, isStartingNewConversation]);

  // Save conversation when page visibility changes or before unload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && chatHistory.length > 0) {
        persistImmediately();
      }
    };

    const handleBeforeUnload = () => {
      if (chatHistory.length > 0) {
        persistImmediately();
      }
    };

    // Persist before starting a new conversation
    const handleBeforeNewConversation = () => {
      if (chatHistory.length > 0) {
        persistImmediately();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('chat:beforeNewConversation', handleBeforeNewConversation);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('chat:beforeNewConversation', handleBeforeNewConversation);
      cleanup(); // Clean up debounced persistence
    };
  }, [chatHistory, persistImmediately, cleanup]);
};
