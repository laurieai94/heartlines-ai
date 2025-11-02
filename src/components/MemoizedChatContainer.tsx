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
    prevProps.currentConversationId === nextProps.currentConversationId &&
    prevProps.chatHistory.length === nextProps.chatHistory.length &&
    // Deep check chat history content changes
    prevProps.chatHistory.every((msg, index) => {
      const nextMsg = nextProps.chatHistory[index];
      return nextMsg && msg.id === nextMsg.id && msg.content === nextMsg.content;
    })
  );
});

MemoizedChatContainer.displayName = 'MemoizedChatContainer';

export default MemoizedChatContainer;