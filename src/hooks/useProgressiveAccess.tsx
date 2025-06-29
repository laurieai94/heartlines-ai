
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTemporaryProfile } from "./useTemporaryProfile";

export type AccessLevel = 'preview' | 'profile-required' | 'chat-enabled' | 'signup-required' | 'full-access';

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
        'name', 'age', 'stressReactions', 'attachmentStyles', 
        'loveLanguages', 'receiveLove', 'familyDynamics', 'relationshipStatus'
      ];
      
      totalFields += personalFields.length;
      
      // Check demographics and profile completion
      if (yourDemographics || yourProfile) {
        completedFields += personalFields.filter(field => {
          const demoValue = yourDemographics?.[field];
          const profileValue = yourProfile?.[field];
          const value = demoValue || profileValue;
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
          const demoValue = partnerDemographics?.[field];
          const profileValue = partnerProfile?.[field];
          const value = demoValue || profileValue;
          return value && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
        }).length;
      }
    }

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  // Check if personal profile has minimum completion for chat access
  const hasMinimalPersonalProfile = () => {
    const yourProfile = temporaryProfiles.your[0];
    const yourDemographics = temporaryDemographics.your;
    
    if (!yourProfile && !yourDemographics) return false;
    
    // Check for minimum required fields
    const hasName = yourDemographics?.name;
    const hasAge = yourDemographics?.age;
    const hasStressReactions = yourProfile?.stressReactions?.length > 0;
    const hasLoveLanguage = yourProfile?.loveLanguages?.length > 0 || yourProfile?.showLove?.length > 0;
    
    // At least 3 out of 4 key fields should be completed for chat access
    const completedKeyFields = [hasName, hasAge, hasStressReactions, hasLoveLanguage].filter(Boolean).length;
    return completedKeyFields >= 3;
  };

  const profileCompletion = calculateProfileCompletion();
  const canAccessChat = hasMinimalPersonalProfile();
  
  // Determine access level
  const getAccessLevel = (): AccessLevel => {
    if (user) return 'full-access';
    if (canAccessChat) return 'chat-enabled'; // New level for chat access without signup
    if (profileCompletion > 0) return 'signup-required';
    return 'profile-required';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features
  const checkInteractionPermission = (action: string): boolean => {
    console.log(`Checking permission for action: ${action}, access level: ${accessLevel}, can access chat: ${canAccessChat}`);
    
    switch (accessLevel) {
      case 'full-access':
        return true;
      
      case 'chat-enabled':
        // Personal profile completed - allow chat and insights, but show signup for other features
        if (action === 'chat' || action === 'insights') {
          return true;
        }
        // For other actions, show signup modal
        setBlockingAction(action);
        setShowSignUpModal(true);
        return false;
      
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
    canInteract: accessLevel === 'full-access' || (accessLevel === 'chat-enabled' && canAccessChat),
    canAccessChat,
    profileCompletion,
    shouldShowSignUpModal: showSignUpModal,
    blockingAction,
    checkInteractionPermission,
    closeSignUpModal
  };
};
