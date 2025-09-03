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

  useEffect(() => {
    // Reduced logging for better performance

    if (personalDataReady && !partnerDataLoading) {
      // Merge ALL personal profile data sources
      const mergedPersonalData = {
        ...temporaryDemographics.your,
        ...personalProfileData
      };

      // Merge partner profile data from questionnaire and temporary sources
      const mergedPartnerData = {
        ...temporaryDemographics.partner,
        ...temporaryProfiles.partner[0], // Get first partner profile if exists
        ...partnerProfileData // This includes data from 'partner_profile_questionnaire' localStorage
      };

      // Create unified profile structure - ensure we have data in both profile and demographics
      const newUnifiedProfiles = {
        your: Object.keys(mergedPersonalData).length > 0 ? [mergedPersonalData] : temporaryProfiles.your,
        partner: Object.keys(mergedPartnerData).length > 0 ? [mergedPartnerData] : temporaryProfiles.partner
      };

      const newUnifiedDemographics = {
        your: Object.keys(mergedPersonalData).length > 0 ? mergedPersonalData : temporaryDemographics.your,
        partner: Object.keys(mergedPartnerData).length > 0 ? mergedPartnerData : temporaryDemographics.partner
      };

      setUnifiedProfiles(newUnifiedProfiles);
      setUnifiedDemographics(newUnifiedDemographics);
    }
  }, [personalProfileData, partnerProfileData, personalDataReady, partnerDataLoading, temporaryProfiles, temporaryDemographics]);

  // Defer Supabase initialization to avoid blocking render
  useEffect(() => {
    const timer = setTimeout(() => {
      const configured = AICoachEngine.initializeSupabase();
      setIsConfigured(configured);
    }, 100); // Small delay to allow UI to render first
    return () => clearTimeout(timer);
  }, []);

  // Handle new conversation
  const handleNewConversation = () => {
    setIsStartingNewConversation(true);
    const messages = startNewConversation();
    setChatHistory(messages);
    setConversationStarter('');
    setShowStarters(true); // Show starters when starting new conversation
    // Reset the flag after a brief delay
    setTimeout(() => setIsStartingNewConversation(false), 100);
  };

  const handleCloseStarters = () => {
    setShowStarters(false);
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

  // Removed debug logs for performance

  return (
    <div className="h-full min-h-0 max-h-full overflow-hidden flex flex-col px-2 sm:px-3 lg:px-4 pt-0 pb-2 sm:pb-3 lg:pb-4">
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