
import { useState } from "react";
import Demographics from "@/components/Demographics";
import ProfileForm from "@/components/ProfileForm";
import ProfileCompletionOptions from "@/components/ProfileCompletionOptions";

interface ProfileBuilderModalsProps {
  temporaryProfiles: any;
  temporaryDemographics: any;
  onProfileUpdate?: (newProfiles: any, newDemographics: any) => void;
  updateTemporaryProfile: (newProfiles: any, newDemographics: any) => void;
}

const ProfileBuilderModals = ({
  temporaryProfiles,
  temporaryDemographics,
  onProfileUpdate,
  updateTemporaryProfile
}: ProfileBuilderModalsProps) => {
  const [showDemographics, setShowDemographics] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');
  const [showPartnerCompletionOptions, setShowPartnerCompletionOptions] = useState(false);

  const handleStartProfile = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    // For partner profiles, still use the old flow
    if (!temporaryDemographics[profileType]) {
      setShowDemographics(true);
    } else {
      setShowForm(true);
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
    const userName = temporaryDemographics.your?.name || '';
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
    <>
      {/* Modals for partner profile only */}
      {showDemographics && (
        <Demographics 
          profileType={activeProfileType}
          onComplete={handleDemographicsComplete}
          onClose={handleDemographicsClose}
          initialData={temporaryDemographics[activeProfileType]}
        />
      )}

      {showForm && (
        <ProfileForm 
          profileType={activeProfileType}
          onClose={() => setShowForm(false)}
          onComplete={handleProfileComplete}
          initialProfiles={temporaryProfiles}
          initialDemographics={temporaryDemographics}
        />
      )}

      {/* Partner Profile Completion Options */}
      {showPartnerCompletionOptions && (
        <ProfileCompletionOptions
          completionType="partner"
          onAddPartnerProfile={() => {}} // Not used for partner completion
          onStartChatting={handlePartnerCompletionStartChat}
          onClose={handlePartnerCompletionClose}
          hasPartnerProfile={true}
        />
      )}
    </>
  );
};

export default ProfileBuilderModals;
