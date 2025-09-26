import { useEffect, useRef, useState, lazy, useMemo } from 'react';
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import { ChatMessage } from '@/types/AIInsights';
import { useProgressiveAccess } from '@/hooks/useProgressiveAccess';
import { useNavigation } from '@/contexts/NavigationContext';
import SignUpModal from '@/components/SignUpModal';
import { useAuth } from '@/contexts/AuthContext';
import { logEvent } from '@/utils/analytics';
import { useOptimizedSubscription } from '@/hooks/useOptimizedSubscription';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useViewport } from '@/contexts/ViewportContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

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
  showStarters?: boolean;
  onCloseStarters?: () => void;
  onUserTypingChange?: (typing: boolean) => void;
}

export const ChatInputSection = ({
  onSendMessage,
  loading,
  userName,
  partnerName,
  chatHistory,
  isConfigured,
  canInteract,
  isHistoryLoaded,
  showStarters = false,
  onCloseStarters = () => {},
  onUserTypingChange = () => {}
}: ChatInputSectionProps) => {
  const { accessLevel, missingFieldsForChat } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const { 
    messages_used, 
    message_limit, 
    usagePercentage, 
    subscription_tier, 
    subscribed, 
    upgrade, 
    manageSubscription 
  } = useOptimizedSubscription();
  
  // Mobile optimization hooks - distinguish between mobile phones and tablets
  const { isMobile, isTablet } = useOptimizedMobile();
  const { isKeyboardVisible, keyboardHeight } = useViewport();

  // Compute limit states
  const atLimit = message_limit > 0 && messages_used >= message_limit;
  const nearLimit = usagePercentage >= 80 && !atLimit && !subscribed;
  const nextTier = subscription_tier?.toLowerCase() === 'grow' ? 'thrive' : 'grow';

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
    if (atLimit) {
      // Handle at limit in onInputFocus instead
      return;
    }
    // Hide starters after sending a message
    onCloseStarters();
    onSendMessage(message);
  };

  // Show near-limit toast once per session
  useEffect(() => {
    if (nearLimit && !localStorage.getItem('nearLimitToastShown')) {
      localStorage.setItem('nearLimitToastShown', '1');
      toast({
        title: "Approaching message limit",
        description: `${messages_used} of ${message_limit} messages used this month.`,
        action: (
          <Button 
            size="sm" 
            onClick={() => upgrade(nextTier as 'grow' | 'thrive')}
          >
            Upgrade
          </Button>
        ),
      });
    }
  }, [nearLimit, messages_used, message_limit, nextTier, upgrade]);

  // Handle user typing with debouncing
  const handleUserTyping = (typing: boolean) => {
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }
    
    if (typing) {
      setIsComposing(true);
      onUserTypingChange(true);
      
      // Set timeout to stop typing indicator
      typingDebounceRef.current = setTimeout(() => {
        setIsComposing(false);
        onUserTypingChange(false);
      }, 2500);
    } else {
      setIsComposing(false);
      onUserTypingChange(false);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
    };
  }, []);

  // Show starters immediately for authenticated users with empty chats
  const shouldShowStarters = 
    (chatHistory.length === 0 && user) || // Show immediately for empty chats when authenticated
    (chatHistory.length === 0 && isConfigured && isHistoryLoaded) || // Fallback logic
    (showStarters && isConfigured && isHistoryLoaded); // Explicit show

  // Use native iOS keyboard behavior instead of fighting it

  return (
    <div className="flex-shrink-0 sticky bottom-0 pb-safe bg-burgundy-950/95 backdrop-blur-sm">
      <div className="px-0 pt-1 pb-1 md:px-4 md:py-5 md:pt-8">
        {/* Conversation Starters - always show for empty chats */}
        {shouldShowStarters && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="md:max-w-[54rem] md:mx-auto md:px-12">
          <ProgressiveAccessWrapper action="chat">
            <AIChatInput
              onSendMessage={handleSend} 
              loading={loading}
              disabled={(!user && accessLevel !== 'profile-required') || !isConfigured || !canInteract || !isHistoryLoaded || atLimit}
              readOnly={(accessLevel === 'profile-required' && !!user) || atLimit}
              showProfileGlow={accessLevel === 'profile-required' && !!user}
              placeholder={
                !user 
                  ? "Sign in to start chatting…" 
                  : accessLevel === 'profile-required' 
                    ? "Click here to complete your profile and start chatting with Kai…"
                    : atLimit
                    ? "You've reached your monthly message limit. Click to upgrade and continue."
                    : "Message Kai…"
              }
              inputRef={inputRef}
              onInputFocus={() => { 
                if (!user) openAuthModalFromChat();
                else if (accessLevel === 'profile-required') goToProfile('chat');
                else if (atLimit) {
                  if (subscription_tier?.toLowerCase() === 'thrive') {
                    manageSubscription();
                  } else {
                    upgrade(nextTier as 'grow' | 'thrive');
                  }
                }
              }}
              onTypingChange={handleUserTyping}
              userName={userName} 
              partnerName={partnerName}
              chatHistory={chatHistory}
            />
          </ProgressiveAccessWrapper>
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
