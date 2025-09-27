import { useOptimizedPartnerProfileData } from './useOptimizedPartnerProfileData';

// Legacy hook wrapper - maintains exact API compatibility for all partner profile hooks
export const usePartnerProfileData = (onAutoComplete?: () => void) => {
  // MIGRATED: Now uses optimized partner profile storage instead of heavy useProfileStoreV2
  console.log('🚀 usePartnerProfileData migrated to optimized storage');
  return useOptimizedPartnerProfileData(onAutoComplete);
};