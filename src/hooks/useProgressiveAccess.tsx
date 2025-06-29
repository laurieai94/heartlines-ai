
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

    // Check partner profile completion
    const partnerProfile = temporaryProfiles.partner[0];
    const partnerDemographics = temporaryDemographics.partner;
    
    if (partnerProfile || partnerDemographics) {
      const partnerFields = ['name', 'communicationStyle', 'loveLanguages', 'conflictStyle'];
      totalFields += partnerFields.length;
      
      partnerFields.forEach(field => {
        const value = partnerDemographics?.[field] || partnerProfile?.[field];
        if (value && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
          completedFields++;
          console.log(`Partner field ${field} completed:`, value);
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
    
    // Check for essential fields that indicate meaningful personal profile completion
    const hasName = yourDemographics?.name || yourProfile?.name;
    const hasEmotionalData = (yourProfile?.stressReactions?.length > 0 || yourDemographics?.stressReactions?.length > 0) ||
                            (yourProfile?.attachmentStyles?.length > 0 || yourDemographics?.attachmentStyles?.length > 0) ||
                            (yourProfile?.loveLanguages?.length > 0 || yourDemographics?.loveLanguages?.length > 0);
    
    const hasBasicInfo = hasName && (yourDemographics?.age || yourProfile?.age);
    
    console.log('Essential personal profile check:', { hasName, hasEmotionalData, hasBasicInfo });
    
    // User has completed enough personal profile to enable chat
    return hasBasicInfo && hasEmotionalData;
  };

  const profileCompletion = calculateProfileCompletion();
  const hasPersonalProfileForChat = hasEssentialPersonalProfile();
  
  // Determine access level - key change: enable chat access with personal profile completion
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    
    // If user has essential personal profile data, enable chat access
    if (hasPersonalProfileForChat) return 'signup-required';
    
    // Check if we have any profile data at all
    const hasAnyProfileData = temporaryDemographics.your?.name || 
                             temporaryProfiles.your?.[0]?.name ||
                             (temporaryDemographics.your && Object.keys(temporaryDemographics.your).length > 0);
    
    if (hasAnyProfileData && profileCompletion > 0) return 'profile-required';
    
    return 'profile-required';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features - key change: allow chat with personal profile
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}, completion: ${profileCompletion}%, hasPersonalProfile: ${hasPersonalProfileForChat}`);
    
    switch (accessLevel) {
      case 'full-access':
        return true;
      
      case 'signup-required':
        // Personal profile completed - enable chat immediately, show signup for other actions
        if (action === 'chat' || action === 'insights') {
          return true; // Allow immediate chat access
        }
        // For other actions, show sign-up modal
        setBlockingAction(action);
        setShowSignUpModal(true);
        return false;
      
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
    canInteract: accessLevel === 'full-access' || (accessLevel === 'signup-required' && hasPersonalProfileForChat),
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal,
    hasPersonalProfileForChat // Export this for other components to use
  };
};
