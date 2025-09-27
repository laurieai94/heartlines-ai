
import { useOptimizedProfileCompletion } from './useOptimizedProfileCompletion';

// Legacy hook wrapper - maintains exact API compatibility  
export const useProfileCompletion = () => {
  // MIGRATED: Now uses optimized profile completion instead of heavy useProfileStoreV2
  console.log('🚀 useProfileCompletion migrated to optimized completion');
  return useOptimizedProfileCompletion();
};
