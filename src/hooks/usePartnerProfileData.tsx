
import { useUnifiedProfileStorage } from './useUnifiedProfileStorage';

interface PartnerProfileData {
  [key: string]: any;
}

export const usePartnerProfileData = () => {
  // Use the new unified storage system
  const storage = useUnifiedProfileStorage('partner');

  return {
    profileData: storage.profileData,
    isLoading: storage.isLoading,
    updateField: storage.updateField,
    handleMultiSelect: storage.handleMultiSelect,
    saveData: storage.saveData
  };
};
