
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "./usePersonalProfileData";
import { usePartnerProfileData } from "./usePartnerProfileData";
import { calculateProgressOptimized, validateSectionOptimized } from "@/components/NewPersonalQuestionnaire/utils/optimizedValidation";
import { getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from "@/components/NewPersonalQuestionnaire/utils/requirements";
import { getTotalPartnerRequiredFieldsCount, getCompletedPartnerRequiredFieldsCount, isPartnerProfileComplete } from "@/components/NewPartnerProfile/utils/partnerRequirements";
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
  const partnerStorage = usePartnerProfileData();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [blockingAction, setBlockingAction] = useState<string>('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'limit-reached' | 'near-limit' | 'upgrade'>('upgrade');
  const [profileUpdateCounter, setProfileUpdateCounter] = useState(0);

  // Listen for profile required field updates to force re-calculation
  useEffect(() => {
    const handleProfileUpdate = () => {
      // SAFETY: Ignore events if questionnaire is completing
      const isCompleting = sessionStorage.getItem('questionnaire-completing');
      if (isCompleting) {
        console.log('[useProgressiveAccess] Ignoring update - questionnaire completing');
        return;
      }
      
      console.log('[useProgressiveAccess] Profile update event - forcing recalculation');
      setProfileUpdateCounter(prev => prev + 1);
      
      // Force React to process this state update immediately
      setTimeout(() => {
        setProfileUpdateCounter(prev => prev + 1);
      }, 0);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    };
  }, []);

  // Memoized profile completion calculation
  const profileCompletion = useMemo(() => {
    if (!personalStorage.profileData || Object.keys(personalStorage.profileData).length === 0) {
      return 0;
    }
    // Force bypass cache when profileUpdateCounter changes to ensure fresh data
    const skipCache = profileUpdateCounter > 0;
    const result = calculateProgressOptimized(personalStorage.profileData as ProfileData, skipCache);
    console.log('[useProgressiveAccess] Profile completion:', result, 'skipCache:', skipCache);
    return result;
  }, [personalStorage.profileData, profileUpdateCounter]);

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
  }, [personalStorage.profileData, profileUpdateCounter]);

  const hasPersonalProfileForChat = chatReadiness.isComplete;
  const missingFieldsForChat = chatReadiness.missingFields;
  const incompleteSections = chatReadiness.incompleteSections;
  const detailedProgress = chatReadiness.overallProgress;
  
  // Track last known access level to prevent flickering
  const lastAccessLevelRef = useRef<AccessLevel>('signup-required');
  
  // Memoized access level calculation
  const accessLevel = useMemo((): AccessLevel => {
    if (!user) {
      console.log('[Access] No user - signup required');
      lastAccessLevelRef.current = 'signup-required';
      return 'signup-required';
    }
    
    if (!hasPersonalProfileForChat) {
      console.log('[Access] Profile incomplete - profile required', {
        hasPersonalProfileForChat,
        missingFields: missingFieldsForChat,
        profileData: personalStorage.profileData
      });
      lastAccessLevelRef.current = 'profile-required';
      return 'profile-required';
    }
    
    console.log('[Access] Full access granted');
    lastAccessLevelRef.current = 'full-access';
    return 'full-access';
  }, [user, hasPersonalProfileForChat, missingFieldsForChat, personalStorage.profileData]);

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

  const openUpgradeModal = useCallback((reason: 'limit-reached' | 'near-limit' | 'upgrade' = 'upgrade') => {
    setUpgradeReason(reason);
    setShowUpgradeModal(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  // Memoized coaching unlock capability
  const canUnlockCoaching = useMemo(() => {
    const completed = personalStorage.profileData ? getCompletedRequiredFieldsCount(personalStorage.profileData as ProfileData) : 0;
    const total = getTotalRequiredFieldsCount();
    console.log('[useProgressiveAccess] Coaching unlock check:', { 
      completed, 
      total, 
      canUnlock: completed >= total,
      profileData: personalStorage.profileData 
    });
    return completed >= total;
  }, [
    personalStorage.profileData?.name,
    personalStorage.profileData?.pronouns,
    personalStorage.profileData?.relationshipStatus,
    personalStorage.profileData?.loveLanguage,
    personalStorage.profileData?.attachmentStyle,
    (personalStorage.profileData as any)?._updateTimestamp,
    personalStorage.profileData,
    personalStorage.isReady,
    profileUpdateCounter
  ]);

  // Memoized partner coaching unlock capability
  const canUnlockPartnerCoaching = useMemo(() => {
    return partnerStorage.profileData ? isPartnerProfileComplete(partnerStorage.profileData) : false;
  }, [partnerStorage.profileData]);

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
    canUnlockCoaching,
    canUnlockPartnerCoaching,
    showUpgradeModal,
    upgradeReason,
    openUpgradeModal,
    closeUpgradeModal
  };
};
