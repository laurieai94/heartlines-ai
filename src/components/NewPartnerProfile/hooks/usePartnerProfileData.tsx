import { useOptimizedPartnerProfileData } from '../../../hooks/useOptimizedPartnerProfileData';

// Legacy hook wrapper - maintains exact API compatibility for NewPartnerProfile
export const usePartnerProfileData = (onAutoComplete?: () => void) => {
  // MIGRATED: Now uses optimized partner profile storage instead of heavy useProfileStoreV2
  console.log('🚀 NewPartnerProfile usePartnerProfileData migrated to optimized storage');
  return useOptimizedPartnerProfileData(onAutoComplete);
};