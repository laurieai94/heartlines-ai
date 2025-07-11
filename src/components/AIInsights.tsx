import { useState, useEffect } from "react";
import { ChatMessage, AIInsightsProps } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChat from "./AIChat";
import AISidebar from "./AISidebar";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import { usePersonalProfilePersistence } from "@/hooks/usePersonalProfilePersistence";
import { usePartnerProfileData } from "@/hooks/usePartnerProfileData";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [conversationStarter, setConversationStarter] = useState<string>('');
  
  // Get actual profile data from the questionnaire system
  const { profileData: personalProfileData, isReady: personalDataReady } = usePersonalProfileData();
  const { profileData: personalProfilePersistence, isReady: persistenceReady } = usePersonalProfilePersistence();
  const { profileData: partnerProfileData, isLoading: partnerDataLoading } = usePartnerProfileData();
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  const { conversations, currentConversationId, loadConversation, startNewConversation } = useChatHistory();

  // Create unified profiles and demographics data
  const [unifiedProfiles, setUnifiedProfiles] = useState({ your: [], partner: [] });
  const [unifiedDemographics, setUnifiedDemographics] = useState({ your: null, partner: null });

  useEffect(() => {
    console.log('=== AIInsights: Profile Data Sources ===');
    console.log('personalProfileData:', personalProfileData);
    console.log('personalProfilePersistence:', personalProfilePersistence);
    console.log('partnerProfileData:', partnerProfileData);
    console.log('temporaryProfiles:', temporaryProfiles);
    console.log('temporaryDemographics:', temporaryDemographics);
    console.log('personalDataReady:', personalDataReady);
    console.log('persistenceReady:', persistenceReady);
    console.log('partnerDataLoading:', partnerDataLoading);

    if (personalDataReady && persistenceReady && !partnerDataLoading) {
      // Merge ALL personal profile data sources
      const mergedPersonalData = {
        ...temporaryDemographics.your,
        ...personalProfilePersistence,
        ...personalProfileData
      };

      // Merge partner profile data from questionnaire and temporary sources
      const mergedPartnerData = {
        ...temporaryDemographics.partner,
        ...temporaryProfiles.partner[0], // Get first partner profile if exists
        ...partnerProfileData // This includes data from 'partner_profile_questionnaire' localStorage
      };

      console.log('=== Merged Data ===');
      console.log('mergedPersonalData:', mergedPersonalData);
      console.log('mergedPartnerData:', mergedPartnerData);

      // Create unified profile structure - ensure we have data in both profile and demographics
      const newUnifiedProfiles = {
        your: Object.keys(mergedPersonalData).length > 0 ? [mergedPersonalData] : temporaryProfiles.your,
        partner: Object.keys(mergedPartnerData).length > 0 ? [mergedPartnerData] : temporaryProfiles.partner
      };

      const newUnifiedDemographics = {
        your: Object.keys(mergedPersonalData).length > 0 ? mergedPersonalData : temporaryDemographics.your,
        partner: Object.keys(mergedPartnerData).length > 0 ? mergedPartnerData : temporaryDemographics.partner
      };

      console.log('=== Final Unified Data ===');
      console.log('newUnifiedProfiles:', newUnifiedProfiles);
      console.log('newUnifiedDemographics:', newUnifiedDemographics);

      setUnifiedProfiles(newUnifiedProfiles);
      setUnifiedDemographics(newUnifiedDemographics);
    }
  }, [personalProfileData, personalProfilePersistence, partnerProfileData, personalDataReady, persistenceReady, partnerDataLoading, temporaryProfiles, temporaryDemographics]);

  // Initialize Supabase configuration on mount
  useEffect(() => {
    console.log('Initializing Supabase configuration...');
    const configured = AICoachEngine.initializeSupabase();
    setIsConfigured(configured);
  }, []);

  // Handle new conversation
  const handleNewConversation = () => {
    const messages = startNewConversation();
    setChatHistory(messages);
    setConversationStarter('');
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

  const handleLoadConversation = (conversationId: string) => {
    const messages = loadConversation(conversationId);
    setChatHistory(messages);
  };

  // Debug: Log what we're passing to AIChat
  console.log('=== Passing to AIChat ===');
  console.log('unifiedProfiles:', unifiedProfiles);
  console.log('unifiedDemographics:', unifiedDemographics);

  return (
    <div className="flex gap-4 h-full min-h-0 overflow-hidden">
      <ProgressiveAccessWrapper action="chat">
        <div className="flex-1 min-w-0 min-h-0">
          <AIChat 
            profiles={unifiedProfiles}
            demographicsData={unifiedDemographics}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            isConfigured={isConfigured}
            conversationStarter={conversationStarter}
            onNewConversation={handleNewConversation}
          />
        </div>
      </ProgressiveAccessWrapper>
      <div className="w-80 flex-shrink-0 min-h-0">
        <AISidebar 
          profiles={unifiedProfiles}
          demographicsData={unifiedDemographics}
          chatHistory={chatHistory}
          isConfigured={isConfigured}
          onSupabaseConfigured={handleSupabaseConfigured}
          onOpenProfileForm={handleOpenProfileForm}
          onStartConversation={handleStartConversation}
        />
      </div>
      
      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={unifiedDemographics[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={unifiedProfiles}
          initialDemographics={unifiedDemographics}
        />
      )}
    </div>
  );
};

export default AIInsights;
