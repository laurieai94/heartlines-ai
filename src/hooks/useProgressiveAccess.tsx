
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "./usePersonalProfileData";
import { calculateProgress, validateSection } from "@/components/NewPersonalQuestionnaire/utils/validation";
import type { ProfileData } from "@/components/NewPersonalQuestionnaire/types";

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
  // Be resilient if AuthProvider isn't mounted (e.g., during early render or outside tree)
  let user: any = null;
  try {
    user = useAuth().user;
  } catch {
    user = null;
  }
  const personalStorage = usePersonalProfileData();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [blockingAction, setBlockingAction] = useState<string>('');

  // Calculate profile completion percentage using the official validation logic
  const calculateProfileCompletion = () => {
    const profileData = personalStorage.profileData;
    if (!profileData || Object.keys(profileData).length === 0) {
      return 0;
    }

    // Use the official calculateProgress function from validation utils
    return calculateProgress(profileData as ProfileData);
  };

  // Compute detailed profile status for chat access - requires 100% completion
  const computeChatReadiness = () => {
    const profileData = personalStorage.profileData as ProfileData;
    if (!profileData || Object.keys(profileData).length === 0) {
      return { 
        isComplete: false, 
        missingFields: ['Please complete your profile'],
        incompleteSections: [1, 2, 3, 4],
        overallProgress: 0
      };
    }

    // Check completion of each section
    const sectionStatus = [1, 2, 3, 4].map(section => ({
      section,
      isComplete: validateSection(section, profileData)
    }));

    const incompleteSections = sectionStatus
      .filter(s => !s.isComplete)
      .map(s => s.section);

    const overallProgress = calculateProgress(profileData);
    const isComplete = overallProgress === 100;

    // Generate detailed missing fields message
    const missingFields: string[] = [];
    
    if (incompleteSections.includes(1)) {
      missingFields.push('Complete "Who You Are" section');
    }
    if (incompleteSections.includes(2)) {
      missingFields.push('Complete "Your Relationship" section');
    }
    if (incompleteSections.includes(3)) {
      missingFields.push('Complete "How You Operate" section');
    }
    if (incompleteSections.includes(4)) {
      missingFields.push('Complete "Your Foundation" section');
    }

    console.log('🔐 Chat access check (100% requirement):', {
      overallProgress,
      isComplete,
      incompleteSections,
      missingFields
    });

    return { 
      isComplete, 
      missingFields, 
      incompleteSections,
      overallProgress
    };
  };

  const profileCompletion = calculateProfileCompletion();
  const readiness = computeChatReadiness();
  const hasPersonalProfileForChat = readiness.isComplete;
  const missingFieldsForChat = readiness.missingFields;
  const incompleteSections = readiness.incompleteSections;
  const detailedProgress = readiness.overallProgress;
  
  // Determine access level based on authentication and profile completion
  const getAccessLevel = (): AccessLevel => {
    // If no user is logged in, require signup
    if (!user) {
      return 'signup-required';
    }
    
    // If user is logged in but doesn't have essential personal profile, require profile completion
    if (!hasPersonalProfileForChat) {
      return 'profile-required';
    }
    
    // User is authenticated and has completed their personal profile
    return 'full-access';
  };

  const accessLevel = getAccessLevel();

  // Check if user can interact with features based on access level
  const checkInteractionPermission = (action: string): boolean => {
    if (accessLevel === 'full-access') {
      return true;
    }
    
    if (action === 'chat') {
      return false;
    }
    
    return true;
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
    hasPersonalProfileForChat,
    missingFieldsForChat,
    incompleteSections,
    detailedProgress
  };
};
