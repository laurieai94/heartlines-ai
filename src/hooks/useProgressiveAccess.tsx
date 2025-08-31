
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "./usePersonalProfileData";
import { calculateProgress, validateSection } from "@/components/NewPersonalQuestionnaire/utils/validation";
import { getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from "@/components/NewPersonalQuestionnaire/utils/requirements";
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

  // Compute detailed profile status for chat access - requires only 6 required fields
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

    // Use requirements-based validation
    const totalRequired = getTotalRequiredFieldsCount();
    const totalCompleted = getCompletedRequiredFieldsCount(profileData);
    const overallProgress = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
    const isComplete = overallProgress === 100;

    // Check completion of each section using new validation
    const sectionStatus = [1, 2, 3, 4].map(section => ({
      section,
      isComplete: validateSection(section, profileData)
    }));

    const incompleteSections = sectionStatus
      .filter(s => !s.isComplete)
      .map(s => s.section);

    // Generate missing fields message based on required fields
    const missingFields: string[] = [];
    
    if (incompleteSections.includes(1)) {
      missingFields.push('Complete required fields in "The Basics"');
    }
    if (incompleteSections.includes(2)) {
      missingFields.push('Complete "Your Situationship" status');
    }
    if (incompleteSections.includes(3)) {
      missingFields.push('Complete required fields in "How You Operate"');
    }
    if (incompleteSections.includes(4)) {
      missingFields.push('Complete required fields in "Your Foundation"');
    }

    console.log('🔐 Chat access check (6 required fields):', {
      overallProgress,
      isComplete,
      totalRequired,
      totalCompleted,
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
