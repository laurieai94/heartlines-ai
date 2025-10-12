import React from 'react';
import { ChatInputSection } from './ChatInputSection';
import { ChatMessage } from '@/types/AIInsights';

interface ChatInputSectionProps {
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
  onHeightChange?: (height: number) => void;
}

// Memoized ChatInputSection to prevent unnecessary re-renders
const MemoizedChatInputSection = React.memo(ChatInputSection, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.userName === nextProps.userName &&
    prevProps.partnerName === nextProps.partnerName &&
    prevProps.isConfigured === nextProps.isConfigured &&
    prevProps.canInteract === nextProps.canInteract &&
    prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
    prevProps.chatHistory.length === nextProps.chatHistory.length &&
    prevProps.showStarters === nextProps.showStarters
  );
});

MemoizedChatInputSection.displayName = 'MemoizedChatInputSection';

export default MemoizedChatInputSection;