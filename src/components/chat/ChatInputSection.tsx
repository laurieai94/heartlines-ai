import { useEffect, useRef, useState, lazy } from 'react';
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import { ChatMessage } from '@/types/AIInsights';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import { useNavigation } from '@/contexts/NavigationContext';
import SignUpModal from '@/components/SignUpModal';
import { useAuth } from '@/contexts/AuthContext';
import { logEvent } from '@/utils/analytics';

// Prefetch the profile questionnaire for faster loading
const NewPersonalQuestionnaire = lazy(() => import('@/components/NewPersonalQuestionnaire'));

interface ChatInputSectionProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  userName: string;
  partnerName: string;
  chatHistory: ChatMessage[];
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
  isConfigured,
  canInteract,
  isHistoryLoaded
}: ChatInputSectionProps) => {
  const { accessLevel, missingFieldsForChat } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
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

  // Prefetch profile questionnaire when profile is required for better UX
  useEffect(() => {
    if (accessLevel === 'profile-required' && user) {
      // Actually preload the module chunk
      import('@/components/NewPersonalQuestionnaire').catch(() => {});
    }
  }, [accessLevel, user]);

  const openAuthModalFromChat = () => {
    localStorage.setItem('focusChatInputAfterAuth', '1');
    setAuthOpen(true);
    logEvent('auth_modal_opened', { source: 'chat_input' });
  };

  const handleSend = (message: string) => {
    if (loading) return; // Don't send while AI is thinking
    if (!user) {
      openAuthModalFromChat();
      return;
    }
    if (accessLevel === 'profile-required') {
      goToProfile('chat');
      return;
    }
    onSendMessage(message);
  };

  return (
    <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 pb-safe">
      <div className="px-4 py-3">
        {/* Conversation Starters - only show when no chat history */}
        {chatHistory.length === 0 && isConfigured && isHistoryLoaded && (
          <div className="mb-3 max-w-4xl mx-auto">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            <ProgressiveAccessWrapper action="chat">
              <AIChatInput 
                onSendMessage={handleSend} 
                loading={loading}
                disabled={(!user && accessLevel !== 'profile-required') || !isConfigured || !canInteract || !isHistoryLoaded}
                readOnly={accessLevel === 'profile-required' && !!user}
                placeholder={
                  !user 
                    ? "Sign in to start chatting…" 
                    : accessLevel === 'profile-required' 
                      ? "Click here to complete your profile and start chatting with Kai…"
                      : "Message Kai…"
                }
                inputRef={inputRef}
                onInputFocus={() => { 
                  if (!user) openAuthModalFromChat();
                  else if (accessLevel === 'profile-required') goToProfile('chat');
                }}
                userName={userName} 
                partnerName={partnerName}
                chatHistory={chatHistory}
              />
            </ProgressiveAccessWrapper>
            {/* Removed "Complete these to unlock chat" text */}
          </div>
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
