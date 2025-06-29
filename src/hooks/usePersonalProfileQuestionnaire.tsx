
import { useState } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';
import { useNavigation } from '@/contexts/NavigationContext';

export const usePersonalProfileQuestionnaire = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showCompletionOptions, setShowCompletionOptions] = useState(false);
  const { updateTemporaryProfile, temporaryProfiles, temporaryDemographics } = useTemporaryProfile();
  const { goToCoach } = useNavigation();

  const openQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal questionnaire completed with data:', questionnaireData);
    
    // Get existing data from both profiles and demographics
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    // Merge all existing data with new questionnaire data
    const mergedData = {
      ...existingProfile,
      ...existingDemographics,
      ...questionnaireData,
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire'
    };
    
    // Update both profile and demographics with the complete merged data
    const newProfiles = {
      ...temporaryProfiles,
      your: [mergedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: mergedData
    };
    
    console.log('Saving complete questionnaire data:', { newProfiles, newDemographics });
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
    // Stay on profile tab for partner profile creation
  };

  const handleStartChatting = () => {
    console.log('usePersonalProfileQuestionnaire: Starting chat, navigating to coach');
    setShowCompletionOptions(false);
    goToCoach();
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
