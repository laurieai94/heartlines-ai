
import { useState } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfileQuestionnaire = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showCompletionOptions, setShowCompletionOptions] = useState(false);
  const { updateTemporaryProfile, temporaryProfiles, temporaryDemographics } = useTemporaryProfile();

  const openQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal questionnaire completed with data:', questionnaireData);
    
    // Merge with existing data and save to temporary profile system
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    // Create comprehensive profile data
    const updatedProfile = {
      ...existingProfile,
      ...questionnaireData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    const updatedDemographics = {
      ...existingDemographics,
      ...questionnaireData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    // Update temporary profile system
    const newProfiles = {
      ...temporaryProfiles,
      your: [updatedProfile]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: updatedDemographics
    };
    
    console.log('Saving questionnaire data to temporary profile:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    
    setShowQuestionnaire(false);
    setShowCompletionOptions(true);
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
  };

  const handleCompletionOptionsClose = () => {
    setShowCompletionOptions(false);
  };

  const handleAddPartnerProfile = () => {
    setShowCompletionOptions(false);
  };

  const handleStartChatting = () => {
    setShowCompletionOptions(false);
  };

  return {
    showQuestionnaire,
    showCompletionOptions,
    openQuestionnaire,
    handleQuestionnaireComplete,
    handleQuestionnaireClose,
    handleCompletionOptionsClose,
    handleAddPartnerProfile,
    handleStartChatting
  };
};
