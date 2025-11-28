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
  currentConversationId?: string | null;
  hasLimitBanner?: boolean;
}

// Memoize ChatContainer with optimized comparison
export const MemoizedChatContainer = React.memo(
  React.forwardRef<ChatContainerRef, MemoizedChatContainerProps>((props, ref) => {
    return <ChatContainer {...props} ref={ref} />;
  }),
  (prevProps, nextProps) => {
    // Optimized: Quick checks first, then simplified last message check
    if (prevProps.chatHistory.length !== nextProps.chatHistory.length) return false;
    
    // Only check last message ID (streaming updates will change content, full messages won't)
    if (prevProps.chatHistory.length > 0) {
      const prevLast = prevProps.chatHistory[prevProps.chatHistory.length - 1];
      const nextLast = nextProps.chatHistory[nextProps.chatHistory.length - 1];
      if (prevLast.id !== nextLast.id || prevLast.content !== nextLast.content) {
        return false;
      }
    }
    
    // Check other props
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.userName === nextProps.userName &&
      prevProps.isConfigured === nextProps.isConfigured &&
      prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
      prevProps.inputSectionHeight === nextProps.inputSectionHeight &&
      prevProps.currentConversationId === nextProps.currentConversationId &&
      prevProps.hasLimitBanner === nextProps.hasLimitBanner
    );
  }
);

MemoizedChatContainer.displayName = 'MemoizedChatContainer';