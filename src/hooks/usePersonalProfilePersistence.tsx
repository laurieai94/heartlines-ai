
import { usePersonalProfileData } from './usePersonalProfileData';

export const usePersonalProfilePersistence = () => {
  // Redirect to new V2 storage system to prevent conflicts
  console.warn('usePersonalProfilePersistence is deprecated. Use usePersonalProfileData instead.');
  
  const storage = usePersonalProfileData();
  
  return {
    profileData: storage.profileData,
    isLoading: storage.isLoading,
    isReady: storage.isReady,
    saveData: storage.saveData,
    updateField: storage.updateField,
    handleMultiSelect: storage.handleMultiSelect
  };
};
