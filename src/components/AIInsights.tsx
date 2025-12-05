import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ChatMessage, AIInsightsProps } from '@/types/AIInsights';
import { AICoachEngine } from './AICoachEngine';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useTemporaryProfile } from '@/hooks/useTemporaryProfile';
import { usePersonalProfileData } from '@/hooks/usePersonalProfileData';
import { usePartnerProfileData } from '@/hooks/usePartnerProfileData';
import { useProfileGoals } from '@/hooks/useProfileGoals';
import AIChat from './AIChat';
import ProgressiveAccessWrapper from './ProgressiveAccessWrapper';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Lazy load non-critical modals
const ProfileForm = lazy(() => import('./ProfileForm'));
const Demographics = lazy(() => import('./Demographics'));

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [conversationStarter, setConversationStarter] = useState<string>('');
  const [isStartingNewConversation, setIsStartingNewConversation] = useState(false);
  const [showStarters, setShowStarters] = useState(false);
  
  // Get actual profile data from the questionnaire system
  const { profileData: personalProfileData, isReady: personalDataReady } = usePersonalProfileData();
  // const { profileData: personalProfilePersistence, isReady: persistenceReady } = usePersonalProfilePersistence();
  const { profileData: partnerProfileData, isLoading: partnerDataLoading } = usePartnerProfileData();
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  const { 
    conversations, 
    currentConversationId, 
    loading: historyLoading,
    loadConversation, 
    loadMostRecentConversation,
    startNewConversation,
    deleteConversation,
    saveConversation
  } = useChatHistory();

  // Create unified profiles and demographics data
  const [unifiedProfiles, setUnifiedProfiles] = useState({ your: [], partner: [] });
  const [unifiedDemographics, setUnifiedDemographics] = useState({ your: null, partner: null });

  // Get profile goals from unified data
  const profileGoals = useProfileGoals(
    unifiedProfiles.your[0] || personalProfileData,
    unifiedProfiles.partner[0] || partnerProfileData
  );

  // Measure insights chunk load performance
  useEffect(() => {
    performanceMonitor.measure('insights-chunk-load');
  }, []);

  // Optimized: Combined profile merging effect with early returns
  useEffect(() => {
    if (!personalDataReady || partnerDataLoading) return;

    const mergedPersonalData = {
      ...temporaryDemographics.your,
      ...personalProfileData
    };

    const mergedPartnerData = {
      ...temporaryDemographics.partner,
      ...temporaryProfiles.partner[0],
      ...partnerProfileData
    };

    const hasPersonalData = Object.keys(mergedPersonalData).length > 0;
    const hasPartnerData = Object.keys(mergedPartnerData).length > 0;

    // Only update if there's actual data changes
    const newUnifiedProfiles = {
      your: hasPersonalData ? [mergedPersonalData] : temporaryProfiles.your,
      partner: hasPartnerData ? [mergedPartnerData] : temporaryProfiles.partner
    };

    const newUnifiedDemographics = {
      your: hasPersonalData ? mergedPersonalData : temporaryDemographics.your,
      partner: hasPartnerData ? mergedPartnerData : temporaryDemographics.partner
    };

    setUnifiedProfiles(newUnifiedProfiles);
    setUnifiedDemographics(newUnifiedDemographics);
  }, [personalProfileData, partnerProfileData, personalDataReady, partnerDataLoading, temporaryProfiles, temporaryDemographics]);

  // Initialize Supabase immediately for faster startup
  useEffect(() => {
    const configured = AICoachEngine.initializeSupabase();
    setIsConfigured(configured);
  }, []);

  // Handle new conversation
  const handleNewConversation = async () => {
    // PERSIST CURRENT CONVERSATION FIRST via event
    window.dispatchEvent(new CustomEvent('chat:beforeNewConversation'));
    
    // Give time for persistence to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Now safe to clear
    sessionStorage.removeItem('current_chat');
    setIsStartingNewConversation(true);
    const messages = startNewConversation();
    setChatHistory(messages);
    setConversationStarter('');
    setShowStarters(true); // Show starters when starting new conversation
    // Reset the flag after a brief delay to allow first message to use empty history
    setTimeout(() => setIsStartingNewConversation(false), 500);
  };

  const handleCloseStarters = () => {
    // Don't hide starters if chat is empty - they'll still show due to shouldShowStarters logic
    if (chatHistory.length > 0) {
      setShowStarters(false);
    }
  };

  const handleSupabaseConfigured = (configured: boolean) => {
    setIsConfigured(configured);
  };

  const handleOpenProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // If no demographics data exists for this profile type, show demographics first
    if (!unifiedDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleProfileComplete = (profileData: any) => {
    // Handle profile completion - this would typically update the profiles state
    setShowProfileForm(false);
  };

  const handleDemographicsComplete = (demographicsData: any) => {
    // Handle demographics completion and move to profile form
    setShowDemographics(false);
    setShowProfileForm(true);
  };

  const handleStartConversation = (starter: string) => {
    setConversationStarter(starter);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  const handleLoadConversation = async (conversationId: string) => {
    const messages = await loadConversation(conversationId);
    setChatHistory(messages);
  };

  // Track coach activity and handle forced new conversations after signin
  useEffect(() => {
    // Update coach activity timestamp whenever component is active
    localStorage.setItem('coach_last_seen_at', Date.now().toString());
    
    // Check for force new chat flag (set during signin if user was away >12h)
    const forceNewChat = localStorage.getItem('force_new_chat_after_signin');
    if (forceNewChat === 'true') {
      localStorage.removeItem('force_new_chat_after_signin');
      handleNewConversation();
      return; // Don't load previous conversation
    }
  }, []);

  // Load most recent conversation on first mount only
  const hasLoadedMostRecentRef = useRef(false);
  useEffect(() => {
    if (
      !historyLoading &&
      !hasLoadedMostRecentRef.current &&
      conversations.length > 0 &&
      chatHistory.length === 0 &&
      !isStartingNewConversation
    ) {
      const loadMessages = async () => {
        const messages = await loadMostRecentConversation();
        setChatHistory(messages);
        hasLoadedMostRecentRef.current = true;
      };
      loadMessages();
    }
  }, [historyLoading, conversations.length, chatHistory.length, loadMostRecentConversation, isStartingNewConversation]);

  // Auto-show conversation starters for new chats
  useEffect(() => {
    if (
      chatHistory.length === 0 && 
      isConfigured && 
      !historyLoading &&
      (hasLoadedMostRecentRef.current || conversations.length === 0) // Show for new users OR after checking existing conversations
    ) {
      setShowStarters(true);
    }
  }, [chatHistory.length, isConfigured, historyLoading, conversations.length]);

  // Removed debug logs for performance

  return (
    <div className="h-full min-h-0 max-h-full overflow-hidden flex flex-col px-2 sm:px-3 lg:px-4 pt-0 pb-0">
      {/* Main chat interface with integrated sidebar */}
      <div className="flex-1 min-h-0">
        <ProgressiveAccessWrapper action="chat">
          <AIChat 
            profiles={unifiedProfiles}
            demographicsData={unifiedDemographics}
            profileGoals={profileGoals}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            isConfigured={isConfigured}
            conversationStarter={conversationStarter}
            onNewConversation={handleNewConversation}
            onOpenSidebar={() => {}} 
            onSupabaseConfigured={handleSupabaseConfigured}
            onPersistChat={saveConversation}
            conversations={conversations}
            currentConversationId={currentConversationId}
            historyLoading={historyLoading}
            onLoadConversation={handleLoadConversation}
            onDeleteConversation={deleteConversation}
            isStartingNewConversation={isStartingNewConversation}
            showStarters={showStarters}
            onCloseStarters={handleCloseStarters}
          />
        </ProgressiveAccessWrapper>
      </div>
      
      {/* Demographics Modal - Lazy loaded */}
      {showDemographics && (
        <Suspense fallback={null}>
          <Demographics 
            profileType={activeProfileType}
            onClose={() => setShowDemographics(false)}
            onComplete={handleDemographicsComplete}
            initialData={unifiedDemographics[activeProfileType]}
          />
        </Suspense>
      )}
      
      {/* Profile Form Modal - Lazy loaded */}
      {showProfileForm && (
        <Suspense fallback={null}>
          <ProfileForm 
            profileType={activeProfileType}
            onClose={() => setShowProfileForm(false)}
            onComplete={handleProfileComplete}
            onBackToDemographics={handleBackToDemographics}
            initialProfiles={unifiedProfiles}
            initialDemographics={unifiedDemographics}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AIInsights;