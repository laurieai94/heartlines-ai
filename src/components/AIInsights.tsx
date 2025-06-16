
import { useState, useEffect } from "react";
import { ChatMessage, AIInsightsProps } from "@/types/AIInsights";
import { AICoachEngine } from "./AICoachEngine";
import AIChat from "./AIChat";
import AISidebar from "./AISidebar";
import ProfileForm from "./ProfileForm";

const AIInsights = ({ profiles = { your: [], partner: [] }, demographicsData = { your: null, partner: null } }: AIInsightsProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [conversationStarter, setConversationStarter] = useState<string>('');

  // Initialize Supabase configuration on mount
  useEffect(() => {
    console.log('Initializing Supabase configuration...');
    const configured = AICoachEngine.initializeSupabase();
    setIsConfigured(configured);
  }, []);

  const handleSupabaseConfigured = (configured: boolean) => {
    setIsConfigured(configured);
  };

  const handleOpenProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    setShowProfileForm(true);
  };

  const handleProfileComplete = (profileData: any) => {
    // Handle profile completion - this would typically update the profiles state
    setShowProfileForm(false);
  };

  const handleStartConversation = (starter: string) => {
    setConversationStarter(starter);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <AIChat 
        profiles={profiles}
        demographicsData={demographicsData}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        isConfigured={isConfigured}
        conversationStarter={conversationStarter}
      />
      <AISidebar 
        profiles={profiles}
        demographicsData={demographicsData}
        chatHistory={chatHistory}
        isConfigured={isConfigured}
        onSupabaseConfigured={handleSupabaseConfigured}
        onOpenProfileForm={handleOpenProfileForm}
        onStartConversation={handleStartConversation}
      />
      
      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowProfileForm(false)}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
};

export default AIInsights;
