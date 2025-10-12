import { useCallback, useMemo } from 'react';
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import { profileCompletionCache } from '@/utils/calculationCache';
import { calculateProgress } from '@/components/NewPersonalQuestionnaire/utils/validation';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';

// Streamlined hook for instant completion calculations
export const useOptimizedProfileCompletion = () => {
  const { profileData: personalData } = usePersonalProfileData();
  const { profileData: partnerData } = usePartnerProfileData();

  // Memoized calculations - only recalculate when data changes
  const calculateYourCompletion = useCallback(() => {
    if (!personalData || Object.keys(personalData).length === 0) {
      return 0;
    }
    
    // Use cache for fast lookups
    return profileCompletionCache.get('personal', personalData, () => {
      return calculateProgress(personalData as any);
    });
  }, [personalData]);

  const calculatePartnerCompletion = useCallback(() => {
    if (!partnerData || Object.keys(partnerData).length === 0) {
      return 0;
    }
    
    // Use cache for fast lookups
    return profileCompletionCache.get('partner', partnerData, () => {
      return calculatePartnerProgress(partnerData as any);
    });
  }, [partnerData]);

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};