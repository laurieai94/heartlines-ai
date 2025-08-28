
import { useUnifiedProfileStorage } from './useUnifiedProfileStorage';

export const usePersonalProfilePersistence = () => {
  // Redirect to unified storage system to prevent conflicts
  console.warn('usePersonalProfilePersistence is deprecated. Use usePersonalProfileData instead.');
  
  const storage = useUnifiedProfileStorage('personal');
  
  return {
    profileData: storage.profileData,
    isLoading: storage.isLoading,
    isReady: storage.isReady,
    saveData: storage.saveData,
    updateField: storage.updateField,
    handleMultiSelect: storage.handleMultiSelect
  };
};
