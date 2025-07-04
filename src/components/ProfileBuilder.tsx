
import { useState } from "react";
import { toast } from "sonner";
import { useProgressiveAccess } from "@/hooks/useProgressiveAccess";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import ProfileBuilderHeader from "./ProfileBuilder/ProfileBuilderHeader";
import ProfileCards from "./ProfileBuilder/ProfileCards";
import ValueProposition from "./ProfileBuilder/ValueProposition";
import ProfileBuilderTips from "./ProfileBuilder/ProfileBuilderTips";
import ProfileBuilderModals from "./ProfileBuilder/ProfileBuilderModals";

interface ProfileBuilderProps {
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  initialProfiles?: {your: any[], partner: any[]};
  initialDemographics?: {your: any, partner: any};
  onOpenQuestionnaire?: () => void;
}

const ProfileBuilder = ({ 
  onProfileUpdate, 
  initialProfiles = { your: [], partner: [] }, 
  initialDemographics = { your: null, partner: null },
  onOpenQuestionnaire
}: ProfileBuilderProps) => {
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);

  // Use centralized progress tracking and temporary profile data
  const { profileCompletion } = useProgressiveAccess();
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile, isLoaded } = useTemporaryProfile();

  // Get user's name for personalization
  const userName = temporaryDemographics.your?.name || '';

  const calculateYourCompletion = () => {
    if (!isLoaded) return 0;
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemo = temporaryDemographics.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8;
    
    // Core required questions from the questionnaire
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    if (yourDemo?.gender?.length > 0) completed++;
    if (yourDemo?.sexualOrientation?.length > 0) completed++;
    if (yourDemo?.relationshipStatus) completed++;
    if (yourDemo?.whyRealTalk?.length > 0) completed++;
    if (yourDemo?.biggestChallenge?.length > 0) completed++;
    if (yourDemo?.attachmentStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Your profile completion:', { completed, total, completion });
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!isLoaded) return 0;
    
    const partnerProfile = temporaryProfiles.partner[0];
    const partnerDemo = temporaryDemographics.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle || partnerDemo?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0 || partnerDemo?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle || partnerDemo?.conflictStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Partner profile completion:', { completed, total, completion });
    return completion;
  };

  const yourProfileCompletion = calculateYourCompletion();
  const partnerProfileCompletion = calculatePartnerCompletion();

  const handleStartProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // For partner profiles, still use the old flow
    if (!temporaryDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowForm(true);
    }
  };

  const handleStartPersonalProfile = () => {
    // Call the callback to open the questionnaire modal in Dashboard
    if (onOpenQuestionnaire) {
      onOpenQuestionnaire();
    }
  };

  const handleDemographicsComplete = (demographics: any) => {
    const newDemographics = {
      ...temporaryDemographics,
      [activeProfileType]: demographics
    };
    
    // Update temporary profile system
    updateTemporaryProfile(temporaryProfiles, newDemographics);
    setShowDemographics(false);
    setShowForm(true);
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(temporaryProfiles, newDemographics);
    }
  };

  const handleDemographicsClose = () => {
    setShowDemographics(false);
  };

  const handleProfileComplete = (profile: any) => {
    const newProfiles = {
      ...temporaryProfiles,
      [activeProfileType]: [...(temporaryProfiles[activeProfileType] || []).slice(0, 0), profile]
    };
    
    // Update temporary profile system
    updateTemporaryProfile(newProfiles, temporaryDemographics);
    setShowForm(false);
    
    // Check if this is partner profile completion
    if (activeProfileType === 'partner') {
      setShowPartnerCompletionOptions(true);
      toast.success('Partner profile completed!');
    } else {
      toast.success(`${activeProfileType === 'your' ? (userName ? `${userName}'s` : 'Your') : 'Partner'} profile saved successfully!`);
    }
    
    // Call the callback if provided
    if (onProfileUpdate) {
      onProfileUpdate(newProfiles, temporaryDemographics);
    }
  };

  const handlePartnerCompletionClose = () => {
    setShowPartnerCompletionOptions(false);
  };

  const handlePartnerCompletionStartChat = () => {
    setShowPartnerCompletionOptions(false);
    // This would need to be handled by the parent component
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <ProfileBuilderHeader profileCompletion={profileCompletion} />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 space-y-4">
        <ProfileCards
          yourProfileCompletion={yourProfileCompletion}
          partnerProfileCompletion={partnerProfileCompletion}
          onStartPersonalProfile={handleStartPersonalProfile}
          onStartPartnerProfile={() => handleStartProfile('partner')}
        />

        <ValueProposition />

        <ProfileBuilderTips />
      </div>

      <ProfileBuilderModals
        showDemographics={showDemographics}
        showForm={showForm}
        showPartnerCompletionOptions={showPartnerCompletionOptions}
        activeProfileType={activeProfileType}
        temporaryProfiles={temporaryProfiles}
        temporaryDemographics={temporaryDemographics}
        onDemographicsComplete={handleDemographicsComplete}
        onDemographicsClose={handleDemographicsClose}
        onProfileComplete={handleProfileComplete}
        onFormClose={() => setShowForm(false)}
        onPartnerCompletionClose={handlePartnerCompletionClose}
        onPartnerCompletionStartChat={handlePartnerCompletionStartChat}
      />
    </div>
  );
};

export default ProfileBuilder;
