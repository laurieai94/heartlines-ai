
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTemporaryProfile } from "./useTemporaryProfile";

export type AccessLevel = 'preview' | 'profile-required' | 'signup-required' | 'full-access';

export interface ProgressiveAccessState {
  accessLevel: AccessLevel;
  canNavigate: boolean;
  canInteract: boolean;
  profileCompletion: number;
  shouldShowSignUpModal: boolean;
  blockingAction?: string;
}

export const useProgressiveAccess = () => {
  const { user } = useAuth();
  const { temporaryProfiles, temporaryDemographics, isLoaded } = useTemporaryProfile();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [blockingAction, setBlockingAction] = useState<string>('');

  // Calculate profile completion percentage based on actual data
  const calculateProfileCompletion = () => {
    // Don't calculate until data is loaded
    if (!isLoaded) {
      console.log('Profile completion: waiting for data to load');
      return 0;
    }

    let totalFields = 0;
    let completedFields = 0;

    console.log('Calculating profile completion with data:', { temporaryProfiles, temporaryDemographics });

    // Check personal profile completion (your profile)
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    if (yourProfile || yourDemographics) {
      // Core personal fields - matching what the questionnaire actually saves
      const personalFields = [
        'name', 'age', 'stressReactions', 'attachmentStyles', 
        'loveLanguages', 'receiveLove', 'familyDynamics', 'relationshipStatus'
      ];
      
      totalFields += personalFields.length;
      
      // Check demographics and profile completion
      personalFields.forEach(field => {
        const value = yourDemographics?.[field] || yourProfile?.[field];
        if (value && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
          completedFields++;
          console.log(`Personal field ${field} completed:`, value);
        }
      });
    }

    const completion = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    console.log('Profile completion calculated:', { completedFields, totalFields, completion });
    return completion;
  };

  // Check if personal profile has essential information for chat access
  const hasEssentialPersonalProfile = () => {
    if (!isLoaded) {
      console.log('Data not loaded yet, returning false for hasEssentialPersonalProfile');
      return false;
    }
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    console.log('Checking essential personal profile:', { yourProfile, yourDemographics });
    
    // Comprehensive check - look in both data sources and merge them
    const allData = { 
      ...(yourProfile || {}), 
      ...(yourDemographics || {}) 
    };
    
    console.log('Merged personal profile data for checking:', allData);
    
    // Basic requirements
    const hasName = allData?.name && allData.name.trim() !== '';
    const hasAge = allData?.age && allData.age !== '';
    
    // Core questionnaire fields that indicate completion
    const hasStressReactions = Array.isArray(allData?.stressReactions) && allData.stressReactions.length > 0;
    const hasAttachmentStyles = Array.isArray(allData?.attachmentStyles) && allData.attachmentStyles.length > 0;
    const hasLoveLanguages = Array.isArray(allData?.loveLanguages) && allData.loveLanguages.length > 0;
    const hasReceiveLove = Array.isArray(allData?.receiveLove) && allData.receiveLove.length > 0;
    const hasFamilyDynamics = Array.isArray(allData?.familyDynamics) && allData.familyDynamics.length > 0;
    const hasRelationshipStatus = Array.isArray(allData?.relationshipStatus) && allData.relationshipStatus.length > 0;
    
    // Check if profile was completed via questionnaire
    const hasQuestionnaireSource = allData?.profileSource === 'personal-questionnaire';
    
    console.log('Essential profile check details:', {
      hasName,
      hasAge,
      hasStressReactions,
      hasAttachmentStyles,
      hasLoveLanguages,
      hasReceiveLove,
      hasFamilyDynamics,
      hasRelationshipStatus,
      hasQuestionnaireSource,
      allDataKeys: Object.keys(allData)
    });
    
    // Must have basic info AND at least 4 core questionnaire responses OR be marked as questionnaire complete
    const hasBasicInfo = hasName && hasAge;
    const coreResponses = [hasStressReactions, hasAttachmentStyles, hasLoveLanguages, hasReceiveLove, hasFamilyDynamics, hasRelationshipStatus].filter(Boolean).length;
    const hasEnoughData = coreResponses >= 4 || hasQuestionnaireSource;
    
    const isComplete = hasBasicInfo && hasEnoughData;
    console.log('Personal profile complete for access:', { 
      isComplete, 
      hasBasicInfo, 
      coreResponses, 
      hasEnoughData,
      hasQuestionnaireSource 
    });
    
    return isComplete;
  };

  const profileCompletion = calculateProfileCompletion();
  const hasPersonalProfileForChat = hasEssentialPersonalProfile();
  
  const getAccessLevel = (): AccessLevel => {
    // If user is authenticated, grant full access
    if (user) {
      console.log('User authenticated - granting full access');
      return 'full-access';
    }
    
    // If not authenticated, require signup for interactions
    console.log('User not authenticated - requiring signup');
    return 'signup-required';
  };

  const accessLevel = getAccessLevel();
  console.log('Current access level:', accessLevel, 'hasPersonalProfile:', hasPersonalProfileForChat);

  // Check if user can interact with features
  const checkInteractionPermission = (action: string): boolean => {
    if (accessLevel === 'full-access') {
      console.log(`User authenticated - allowing action: ${action}`);
      return true;
    }
    
    // For unauthenticated users trying to chat, trigger signup modal
    if (action === 'chat' && accessLevel === 'signup-required') {
      console.log('Triggering signup modal for chat interaction');
      setShowSignUpModal(true);
      setBlockingAction(action);
      return false;
    }
    
    console.log(`Blocking action: ${action} for access level: ${accessLevel}`);
    return false;
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setBlockingAction('');
  };

  return {
    accessLevel,
    canNavigate: true,
    canInteract: accessLevel === 'full-access',
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal,
    hasPersonalProfileForChat
  };
};
