import React from "react";
import ChatContainer from "../ChatContainer";
import { ChatMessage } from "@/types/AIInsights";

interface MemoizedChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  userTyping: boolean;
  onNewConversation?: () => void;
  onOpenSidebar?: () => void;
  accessLevel?: string;
  profileCompletion?: number;
  onStartProfile?: () => void;
}

// Memoize ChatContainer to prevent unnecessary re-renders
export const MemoizedChatContainer = React.memo(ChatContainer, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.userName === nextProps.userName &&
    prevProps.isConfigured === nextProps.isConfigured &&
    prevProps.conversationStarter === nextProps.conversationStarter &&
    prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
    prevProps.userTyping === nextProps.userTyping &&
    prevProps.accessLevel === nextProps.accessLevel &&
    prevProps.profileCompletion === nextProps.profileCompletion &&
    prevProps.chatHistory.length === nextProps.chatHistory.length &&
    prevProps.chatHistory.every((msg, index) => 
      msg.id === nextProps.chatHistory[index]?.id &&
      msg.content === nextProps.chatHistory[index]?.content
    )
  );
});

MemoizedChatContainer.displayName = 'MemoizedChatContainer';