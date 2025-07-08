
import { useState } from "react";
import { ProfileData, DemographicsData } from "@/types/AIInsights";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import APIKeyInput from "./APIKeyInput";
import ProfileViewer from "./ProfileViewer";
import ProfileForm from "./ProfileForm";
import Demographics from "./Demographics";
import KaiIntroCard from "./sidebar/KaiIntroCard";
import SafeSpaceCard from "./sidebar/SafeSpaceCard";
import ConversationTopicsCard from "./sidebar/ConversationTopicsCard";
import KeyTakeawaysCard from "./sidebar/KeyTakeawaysCard";

interface AISidebarProps {
  profiles: ProfileData;
  demographicsData: DemographicsData;
  chatHistory: any[];
  isConfigured: boolean;
  onSupabaseConfigured: (configured: boolean) => void;
  onOpenProfileForm?: (profileType: 'your' | 'partner') => void;
  onStartConversation?: (starter: string) => void;
}

const AISidebar = ({ 
  profiles, 
  demographicsData, 
  chatHistory, 
  isConfigured, 
  onSupabaseConfigured
}: AISidebarProps) => {
  const { updateTemporaryProfile } = useTemporaryProfile();
  
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');

  const handleProfileComplete = (profileData: any) => {
    setShowProfileForm(false);
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...demographicsData,
      [activeProfileType]: demographics
    };
    updateTemporaryProfile(profiles, newDemographics);
    
    setShowDemographics(false);
    setShowProfileForm(true);
  };

  const handleBackToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  return (
    <>
      <div className="w-full h-full overflow-y-auto space-y-3">
        <KaiIntroCard />
        <SafeSpaceCard />
        <ConversationTopicsCard chatHistory={chatHistory} />
        <KeyTakeawaysCard chatHistory={chatHistory} />

        <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <APIKeyInput onSupabaseConfigured={onSupabaseConfigured} isConfigured={isConfigured} />
        </div>
      </div>

      {/* Profile Viewer Modal */}
      {showProfileViewer && (
        <ProfileViewer
          profileType={viewingProfileType}
          profileData={profiles[viewingProfileType]}
          demographicsData={demographicsData[viewingProfileType]}
          onEdit={() => {
            setShowProfileViewer(false);
            setActiveProfileType(viewingProfileType);
            setShowProfileForm(true);
          }}
          onClose={() => setShowProfileViewer(false)}
        />
      )}

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
    </>
  );
};

export default AISidebar;
