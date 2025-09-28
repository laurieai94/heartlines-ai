
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "./usePersonalProfileData";
import { calculateProgressOptimized, validateSectionOptimized } from "@/components/NewPersonalQuestionnaire/utils/optimizedValidation";
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

  // Memoized profile completion calculation
  const profileCompletion = useMemo(() => {
    const profileData = personalStorage.profileData;
    if (!profileData || Object.keys(profileData).length === 0) {
      return 0;
    }
    return calculateProgressOptimized(profileData as ProfileData);
  }, [personalStorage.profileData]);

  // Memoized chat readiness computation
  const chatReadiness = useMemo(() => {
    const profileData = personalStorage.profileData as ProfileData;
    if (!profileData || Object.keys(profileData).length === 0) {
      return { 
        isComplete: false, 
        missingFields: ['Please complete your profile'],
        incompleteSections: [1, 2, 3, 4],
        overallProgress: 0
      };
    }

    // Use optimized validation
    const totalRequired = getTotalRequiredFieldsCount();
    const totalCompleted = getCompletedRequiredFieldsCount(profileData);
    const overallProgress = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
    const isComplete = overallProgress === 100;

    // Check completion of each section using optimized validation
    const sectionStatus = [1, 2, 3, 4].map(section => ({
      section,
      isComplete: validateSectionOptimized(section, profileData)
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

    return { 
      isComplete, 
      missingFields, 
      incompleteSections,
      overallProgress
    };
  }, [personalStorage.profileData]);

  const hasPersonalProfileForChat = chatReadiness.isComplete;
  const missingFieldsForChat = chatReadiness.missingFields;
  const incompleteSections = chatReadiness.incompleteSections;
  const detailedProgress = chatReadiness.overallProgress;
  
  // Memoized access level calculation
  const accessLevel = useMemo((): AccessLevel => {
    if (!user) {
      return 'signup-required';
    }
    
    if (!hasPersonalProfileForChat) {
      return 'profile-required';
    }
    
    return 'full-access';
  }, [user, hasPersonalProfileForChat]);

  // Memoized permission checker
  const checkInteractionPermission = useCallback((action: string): boolean => {
    if (accessLevel === 'full-access') {
      return true;
    }
    
    if (action === 'chat') {
      return false;
    }
    
    return true;
  }, [accessLevel]);

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setBlockingAction('');
  };

  // Memoized coaching unlock capability
  const canUnlockCoaching = useMemo(() => {
    const completed = personalStorage.profileData ? getCompletedRequiredFieldsCount(personalStorage.profileData as ProfileData) : 0;
    const total = getTotalRequiredFieldsCount();
    return completed >= total;
  }, [personalStorage.profileData]);

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
    detailedProgress,
    canUnlockCoaching
  };
};
