
import { useState, useEffect } from "react";
import { ChatMessage, AIInsightsProps } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChat from "./AIChat";
import AISidebar from "./AISidebar";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";
import { useChatHistory } from "@/hooks/useChatHistory";
import ProgressiveAccessWrapper from "./ProgressiveAccessWrapper";

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [conversationStarter, setConversationStarter] = useState<string>('');
  
  const { conversations, currentConversationId, loadConversation, startNewConversation } = useChatHistory();

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
    if (!demographicsData[profileType]) {
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
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <ProgressiveAccessWrapper action="chat">
        <AIChat 
          profiles={profiles}
          demographicsData={demographicsData}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          isConfigured={isConfigured}
          conversationStarter={conversationStarter}
        />
      </ProgressiveAccessWrapper>
      <AISidebar 
        profiles={profiles}
        demographicsData={demographicsData}
        chatHistory={chatHistory}
        isConfigured={isConfigured}
        onSupabaseConfigured={handleSupabaseConfigured}
        onOpenProfileForm={handleOpenProfileForm}
        onStartConversation={handleStartConversation}
      />
      
      {/* Demographics Modal */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onClose={() => setShowDemographics(false)}
          onComplete={handleDemographicsComplete}
          initialData={demographicsData[activeProfileType]}
        />
      )}
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
          onBackToDemographics={handleBackToDemographics}
          initialProfiles={profiles}
          initialDemographics={demographicsData}
        />
      )}
    </div>
  );
};

export default AIInsights;
