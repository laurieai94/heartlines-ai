import { useOptimizedPersonalProfileData } from './useOptimizedPersonalProfileData';

// Legacy hook wrapper - maintains exact API compatibility
export const usePersonalProfileData = () => {
  // MIGRATED: Now uses optimized profile storage instead of heavy useProfileStoreV2
  console.log('🚀 usePersonalProfileData migrated to optimized storage');
  return useOptimizedPersonalProfileData();
};