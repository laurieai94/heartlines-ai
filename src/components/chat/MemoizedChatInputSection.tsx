import React from "react";
import { ChatInputSection } from "./ChatInputSection";
import { ChatMessage } from "@/types/AIInsights";

interface MemoizedChatInputSectionProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName: string;
  partnerName: string;
  chatHistory: ChatMessage[];
  isConfigured: boolean;
  canInteract: boolean;
  isHistoryLoaded: boolean;
  showStarters?: boolean;
  onCloseStarters?: () => void;
  onUserTypingChange?: (typing: boolean) => void;
  isFreshStart?: boolean;
  onResetFreshStart?: () => void;
}

// Memoize ChatInputSection to prevent unnecessary re-renders
export const MemoizedChatInputSection = React.memo(ChatInputSection, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.userName === nextProps.userName &&
    prevProps.partnerName === nextProps.partnerName &&
    prevProps.isConfigured === nextProps.isConfigured &&
    prevProps.canInteract === nextProps.canInteract &&
    prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
    prevProps.showStarters === nextProps.showStarters &&
    prevProps.isFreshStart === nextProps.isFreshStart &&
    prevProps.chatHistory.length === nextProps.chatHistory.length
  );
});

MemoizedChatInputSection.displayName = 'MemoizedChatInputSection';