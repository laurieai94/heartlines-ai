import { useCallback, useMemo } from 'react';
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import { profileCompletionCache } from '@/utils/calculationCache';
import { calculateProgress } from '@/components/NewPersonalQuestionnaire/utils/validation';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';

// Round progress to milestone percentages for cleaner, more premium UX
const roundToMilestone = (progress: number): number => {
  if (progress === 0) return 0;
  if (progress <= 25) return 25;
  if (progress <= 50) return 50;
  if (progress <= 75) return 75;
  return 100;
};

// Streamlined hook for instant completion calculations
export const useOptimizedProfileCompletion = () => {
  const { profileData: personalData, isReady: personalReady } = usePersonalProfileData();
  const { profileData: partnerData, isReady: partnerReady } = usePartnerProfileData();

  // Memoized calculations - only recalculate when data changes
  const calculateYourCompletion = useCallback(() => {
    // Return 0 if data hasn't loaded yet (prevents stale memoization)
    if (!personalReady) {
      return 0;
    }
    
    if (!personalData || Object.keys(personalData).length === 0) {
      return 0;
    }
    
    // Create stable hash using only completion-relevant fields
    const stableData = {
      name: personalData.name,
      pronouns: personalData.pronouns,
      age: personalData.age,
      orientation: personalData.orientation,
      gender: personalData.gender,
      relationshipStatus: personalData.relationshipStatus,
      loveLanguage: personalData.loveLanguage,
      conflictStyle: personalData.conflictStyle,
      communicationResponse: personalData.communicationResponse,
      selfAwareness: personalData.selfAwareness,
      heartbreakBetrayal: personalData.heartbreakBetrayal,
      familyStructure: personalData.familyStructure,
      attachmentStyle: personalData.attachmentStyle
    };
    
    // Use cache for fast lookups with stable data
    const actualProgress = profileCompletionCache.get('personal', stableData, () => {
      return calculateProgress(personalData as any);
    });
    return roundToMilestone(actualProgress);
  }, [personalData, personalReady]);

  const calculatePartnerCompletion = useCallback(() => {
    // Return 0 if data hasn't loaded yet (prevents stale memoization)
    if (!partnerReady) {
      return 0;
    }
    
    if (!partnerData || Object.keys(partnerData).length === 0) {
      return 0;
    }
    
    // Use cache for fast lookups
    const actualProgress = profileCompletionCache.get('partner', partnerData, () => {
      return calculatePartnerProgress(partnerData as any);
    });
    return roundToMilestone(actualProgress);
  }, [partnerData, partnerReady]);

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};