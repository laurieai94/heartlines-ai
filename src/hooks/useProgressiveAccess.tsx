
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

  // Calculate profile completion percentage based on questionnaire data
  const calculateProfileCompletion = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Check personal profile completion (your profile)
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    if (yourProfile || yourDemographics) {
      // Count key fields from personal questionnaire
      const personalFields = [
        'name', 'pronouns', 'age', 'stressReactions', 'attachmentStyles', 
        'loveLanguages', 'receiveLove', 'familyDynamics', 'relationshipStatus'
      ];
      
      totalFields += personalFields.length;
      
      // Check demographics completion
      if (yourDemographics) {
        completedFields += personalFields.filter(field => {
          const value = yourDemographics[field] || yourProfile?.[field];
          return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
        }).length;
      }
    }

    // Check partner profile completion
    const partnerProfile = temporaryProfiles.partner[0];
    const partnerDemographics = temporaryDemographics.partner;
    
    if (partnerProfile || partnerDemographics) {
      const partnerFields = ['name', 'communicationStyle', 'loveLanguages', 'conflictStyle'];
      totalFields += partnerFields.length;
      
      if (partnerDemographics || partnerProfile) {
        completedFields += partnerFields.filter(field => {
          const value = partnerDemographics?.[field] || partnerProfile?.[field];
          return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
        }).length;
      }
    }

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Determine access level
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    if (profileCompletion > 0) return 'signup-required';
    return 'profile-required';
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
