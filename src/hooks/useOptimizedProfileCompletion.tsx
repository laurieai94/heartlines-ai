import { useMemo } from 'react';
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import { profileCompletionCache } from '@/utils/calculationCache';
import { calculateProgress } from '@/components/NewPersonalQuestionnaire/utils/validation';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';

// Optimized hook that caches expensive completion calculations
export const useOptimizedProfileCompletion = () => {
  const { profileData: personalData, isReady: personalReady } = usePersonalProfileData();
  const { profileData: partnerData, isReady: partnerReady } = usePartnerProfileData();

  const calculateYourCompletion = useMemo(() => {
    if (!personalReady || !personalData || Object.keys(personalData).length === 0) {
      return 0;
    }
    
    return profileCompletionCache.get('personal', personalData, () => {
      return calculateProgress(personalData as any);
    });
  }, [personalReady, personalData]);

  const calculatePartnerCompletion = useMemo(() => {
    if (!partnerReady || !partnerData || Object.keys(partnerData).length === 0) {
      return 0;
    }
    
    return profileCompletionCache.get('partner', partnerData, () => {
      return calculatePartnerProgress(partnerData as any);
    });
  }, [partnerReady, partnerData]);

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};