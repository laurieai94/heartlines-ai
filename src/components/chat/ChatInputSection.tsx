
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
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
    <div className="shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm sticky bottom-0">
      <div className="p-6 max-w-3xl mx-auto">
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
          <p className="text-sm text-white/60 mt-3 text-center font-light">
            Complete setup to start chatting
          </p>
        )}
      </div>
    </div>
  );
};
