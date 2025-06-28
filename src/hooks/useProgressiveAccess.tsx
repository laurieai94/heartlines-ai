
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
  const { temporaryProfiles, temporaryDemographics } = useTemporaryProfile();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [blockingAction, setBlockingAction] = useState<string>('');

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Check demographics completion
    const demographics = temporaryDemographics.your;
    if (demographics) {
      const demographicsFields = ['name', 'pronouns', 'age'];
      totalFields += demographicsFields.length;
      completedFields += demographicsFields.filter(field => 
        demographics[field] && demographics[field] !== ''
      ).length;
    }

    // Check profile completion
    const profile = temporaryProfiles.your[0];
    if (profile) {
      const profileFields = ['communicationDirectness', 'emotionExpression', 'loveLanguages'];
      totalFields += profileFields.length;
      completedFields += profileFields.filter(field => {
        const value = profile[field];
        return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
      }).length;
    }

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Determine access level
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    if (profileCompletion > 0) return 'signup-required';
    if (profileCompletion === 0) return 'profile-required';
    return 'preview';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}`);
    
    switch (accessLevel) {
      case 'full-access':
        return true;
      
      case 'signup-required':
        // Profile completed but not signed up - show sign-up modal
        setBlockingAction(action);
        setShowSignUpModal(true);
        return false;
      
      case 'profile-required':
        // No profile started - redirect to profile
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
    closeSignUpModal
  };
};
