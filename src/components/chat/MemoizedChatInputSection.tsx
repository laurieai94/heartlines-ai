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
  onHeightChange?: (height: number) => void;
  onInputFocus?: () => void;
}

// Memoized ChatInputSection with optimized comparison
const MemoizedChatInputSection = React.memo(ChatInputSection, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.isConfigured === nextProps.isConfigured &&
    prevProps.canInteract === nextProps.canInteract &&
    prevProps.isHistoryLoaded === nextProps.isHistoryLoaded &&
    prevProps.chatHistory.length === nextProps.chatHistory.length &&
    prevProps.showStarters === nextProps.showStarters
  );
});

MemoizedChatInputSection.displayName = 'MemoizedChatInputSection';

export default MemoizedChatInputSection;