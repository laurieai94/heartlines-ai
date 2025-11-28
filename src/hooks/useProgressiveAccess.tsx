
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalProfileData } from "./usePersonalProfileData";
import { usePartnerProfileData } from "./usePartnerProfileData";
import { calculateProgressOptimized, validateSectionOptimized } from "@/components/NewPersonalQuestionnaire/utils/optimizedValidation";
import { getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from "@/components/NewPersonalQuestionnaire/utils/requirements";
import { getTotalPartnerRequiredFieldsCount, getCompletedPartnerRequiredFieldsCount, isPartnerProfileComplete } from "@/components/NewPartnerProfile/utils/partnerRequirements";
import type { ProfileData } from "@/components/NewPersonalQuestionnaire/types";
import { batchedStorage } from "@/utils/batchedStorage";

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

  // IMMEDIATE profile update listener for real-time responsiveness
  useEffect(() => {
    const handleProfileUpdate = () => {
      // SAFETY: Ignore events if questionnaire is completing
      const isCompleting = sessionStorage.getItem('questionnaire-completing');
      if (isCompleting) return;
      
      console.log('[ProgressiveAccess] Profile update event received - invalidating caches');
      
      // CRITICAL: Clear all validation caches before incrementing counter
      if (typeof (window as any).__clearValidationCache === 'function') {
        (window as any).__clearValidationCache();
      }
      
      // IMMEDIATE UPDATE: No throttle/debounce for instant responsiveness
      setProfileUpdateCounter(prev => {
        console.log('[ProgressiveAccess] Incrementing profileUpdateCounter:', prev + 1);
        return prev + 1;
      });
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    };
  }, []);

  // Force immediate update bypassing throttle - for navigation events
  const forceAccessLevelUpdate = useCallback(() => {
    setProfileUpdateCounter(prev => prev + 1);
  }, []);

  // Listen for tab changes to force immediate recalculation
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tab === 'insights') {
        // Force immediate recalculation when navigating to coach
        forceAccessLevelUpdate();
      }
    };
    
    window.addEventListener('dashboard:tabChange', handleTabChange);
    return () => window.removeEventListener('dashboard:tabChange', handleTabChange);
  }, [forceAccessLevelUpdate]);

  // Memoized profile completion calculation
  const profileCompletion = useMemo(() => {
    if (!personalStorage.profileData || Object.keys(personalStorage.profileData).length === 0) {
      return 0;
    }
    const skipCache = profileUpdateCounter > 0;
    return calculateProgressOptimized(personalStorage.profileData as ProfileData, skipCache);
  }, [personalStorage.profileData, profileUpdateCounter]);

  // Memoized chat readiness computation
  const chatReadiness = useMemo(() => {
    console.log('[ProgressiveAccess] Recalculating chatReadiness, profileUpdateCounter:', profileUpdateCounter);
    
    // CRITICAL FIX: Wait for profile data to fully load before checking completion
    if (!personalStorage.isReady) {
      console.log('[ProgressiveAccess] Profile data not ready yet, returning incomplete status');
      return { 
        isComplete: false, 
        missingFields: ['Loading profile...'],
        incompleteSections: [],
        overallProgress: 0
      };
    }
    
    // CRITICAL FIX: Read directly from localStorage for freshest data
    let profileData: ProfileData;
    try {
      if (!user?.id) {
        console.log('[ProgressiveAccess] No user ID, using hook data');
        profileData = personalStorage.profileData as ProfileData;
      } else {
        const userStorageKey = `personal_profile_v2_${user.id}`;
        console.log('[ProgressiveAccess] Reading from batchedStorage key:', userStorageKey);
        const stored = batchedStorage.getItem(userStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          profileData = parsed.profile || personalStorage.profileData;
          console.log('[ProgressiveAccess] Loaded profile from localStorage:', {
            name: profileData.name,
            pronouns: profileData.pronouns,
            relationshipStatus: profileData.relationshipStatus,
            loveLanguage: profileData.loveLanguage,
            attachmentStyle: profileData.attachmentStyle
          });
        } else {
          console.log('[ProgressiveAccess] No localStorage data found, using hook data');
          profileData = personalStorage.profileData as ProfileData;
        }
      }
    } catch (e) {
      console.error('[ProgressiveAccess] Error reading from localStorage:', e);
      profileData = personalStorage.profileData as ProfileData;
    }
    
    if (!profileData || Object.keys(profileData).length === 0) {
      console.log('[ProgressiveAccess] No profile data found');
      return { 
        isComplete: false, 
        missingFields: ['Please complete your profile'],
        incompleteSections: [1, 2, 3, 4],
        overallProgress: 0
      };
    }

    // DEBUG: Log all required field values for troubleshooting
    console.log('[ProgressiveAccess] Checking required fields:', {
      name: profileData.name,
      pronouns: profileData.pronouns,
      relationshipStatus: profileData.relationshipStatus,
      loveLanguage: profileData.loveLanguage,
      loveLanguageType: Array.isArray(profileData.loveLanguage) ? 'array' : typeof profileData.loveLanguage,
      attachmentStyle: profileData.attachmentStyle
    });

    // Use optimized validation
    const totalRequired = getTotalRequiredFieldsCount();
    const totalCompleted = getCompletedRequiredFieldsCount(profileData);
    const overallProgress = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
    const isComplete = overallProgress === 100;
    
    console.log('[ProgressiveAccess] Completion status:', {
      totalRequired,
      totalCompleted,
      overallProgress,
      isComplete
    });

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

    console.log('[ProgressiveAccess] Final chatReadiness result:', {
      isComplete,
      missingFieldsCount: missingFields.length,
      incompleteSectionsCount: incompleteSections.length,
      overallProgress
    });
    
    return { 
      isComplete, 
      missingFields, 
      incompleteSections,
      overallProgress
    };
  }, [user?.id, personalStorage.profileData, profileUpdateCounter, personalStorage.isReady]);

  const hasPersonalProfileForChat = chatReadiness.isComplete;
  const missingFieldsForChat = chatReadiness.missingFields;
  const incompleteSections = chatReadiness.incompleteSections;
  const detailedProgress = chatReadiness.overallProgress;
  
  // Track last known access level to prevent flickering
  const lastAccessLevelRef = useRef<AccessLevel>('signup-required');
  
  // Memoized access level calculation
  const accessLevel = useMemo((): AccessLevel => {
    if (!user) {
      lastAccessLevelRef.current = 'signup-required';
      return 'signup-required';
    }
    
    // CRITICAL FIX: Wait for profile data to fully load before checking completion
    // This prevents false "profile incomplete" lockouts during data loading
    // Check both isReady AND isLoading - if actively loading, wait
    if (!personalStorage.isReady || personalStorage.isLoading) {
      console.log('[ProgressiveAccess] Profile data loading, returning last known access level');
      // Return last known access level to prevent flickering during load
      return lastAccessLevelRef.current;
    }
    
    if (!hasPersonalProfileForChat) {
      lastAccessLevelRef.current = 'profile-required';
      return 'profile-required';
    }
    
    lastAccessLevelRef.current = 'full-access';
    return 'full-access';
  }, [user, hasPersonalProfileForChat, missingFieldsForChat, personalStorage.profileData, personalStorage.isReady, personalStorage.isLoading]);

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
