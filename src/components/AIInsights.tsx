
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
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile } = useTemporaryProfile();
  
  const { conversations, currentConversationId, loadConversation, startNewConversation } = useChatHistory();

  // Combine all profile data sources into a unified format
  const [unifiedProfiles, setUnifiedProfiles] = useState({ your: [], partner: [] });
  const [unifiedDemographics, setUnifiedDemographics] = useState({ your: null, partner: null });

  useEffect(() => {
    if (personalDataReady && persistenceReady) {
      // Merge personal profile data from both hooks
      const mergedPersonalData = {
        ...personalProfilePersistence,
        ...personalProfileData
      };

      // Create unified profile structure
      const newUnifiedProfiles = {
        your: mergedPersonalData && Object.keys(mergedPersonalData).length > 0 ? [mergedPersonalData] : temporaryProfiles.your,
        partner: temporaryProfiles.partner
      };

      const newUnifiedDemographics = {
        your: mergedPersonalData && Object.keys(mergedPersonalData).length > 0 ? mergedPersonalData : temporaryDemographics.your,
        partner: temporaryDemographics.partner
      };

      console.log('Unified profile data:', newUnifiedProfiles);
      console.log('Unified demographics data:', newUnifiedDemographics);

      setUnifiedProfiles(newUnifiedProfiles);
      setUnifiedDemographics(newUnifiedDemographics);
    }
  }, [personalProfileData, personalProfilePersistence, personalDataReady, persistenceReady, temporaryProfiles, temporaryDemographics]);

  // Initialize Supabase configuration on mount
  useEffect(() => {
    console.log('Initializing Supabase configuration...');
    const configured = AICoachEngine.initializeSupabase();
    setIsConfigured(configured);
  }, []);

  // Load the most recent conversation on mount
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      const latestConversation = conversations[0];
      const messages = loadConversation(latestConversation.id);
      setChatHistory(messages);
    }
  }, [conversations, currentConversationId, loadConversation]);

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

  const handleNewConversation = () => {
    const messages = startNewConversation();
    setChatHistory(messages);
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      <ProgressiveAccessWrapper action="chat">
        <div className="flex-1 min-w-0">
          <AIChat 
            profiles={unifiedProfiles}
            demographicsData={unifiedDemographics}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            isConfigured={isConfigured}
            conversationStarter={conversationStarter}
          />
        </div>
      </ProgressiveAccessWrapper>
      <div className="w-80 flex-shrink-0">
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
