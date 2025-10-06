import { useMemo, useRef } from 'react';
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import { profileCompletionCache } from '@/utils/calculationCache';
import { calculateProgress } from '@/components/NewPersonalQuestionnaire/utils/validation';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';

// Optimized hook that caches expensive completion calculations
export const useOptimizedProfileCompletion = () => {
  const { profileData: personalData, isReady: personalReady } = usePersonalProfileData();
  const { profileData: partnerData, isReady: partnerReady } = usePartnerProfileData();
  
  // Track last known completion to prevent temporary drops to 0%
  const lastKnownCompletion = useRef<{ personal: number; partner: number }>({
    personal: 0,
    partner: 0
  });

  const calculateYourCompletion = () => {
    // Return last known completion if data isn't ready yet (optimistic update)
    if (!personalReady || !personalData || Object.keys(personalData).length === 0) {
      return lastKnownCompletion.current.personal;
    }
    
    const completion = profileCompletionCache.get('personal', personalData, () => {
      return calculateProgress(personalData as any);
    });
    
    // Update last known completion
    lastKnownCompletion.current.personal = completion;
    return completion;
  };

  const calculatePartnerCompletion = () => {
    // Return last known completion if data isn't ready yet (optimistic update)
    if (!partnerReady || !partnerData || Object.keys(partnerData).length === 0) {
      return lastKnownCompletion.current.partner;
    }
    
    const completion = profileCompletionCache.get('partner', partnerData, () => {
      return calculatePartnerProgress(partnerData as any);
    });
    
    // Update last known completion
    lastKnownCompletion.current.partner = completion;
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};