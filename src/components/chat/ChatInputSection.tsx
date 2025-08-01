
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import { ChatMessage } from '@/types/AIInsights';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';

interface ChatInputSectionProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName: string;
  partnerName: string;
  chatHistory: ChatMessage[];
  onSpeakResponse: (speakFunction: (text: string) => void) => void;
  isConfigured: boolean;
  canInteract: boolean;
  isHistoryLoaded: boolean;
}

export const ChatInputSection = ({
  onSendMessage,
  loading,
  userName,
  partnerName,
  chatHistory,
  onSpeakResponse,
  isConfigured,
  canInteract,
  isHistoryLoaded
}: ChatInputSectionProps) => {
  const { accessLevel } = useProgressiveAccess();

  return (
    <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="p-2">
        {/* Conversation Starters - only show when no chat history */}
        {chatHistory.length === 0 && isConfigured && isHistoryLoaded && (
          <div className="mb-2">
            <ConversationStarters onStarterSelect={onSendMessage} />
          </div>
        )}
        
        <ProgressiveAccessWrapper action="chat">
          <AIChatInput 
            onSendMessage={onSendMessage} 
            loading={loading || !isConfigured || !canInteract || !isHistoryLoaded} 
            userName={userName} 
            partnerName={partnerName}
            chatHistory={chatHistory}
            onSpeakResponse={onSpeakResponse}
          />
        </ProgressiveAccessWrapper>
        {!isConfigured && accessLevel === 'full-access' && (
          <p className="text-xs text-white/60 mt-2 text-center font-light">
            Complete setup to chat
          </p>
        )}
      </div>
    </div>
  );
};
