import { useEffect, useRef, useState } from 'react';
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import { ChatMessage } from '@/types/AIInsights';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import { useNavigation } from '@/contexts/NavigationContext';
import SignUpModal from '@/components/SignUpModal';
import { useAuth } from '@/contexts/AuthContext';
import { logEvent } from '@/utils/analytics';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

  const handleInputFocus = () => {
    if (!user) {
      openAuthModalFromChat();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm pb-safe">
      <div className="px-4 py-3">
        {/* Conversation Starters - only show when no chat history */}
        {chatHistory.length === 0 && isConfigured && isHistoryLoaded && (
          <div className="mb-3 max-w-4xl mx-auto">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {accessLevel === 'profile-required' && user ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-end">
                <Textarea
                  disabled
                  placeholder="Complete your profile to chat with Kai…"
                  className="flex-1 min-h-[50px] max-h-[200px] resize-none bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-pink-300/50 focus:ring-pink-300/20"
                />
                <Button 
                  onClick={goToProfile}
                  variant="outline"
                  className="px-4 py-3 h-auto bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                >
                  Complete Profile
                </Button>
              </div>
              {missingFieldsForChat && missingFieldsForChat.length > 0 && (
                <p className="text-xs text-white/70">
                  Needed to unlock chat: {missingFieldsForChat.join(', ')}
                </p>
              )}
            </div>
          ) : (
            <AIChatInput 
              onSendMessage={handleSend} 
              loading={loading || !isConfigured || !isHistoryLoaded} 
              disabled={false}
              placeholder="Message Kai…"
              inputRef={inputRef}
              onInputFocus={handleInputFocus}
              userName={userName} 
              partnerName={partnerName}
              chatHistory={chatHistory}
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
