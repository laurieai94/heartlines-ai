import React from 'react';
import ChatContainer from './ChatContainer';
import { ChatMessage } from '@/types/AIInsights';

interface ChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName?: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  onNewConversation?: () => void;
  onOpenSidebar?: () => void;
}

// Memoize ChatContainer to prevent unnecessary re-renders on parent state changes
const MemoizedChatContainer = React.memo(ChatContainer, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.userName === nextProps.userName &&
    prevProps.isConfigured === nextProps.isConfigured &&
    prevProps.conversationStarter === nextProps.conversationStarter &&
    prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
    prevProps.chatHistory.length === nextProps.chatHistory.length &&
    // Only check last message (earlier messages are immutable once complete)
    (prevProps.chatHistory.length === 0 || (
      prevProps.chatHistory[prevProps.chatHistory.length - 1].id === nextProps.chatHistory[nextProps.chatHistory.length - 1].id &&
      prevProps.chatHistory[prevProps.chatHistory.length - 1].content === nextProps.chatHistory[nextProps.chatHistory.length - 1].content
    ))
  );
});

MemoizedChatContainer.displayName = 'MemoizedChatContainer';

export default MemoizedChatContainer;