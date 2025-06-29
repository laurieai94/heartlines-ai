
import { useState } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const usePersonalProfileQuestionnaire = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { updateTemporaryProfile, temporaryProfiles, temporaryDemographics } = useTemporaryProfile();
  const navigate = useNavigate();

  const handleQuestionnaireComplete = (questionnaireData: any) => {
    console.log('Personal profile questionnaire completed:', questionnaireData);
    
    // Get existing data and merge with new data
    const existingProfile = temporaryProfiles.your?.[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    // Transform questionnaire data into the profile structure
    const profileData = {
      ...existingProfile, // Keep existing data
      
      // Basic demographics
      name: questionnaireData.name,
      pronouns: questionnaireData.pronouns,
      customPronouns: questionnaireData.customPronouns,
      gender: questionnaireData.gender,
      customGender: questionnaireData.customGender,
      orientation: questionnaireData.orientation,
      customOrientation: questionnaireData.customOrientation,
      age: questionnaireData.age,
      relationshipStatus: questionnaireData.relationshipStatus,
      
      // Emotional blueprint
      stressReactions: questionnaireData.stressReactions,
      attachmentStyles: questionnaireData.attachmentStyles,
      conflictNeeds: questionnaireData.conflictNeeds,
      loveLanguages: questionnaireData.showLove,
      receiveLove: questionnaireData.receiveLove,
      
      // Past & foundations
      familyDynamics: questionnaireData.familyDynamics,
      professionalSupport: questionnaireData.professionalSupport,
      relationshipInfluences: questionnaireData.relationshipInfluences,
      relationshipPatterns: questionnaireData.relationshipPatterns,
      
      // Current relationship
      partnerName: questionnaireData.partnerName,
      relationshipType: questionnaireData.relationshipType,
      relationshipDuration: questionnaireData.relationshipDuration,
      relationshipPositives: questionnaireData.relationshipPositives,
      otherPositives: questionnaireData.otherPositives,
      relationshipChallenges: questionnaireData.relationshipChallenges,
      livingArrangement: questionnaireData.livingArrangement,
      emotionalConnection: questionnaireData.emotionalConnection,
      
      // Hopes and goals
      hopingFor: questionnaireData.hopingFor,
      readiness: questionnaireData.readiness,
      healthyRelationship: questionnaireData.healthyRelationship,
      otherHealthy: questionnaireData.otherHealthy,
      additionalInfo: questionnairedData.additionalInfo,
      
      // Metadata
      completedAt: new Date().toISOString(),
      profileSource: 'personal-questionnaire',
      avatarUrl: questionnaireData.avatarUrl
    };

    // Create demographics data for easier access
    const demographicsData = {
      ...existingDemographics, // Keep existing data
      
      name: questionnaireData.name,
      pronouns: Array.isArray(questionnaireData.pronouns) ? questionnaireData.pronouns[0] : questionnaireData.customPronouns,
      age: questionnaireData.age,
      gender: Array.isArray(questionnaireData.gender) ? questionnaireData.gender[0] : questionnaireData.customGender,
      orientation: Array.isArray(questionnaireData.orientation) ? questionnaireData.orientation[0] : questionnaireData.customOrientation,
      relationshipStatus: Array.isArray(questionnaireData.relationshipStatus) ? questionnaireData.relationshipStatus[0] : questionnaireData.relationshipStatus,
      avatarUrl: questionnaireData.avatarUrl,
      stressReactions: questionnaireData.stressReactions,
      attachmentStyles: questionnaireData.attachmentStyles,
      loveLanguages: questionnaireData.showLove,
      receiveLove: questionnaireData.receiveLove,
      familyDynamics: questionnaireData.familyDynamics
    };

    // Update the temporary profile system
    const newProfiles = {
      ...temporaryProfiles,
      your: [profileData]
    };

    const newDemographics = {
      ...temporaryDemochemicsDemographics,
      your: demographicsData
    };

    console.log('Saving profile data:', { newProfiles, newDemographics });
    updateTemporaryProfile(newProfiles, newDemographics);
    setShowQuestionnaire(false);
    
    toast.success("Personal profile completed! You can now chat with Kai about your relationship.");
    
    // Redirect to chat page after completion
    setTimeout(() => {
      navigate('/dashboard', { state: { activeTab: 'insights' } });
    }, 1500);
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
  };

  const openQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  return {
    showQuestionnaire,
    openQuestionnaire,
    handleQuestionnaireComplete,
    handleQuestionnaireClose
  };
};
