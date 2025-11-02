import React from "react";
import ChatContainer, { ChatContainerRef } from "../ChatContainer";
import { ChatMessage } from "@/types/AIInsights";

interface MemoizedChatContainerProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  userName: string;
  isConfigured: boolean;
  conversationStarter?: string;
  isHistoryLoaded: boolean;
  onNewConversation?: () => void;
  onOpenSidebar?: () => void;
  profileCompletion?: number;
  onCompleteProfile?: () => void;
  showProfileNudge?: boolean;
  inputSectionHeight?: number;
}

// Memoize ChatContainer with optimized comparison
export const MemoizedChatContainer = React.memo(
  React.forwardRef<ChatContainerRef, MemoizedChatContainerProps>((props, ref) => {
    return <ChatContainer {...props} ref={ref} />;
  }),
  (prevProps, nextProps) => {
    // Quick length check first
    if (prevProps.chatHistory.length !== nextProps.chatHistory.length) return false;
    
    // Only check last 2 messages for changes (most common case)
    const checkMessages = Math.min(2, prevProps.chatHistory.length);
    for (let i = prevProps.chatHistory.length - checkMessages; i < prevProps.chatHistory.length; i++) {
      const prevMsg = prevProps.chatHistory[i];
      const nextMsg = nextProps.chatHistory[i];
      if (!nextMsg || prevMsg.id !== nextMsg.id || prevMsg.content !== nextMsg.content) {
        return false;
      }
    }
    
    // Check other props
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.userName === nextProps.userName &&
      prevProps.isConfigured === nextProps.isConfigured &&
      prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
      prevProps.inputSectionHeight === nextProps.inputSectionHeight
    );
  }
);

MemoizedChatContainer.displayName = 'MemoizedChatContainer';