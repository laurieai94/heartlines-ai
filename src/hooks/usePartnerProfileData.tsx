
import { useProfileStoreV2 } from './useProfileStoreV2';

interface PartnerProfileData {
  [key: string]: any;
}

export const usePartnerProfileData = () => {
  // Use the new V2 storage system
  const storage = useProfileStoreV2('partner');

  return {
    profileData: storage.profileData,
    isLoading: storage.isLoading,
    updateField: storage.updateField,
    handleMultiSelect: storage.handleMultiSelect,
    saveData: storage.saveData
  };
};
