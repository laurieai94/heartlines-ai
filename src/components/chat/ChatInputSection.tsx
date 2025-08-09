import { useEffect, useRef, useState } from 'react';
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import { ChatMessage } from '@/types/AIInsights';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import SignUpModal from '@/components/SignUpModal';
import { useAuth } from '@/contexts/AuthContext';
import { logEvent } from '@/utils/analytics';

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
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Refocus the chat input after successful auth
  useEffect(() => {
    if (user && localStorage.getItem('focusChatInputAfterAuth')) {
      setAuthOpen(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      localStorage.removeItem('focusChatInputAfterAuth');
    }
  }, [user]);

  const openAuthModalFromChat = () => {
    localStorage.setItem('focusChatInputAfterAuth', '1');
    setAuthOpen(true);
    logEvent('auth_modal_opened', { source: 'chat_input' });
  };

  const handleSend = (message: string) => {
    if (!user) {
      openAuthModalFromChat();
      return;
    }
    onSendMessage(message);
  };

  return (
    <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="px-4 py-3">
        {/* Conversation Starters - only show when no chat history */}
        {chatHistory.length === 0 && isConfigured && isHistoryLoaded && (
          <div className="mb-3 max-w-4xl mx-auto">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {user ? (
            <ProgressiveAccessWrapper action="chat">
              <AIChatInput 
                onSendMessage={handleSend} 
                loading={loading || !isConfigured || !canInteract || !isHistoryLoaded} 
                disabled={!user}
                placeholder={user ? "Message Kai…" : "Sign in to start chatting…"}
                inputRef={inputRef}
                onInputFocus={() => { if (!user) openAuthModalFromChat(); }}
                userName={userName} 
                partnerName={partnerName}
                chatHistory={chatHistory}
                onSpeakResponse={onSpeakResponse}
              />
            </ProgressiveAccessWrapper>
          ) : (
              <AIChatInput 
                onSendMessage={handleSend} 
                loading={loading || !isConfigured || !canInteract || !isHistoryLoaded} 
                disabled={!user}
                placeholder={user ? "Message Kai…" : "Sign in to start chatting…"}
                inputRef={inputRef}
                onInputFocus={() => { if (!user) openAuthModalFromChat(); }}
                userName={userName} 
                partnerName={partnerName}
                chatHistory={chatHistory}
                onSpeakResponse={onSpeakResponse}
              />
          )}
        </div>
        {!isConfigured && accessLevel === 'full-access' && (
          <p className="text-xs text-white/60 mt-2 text-center font-light">
            Complete setup to chat
          </p>
        )}
      </div>
      <SignUpModal isOpen={authOpen} onClose={() => { setAuthOpen(false); logEvent('auth_modal_dismissed'); }} blockingAction="chat" />
    </div>
  );
};
