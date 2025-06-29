
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
      // Core personal fields
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
    if (!isLoaded) return false;
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    console.log('Checking essential personal profile:', { yourProfile, yourDemographics });
    
    // Check for basic required info - using the same pattern as partner profile
    const hasName = yourDemographics?.name || yourProfile?.name;
    const hasAge = yourDemographics?.age || yourProfile?.age;
    
    // Check if we have meaningful profile data - look for any significant responses
    const hasStressReactions = (yourDemographics?.stressReactions && Array.isArray(yourDemographics.stressReactions) && yourDemographics.stressReactions.length > 0) ||
                              (yourProfile?.stressReactions && Array.isArray(yourProfile.stressReactions) && yourProfile.stressReactions.length > 0);
    
    const hasAttachmentStyles = (yourDemographics?.attachmentStyles && Array.isArray(yourDemographics.attachmentStyles) && yourDemographics.attachmentStyles.length > 0) ||
                               (yourProfile?.attachmentStyles && Array.isArray(yourProfile.attachmentStyles) && yourProfile.attachmentStyles.length > 0);
    
    const hasLoveLanguages = (yourDemographics?.loveLanguages && Array.isArray(yourDemographics.loveLanguages) && yourDemographics.loveLanguages.length > 0) ||
                            (yourProfile?.loveLanguages && Array.isArray(yourProfile.loveLanguages) && yourProfile.loveLanguages.length > 0);
    
    const hasReceiveLove = (yourDemographics?.receiveLove && Array.isArray(yourDemographics.receiveLove) && yourDemographics.receiveLove.length > 0) ||
                          (yourProfile?.receiveLove && Array.isArray(yourProfile.receiveLove) && yourProfile.receiveLove.length > 0);
    
    const hasFamilyDynamics = (yourDemographics?.familyDynamics && Array.isArray(yourDemographics.familyDynamics) && yourDemographics.familyDynamics.length > 0) ||
                             (yourProfile?.familyDynamics && Array.isArray(yourProfile.familyDynamics) && yourProfile.familyDynamics.length > 0);
    
    const hasRelationshipStatus = (yourDemographics?.relationshipStatus && Array.isArray(yourDemographics.relationshipStatus) && yourDemographics.relationshipStatus.length > 0) ||
                                 (yourProfile?.relationshipStatus && Array.isArray(yourProfile.relationshipStatus) && yourProfile.relationshipStatus.length > 0);
    
    // Basic requirements: name and age
    const hasBasicInfo = hasName && hasAge;
    
    // Emotional data: at least 2 out of the 4 main categories
    const emotionalDataCount = [hasStressReactions, hasAttachmentStyles, hasLoveLanguages, hasReceiveLove, hasFamilyDynamics, hasRelationshipStatus].filter(Boolean).length;
    const hasEnoughEmotionalData = emotionalDataCount >= 2;
    
    console.log('Essential personal profile check:', { 
      hasName: !!hasName, 
      hasAge: !!hasAge, 
      hasStressReactions,
      hasAttachmentStyles,
      hasLoveLanguages,
      hasReceiveLove,
      hasFamilyDynamics,
      hasRelationshipStatus,
      hasBasicInfo, 
      emotionalDataCount,
      hasEnoughEmotionalData
    });
    
    // User has completed enough personal profile to enable chat
    const isComplete = hasBasicInfo && hasEnoughEmotionalData;
    console.log('Personal profile complete for chat access:', isComplete);
    return isComplete;
  };

  const profileCompletion = calculateProfileCompletion();
  const hasPersonalProfileForChat = hasEssentialPersonalProfile();
  
  // Determine access level - enable chat access with personal profile completion
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    
    // If user has essential personal profile data, enable full functionality including chat
    if (hasPersonalProfileForChat) {
      console.log('Granting full access due to completed personal profile');
      return 'full-access';
    }
    
    // Check if we have any profile data at all
    const hasAnyProfileData = temporaryDemographics.your?.name || 
                             temporaryProfiles.your?.[0]?.name ||
                             (temporaryDemographics.your && Object.keys(temporaryDemographics.your).length > 0);
    
    if (hasAnyProfileData && profileCompletion > 0) return 'profile-required';
    
    return 'profile-required';
  };

  const accessLevel = getAccessLevel();
  console.log('Current access level:', accessLevel, 'hasPersonalProfile:', hasPersonalProfileForChat);

  // Check if user can interact with features - allow all interactions with personal profile
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}, completion: ${profileCompletion}%, hasPersonalProfile: ${hasPersonalProfileForChat}`);
    
    switch (accessLevel) {
      case 'full-access':
        return true;
      
      case 'profile-required':
        // No meaningful profile data - redirect to profile
        setBlockingAction(action);
        return false;
      
      default:
        return false;
    }
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setBlockingAction('');
  };

  return {
    accessLevel,
    canNavigate: true, // Always allow tab navigation
    canInteract: accessLevel === 'full-access',
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal,
    hasPersonalProfileForChat // Export this for other components to use
  };
};
