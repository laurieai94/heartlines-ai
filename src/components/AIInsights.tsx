
import { useState, useEffect } from "react";
import { ChatMessage, AIInsightsProps } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChat from "./AIChat";
import AISidebar from "./AISidebar";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";
import { useChatHistory } from "@/hooks/useChatHistory";

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [conversationStarter, setConversationStarter] = useState<string>('');
  
  // Local state to track the most current profile data
  const [currentProfiles, setCurrentProfiles] = useState(profiles);
  const [currentDemographics, setCurrentDemographics] = useState(demographicsData);
  
  const { conversations, currentConversationId, loadConversation, startNewConversation } = useChatHistory();

  // Update local state when props change (from Dashboard updates)
  useEffect(() => {
    console.log('AIInsights received updated profiles:', profiles);
    console.log('AIInsights received updated demographics:', demographicsData);
    setCurrentProfiles(profiles);
    setCurrentDemographics(demographicsData);
  }, [profiles, demographicsData]);

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
    if (!currentDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowProfileForm(true);
    }
  };

  const handleProfileComplete = (profileData: any) => {
    console.log('AIInsights: Profile completed with data:', profileData);
    
    // Create a properly structured profile object
    const structuredProfile = {
      ...profileData,
      id: Date.now().toString(), // Add an ID for tracking
      profileType: activeProfileType,
      completedAt: new Date().toISOString()
    };
    
    // Update local profiles state immediately - replace the entire array with the new profile
    const updatedProfiles = {
      ...currentProfiles,
      [activeProfileType]: [structuredProfile]
    };
    
    console.log('AIInsights: Updated profiles structure:', updatedProfiles);
    setCurrentProfiles(updatedProfiles);
    
    // Also update demographics if it was included in the profile data
    if (profileData.name || profileData.age || profileData.location) {
      const updatedDemographics = {
        ...currentDemographics,
        [activeProfileType]: {
          ...currentDemographics[activeProfileType],
          name: profileData.name || currentDemographics[activeProfileType]?.name,
          age: profileData.age || currentDemographics[activeProfileType]?.age,
          location: profileData.location || currentDemographics[activeProfileType]?.location,
        }
      };
      setCurrentDemographics(updatedDemographics);
    }
    
    setShowProfileForm(false);
    
    // Force a re-render by updating the conversation starter to trigger AI context rebuild
    setConversationStarter(`Profile updated for ${activeProfileType} at ${Date.now()}`);
    
    console.log('AIInsights: Profile update complete, new profiles available to Kai');
  };

  const handleDemographicsComplete = (demographicsData: any) => {
    console.log('AIInsights: Demographics completed with data:', demographicsData);
    
    // Update local demographics state immediately
    const updatedDemographics = {
      ...currentDemographics,
      [activeProfileType]: demographicsData
    };
    setCurrentDemographics(updatedDemographics);
    
    // Handle demographics completion and move to profile form
    setShowDemographics(false);
    setShowProfileForm(true);
    console.log('AIInsights: Updated demographics, moving to profile form');
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
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <AIChat 
        profiles={currentProfiles}
        demographicsData={currentDemographics}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        isConfigured={isConfigured}
        conversationStarter={conversationStarter}
      />
      <AISidebar 
        profiles={currentProfiles}
        demographicsData={currentDemographics}
        chatHistory={chatHistory}
        isConfigured={isConfigured}
        onSupabaseConfigured={handleSupabaseConfigured}
        onOpenProfileForm={handleOpenProfileForm}
        onStartConversation={handleStartConversation}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onLoadConversation={handleLoadConversation}
        onNewConversation={handleNewConversation}
      />
      
      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={currentDemographics[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={currentProfiles}
          initialDemographics={currentDemographics}
        />
      )}
    </div>
  );
};

export default AIInsights;
