import { useEffect, useRef, useState, lazy, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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

import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { useOptimizedProfileCompletion } from '@/hooks/useOptimizedProfileCompletion';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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
  onHeightChange?: (height: number) => void;
  onInputFocus?: () => void;
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
  onHeightChange = () => {},
  onInputFocus = () => {}
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
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    manageSubscription,
    refresh 
  } = useOptimizedSubscription();
  
  
  // Mobile optimization hooks
  const { isMobile, isTablet } = useOptimizedMobile();

  // Compute limit states
  const atLimit = message_limit > 0 && messages_used >= message_limit;
  const messagesRemaining = message_limit - messages_used;
  const nearLimit = usagePercentage >= 85 && usagePercentage < 90 && !atLimit && !subscribed;
  const criticalLimit = messagesRemaining <= 3 && messagesRemaining > 0 && !atLimit && !subscribed;
  const nextTier = subscription_tier?.toLowerCase() === 'glow' ? 'vibe' : 'glow';

  // Refocus the chat input after successful auth
  useEffect(() => {
    if (user && localStorage.getItem('focusChatInputAfterAuth')) {
      setAuthOpen(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      localStorage.removeItem('focusChatInputAfterAuth');
    }
  }, [user]);

  // Refresh subscription data when returning from billing
  useEffect(() => {
    if (searchParams.get('upgraded') === 'true' || searchParams.get('from') === 'billing') {
      refresh();
    }
  }, [searchParams, refresh]);

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

  // Show starters only if user hasn't sent any messages yet
  const hasUserMessages = chatHistory.some(msg => msg.type === 'user');
  
  const shouldShowStarters = 
    accessLevel !== 'profile-required' && 
    !hasUserMessages && // Only show if no user messages yet
    isConfigured && 
    isHistoryLoaded &&
    !!user; // Must be authenticated

  // Calculate profile completion for the nudge - instant updates, no debouncing
  const profileCompletion = useMemo(() => {
    if (accessLevel !== 'profile-required') return 0;
    return calculateYourCompletion();
  }, [accessLevel, calculateYourCompletion]);
  
  // Update stable completion immediately without debouncing for instant feedback
  useEffect(() => {
    setStableCompletion(profileCompletion);
    
    // Mark profile as completed once it reaches 100%
    if (profileCompletion >= 100) {
      setProfileEverCompleted(true);
      localStorage.setItem('profile_completed', 'true');
    }
  }, [profileCompletion]);

  // Update access level immediately for instant locking/unlocking
  useEffect(() => {
    if (accessLevelDebounceRef.current) {
      clearTimeout(accessLevelDebounceRef.current);
    }
    
    // Apply all access level changes immediately for instant responsiveness
    if (accessLevel === 'full-access' || accessLevel === 'profile-required') {
      setStableAccessLevel(accessLevel);
    } else {
      // Only debounce for signup-required to avoid auth flickering
      accessLevelDebounceRef.current = setTimeout(() => {
        setStableAccessLevel(accessLevel);
      }, 1000);
    }
    
    return () => {
      if (accessLevelDebounceRef.current) {
        clearTimeout(accessLevelDebounceRef.current);
      }
    };
  }, [accessLevel]);


  // Measure and report height changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.getBoundingClientRect().height;
        onHeightChange(height);
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Initial measurement
    const initialHeight = containerRef.current.getBoundingClientRect().height;
    onHeightChange(initialHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onHeightChange]);

  return (
    <div 
      ref={containerRef}
      className="chat-footer absolute bottom-0 left-0 right-0 flex-shrink-0 z-40 md:relative md:bottom-auto md:left-auto md:right-auto md:mb-8"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      }}
    >
      <div>
        {/* 80% usage warning banner with progress */}
        {nearLimit && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
            <Alert className="bg-burgundy-800/40 border-pink-400/40 backdrop-blur-sm ring-1 ring-pink-400/20">
              <Sparkles className="h-5 w-5 text-pink-300" />
              <AlertDescription className="space-y-3">
                <div className="flex-1">
                  <span className="font-semibold questionnaire-text">you've outgrown your free plan 🌱 time to level up + keep growing.</span>
                </div>
                <div className="space-y-2">
                  <Progress value={usagePercentage} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs questionnaire-text-muted">
                      {messages_used} of {message_limit} messages this month
                    </span>
                    <Button
                      size="sm"
                      onClick={() => openUpgradeModal('near-limit')}
                      className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white"
                    >
                      Keep Going ✨
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Critical 90% usage warning banner */}
        {criticalLimit && (
          <div className="mb-2 md:mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
            <Alert className="bg-coral-500/20 border-pink-400/60 backdrop-blur-sm ring-1 ring-pink-400/30">
              <AlertDescription className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="font-semibold questionnaire-text">💌 you're almost out of messages!</span>
                  <p className="text-sm questionnaire-text-muted mt-1">
                    only {messagesRemaining} left — upgrade to keep the convo flowing.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => openUpgradeModal('near-limit')}
                  className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white flex-shrink-0"
                >
                  stay connected
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Conversation Starters - show for complete profiles with empty chats */}
        {shouldShowStarters && (
          <div className="mb-1 md:mb-2 md:max-w-[54rem] md:mx-auto md:px-12">
            <ConversationStarters onStarterSelect={handleSend} />
          </div>
        )}
        
        <div className="px-1 md:max-w-[54rem] md:mx-auto md:px-12">
          <ProgressiveAccessWrapper action="chat">
            <AIChatInput
              onSendMessage={handleSend} 
              loading={loading}
              disabled={(accessLevel === 'profile-required' && !!user) || atLimit}
              readOnly={(accessLevel === 'profile-required' && !!user) || atLimit}
              sendBlocked={!user || !isConfigured || !canInteract || !isHistoryLoaded || atLimit}
              showProfileGlow={false}
              atLimit={atLimit}
                placeholder={
                !user 
                  ? "Sign in to start chatting…" 
                  : accessLevel === 'profile-required' 
                    ? ""
                    : atLimit
                    ? "you've outgrown your free plan 🌱 click here to level up!"
                    : chatHistory.length === 0 ? "What's up?" : ""
              }
              inputRef={inputRef}
              onInputFocus={() => { 
                onInputFocus();
                // Dispatch custom event for ChatHeader to hide on mobile
                window.dispatchEvent(new Event('chat-input-focus'));
                if (!user) openAuthModalFromChat();
                else if (accessLevel === 'profile-required') goToProfile('chat');
                else if (atLimit) {
                  openUpgradeModal('limit-reached');
                }
              }}
              onInputBlur={() => {
                // Dispatch custom event for ChatHeader to show on mobile
                window.dispatchEvent(new Event('chat-input-blur'));
              }}
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
        currentTier={subscription_tier?.toLowerCase() || 'begin'}
        messagesUsed={messages_used}
        messageLimit={message_limit}
        reason={upgradeReason}
      />
    </div>
  );
};
