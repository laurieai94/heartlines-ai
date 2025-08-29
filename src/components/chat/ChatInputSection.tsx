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

  // Handle input focus for authentication check
  const handleInputFocus = () => {
    if (!user) {
      openAuthModalFromChat();
    } else if (accessLevel === 'profile-required') {
      goToProfile();
    }
  };

  // Determine loading state - don't disable for guests
  const effectiveLoading = user ? (loading || !isConfigured || !isHistoryLoaded) : false;
  
  // Determine placeholder text
  const getPlaceholder = () => {
    if (!user) return "Sign up to chat with Kai…";
    if (accessLevel === 'profile-required') return "Complete your profile to chat with Kai…";
    return "Message Kai…";
  };

  return (
    <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm pb-0">
      <div className="px-2 py-2">
        {/* Conversation Starters - show for guests or when no chat history and configured */}
        {chatHistory.length === 0 && (!user || (isConfigured && isHistoryLoaded)) && (
          <div className="mb-2 px-2 sm:px-4 lg:px-6">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="px-2 sm:px-4 lg:px-6">
          <AIChatInput 
            onSendMessage={handleSend} 
            loading={effectiveLoading} 
            disabled={false}
            placeholder={getPlaceholder()}
            inputRef={inputRef}
            onInputFocus={handleInputFocus}
            userName={userName} 
            partnerName={partnerName}
            chatHistory={chatHistory}
            autoFocus={!!user}
          />
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
