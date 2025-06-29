
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
      // Core personal fields - reduced requirements for chat access
      const personalFields = [
        'name', 'age', 'stressReactions', 'attachmentStyles', 
        'loveLanguages', 'receiveLove'
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

  // Check if personal profile has essential data for chat
  const hasPersonalProfileForChat = () => {
    if (!isLoaded) return false;
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    // Essential fields needed for meaningful chat interaction
    const hasName = yourDemographics?.name || yourProfile?.name;
    const hasAge = yourDemographics?.age || yourProfile?.age;
    const hasBasicEmotionalData = 
      (yourProfile?.stressReactions?.length > 0 || yourDemographics?.stressReactions?.length > 0) ||
      (yourProfile?.attachmentStyles?.length > 0 || yourDemographics?.attachmentStyles?.length > 0) ||
      (yourProfile?.loveLanguages?.length > 0 || yourDemographics?.loveLanguages?.length > 0);
    
    console.log('Personal profile chat readiness:', { 
      hasName, 
      hasAge, 
      hasBasicEmotionalData,
      canChat: hasName && hasAge && hasBasicEmotionalData
    });
    
    return hasName && hasAge && hasBasicEmotionalData;
  };

  const profileCompletion = calculateProfileCompletion();
  const personalProfileReady = hasPersonalProfileForChat();
  
  // Determine access level - updated logic for immediate chat access
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    
    // If personal profile has essential data, allow chat access
    if (personalProfileReady) return 'full-access';
    
    // Check if we have any meaningful profile data but not enough for chat
    const hasPersonalData = temporaryDemographics.your?.name || 
                           temporaryProfiles.your?.[0]?.name ||
                           (temporaryDemographics.your && Object.keys(temporaryDemographics.your).length > 0);
    
    if (hasPersonalData && profileCompletion >= 30) return 'signup-required';
    if (profileCompletion > 0) return 'profile-required';
    
    return 'profile-required';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features - updated for chat access
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}, completion: ${profileCompletion}%, personal ready: ${personalProfileReady}`);
    
    // Special handling for chat - allow if personal profile is ready
    if (action === 'chat' || action === 'insights') {
      if (personalProfileReady) {
        console.log('Chat access granted: personal profile ready');
        return true;
      }
    }
    
    switch (accessLevel) {
      case 'full-access':
        return true;
      
      case 'signup-required':
        // Profile has some completion but not signed up - show sign-up modal
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
    canInteract: accessLevel === 'full-access' || personalProfileReady,
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal,
    personalProfileReady // Expose this for components that need it
  };
};
