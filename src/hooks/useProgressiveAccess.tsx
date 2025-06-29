
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

  const profileCompletion = calculateProfileCompletion();
  
  // Determine access level
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    
    // Check if we have any meaningful profile data
    const hasPersonalData = temporaryDemographics.your?.name || 
                           temporaryProfiles.your?.[0]?.name ||
                           (temporaryDemographics.your && Object.keys(temporaryDemographics.your).length > 0);
    
    if (hasPersonalData && profileCompletion >= 30) return 'signup-required';
    if (profileCompletion > 0) return 'profile-required';
    
    return 'profile-required';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}, completion: ${profileCompletion}%`);
    
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
    canInteract: accessLevel === 'full-access' || (accessLevel === 'signup-required' && profileCompletion >= 30),
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal
  };
};
