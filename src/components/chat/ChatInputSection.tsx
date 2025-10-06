import { useEffect, useRef, useState, lazy, useMemo } from 'react';
import AIChatInput from '../AIChatInput';
import ProgressiveAccessWrapper from '../ProgressiveAccessWrapper';
import ConversationStarters from '../ConversationStarters';
import OnboardingStepNudge from '../OnboardingStepNudge';
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
import { useOptimizedProfileCompletion } from '@/hooks/useOptimizedProfileCompletion';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { 
    accessLevel, 
    missingFieldsForChat, 
    showUpgradeModal, 
    upgradeReason, 
    openUpgradeModal, 
    closeUpgradeModal 
  } = useProgressiveAccess();
  const { goToProfile } = useNavigation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const { calculateYourCompletion } = useOptimizedProfileCompletion();
  
  // Stable completion state with debouncing to prevent UI flickering
  const [stableCompletion, setStableCompletion] = useState(0);
  const completionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stable access level with debouncing to prevent nudge flickering
  const [stableAccessLevel, setStableAccessLevel] = useState(accessLevel);
  const accessLevelDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track if profile was ever completed to prevent nudge from reappearing
  const [profileEverCompleted, setProfileEverCompleted] = useState(() => {
    return localStorage.getItem('profile_completed') === 'true';
  });
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
  const { isKeyboardVisible } = useViewport();

  // Compute limit states
  const atLimit = message_limit > 0 && messages_used >= message_limit;
  const nearLimit = usagePercentage >= 80 && usagePercentage < 90 && !atLimit && !subscribed;
  const criticalLimit = usagePercentage >= 90 && !atLimit && !subscribed;
  const nextTier = subscription_tier?.toLowerCase() === 'grow' ? 'thrive' : 'grow';
  const messagesRemaining = message_limit - messages_used;

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

  // Show near-limit toast once per session (80-89%)
  useEffect(() => {
    if (nearLimit && !localStorage.getItem('nearLimitToastShown')) {
      localStorage.setItem('nearLimitToastShown', '1');
      toast({
        title: "Approaching message limit",
        description: `${messages_used} of ${message_limit} messages used this month.`,
        action: (
          <Button 
            size="sm" 
            onClick={() => openUpgradeModal('near-limit')}
          >
            Upgrade
          </Button>
        ),
      });
    }
  }, [nearLimit, messages_used, message_limit, openUpgradeModal]);

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

  // Show starters only if user hasn't sent any messages yet
  const hasUserMessages = chatHistory.some(msg => msg.type === 'user');
  
  const shouldShowStarters = 
    accessLevel !== 'profile-required' && 
    !hasUserMessages && // Only show if no user messages yet
    isConfigured && 
    isHistoryLoaded &&
    !!user; // Must be authenticated

  // Calculate profile completion for the nudge (memoized to prevent excessive calculation)
  const profileCompletion = useMemo(() => {
    if (accessLevel !== 'profile-required') return 0;
    return calculateYourCompletion();
  }, [accessLevel, calculateYourCompletion]);
  
  // Debounce completion changes to prevent UI flickering
  useEffect(() => {
    if (completionDebounceRef.current) {
      clearTimeout(completionDebounceRef.current);
    }
    
    // If completion is increasing or staying same, update immediately
    // If decreasing, wait 5 seconds to confirm it's stable
    if (profileCompletion >= stableCompletion) {
      setStableCompletion(profileCompletion);
      
      // Mark profile as completed once it reaches 100% - never show nudge again
      if (profileCompletion >= 100) {
        setProfileEverCompleted(true);
        localStorage.setItem('profile_completed', 'true');
      }
    } else {
      completionDebounceRef.current = setTimeout(() => {
        setStableCompletion(profileCompletion);
      }, 5000);
    }
    
    return () => {
      if (completionDebounceRef.current) {
        clearTimeout(completionDebounceRef.current);
      }
    };
  }, [profileCompletion, stableCompletion]);

  // Debounce access level changes to prevent nudge flickering
  useEffect(() => {
    if (accessLevelDebounceRef.current) {
      clearTimeout(accessLevelDebounceRef.current);
    }
    
    // Change to 'full-access' immediately (user completed profile)
    // Change to 'profile-required' only after 3 seconds (might be temporary glitch)
    if (accessLevel === 'full-access') {
      setStableAccessLevel(accessLevel);
    } else if (accessLevel === 'profile-required') {
      accessLevelDebounceRef.current = setTimeout(() => {
        setStableAccessLevel(accessLevel);
      }, 3000);
    } else {
      setStableAccessLevel(accessLevel);
    }
    
    return () => {
      if (accessLevelDebounceRef.current) {
        clearTimeout(accessLevelDebounceRef.current);
      }
    };
  }, [accessLevel]);

  // Use native iOS keyboard behavior instead of fighting it

  return (
    <div className="flex-shrink-0 sticky bottom-0 md:pb-safe">
      <div className="px-0 pt-1 pb-0 md:px-4 md:py-5 md:pt-8">
        {/* Critical 90% usage warning banner */}
        {criticalLimit && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
            <Alert className="bg-coral-500/20 border-coral-400/50 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-coral-400" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="font-semibold questionnaire-text">Running low on messages!</span>
                  <p className="text-sm questionnaire-text-muted mt-1">
                    Only {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} left this month. 
                    Upgrade now to keep the conversation going.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => openUpgradeModal('near-limit')}
                  className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white flex-shrink-0"
                >
                  Upgrade
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Conversation Starters - show for complete profiles with empty chats */}
        {shouldShowStarters && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        {/* Profile completion nudge - show for incomplete profiles */}
        {stableAccessLevel === 'profile-required' && user && stableCompletion < 100 && !profileEverCompleted && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12 flex justify-center">
            <OnboardingStepNudge
              completion={stableCompletion}
              onStartProfile={() => goToProfile('chat')}
            />
          </div>
        )}
        
        <div className="md:max-w-[54rem] md:mx-auto md:px-12">
          <ProgressiveAccessWrapper action="chat">
            <AIChatInput
              onSendMessage={handleSend} 
              loading={loading}
              disabled={(!user && accessLevel !== 'profile-required') || !isConfigured || !canInteract || !isHistoryLoaded || atLimit}
              readOnly={(accessLevel === 'profile-required' && !!user) || atLimit}
              showProfileGlow={false}
                placeholder={
                !user 
                  ? "Sign in to start chatting…" 
                  : accessLevel === 'profile-required' 
                    ? ""
                    : atLimit
                    ? "You've reached your monthly message limit. Click to upgrade and continue."
                    : chatHistory.length === 0 ? "What's up?" : ""
              }
              inputRef={inputRef}
              onInputFocus={() => { 
                if (!user) openAuthModalFromChat();
                else if (accessLevel === 'profile-required') goToProfile('chat');
                else if (atLimit) {
                  openUpgradeModal('limit-reached');
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
      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={closeUpgradeModal}
        currentTier={subscription_tier?.toLowerCase() || 'freemium'}
        messagesUsed={messages_used}
        messageLimit={message_limit}
        reason={upgradeReason}
      />
    </div>
  );
};
