
import { useState, useEffect } from 'react';
import { useProfileFields } from './useProfileFields';
import { useProfileStorage } from './useProfileStorage';

interface PartnerProfileData {
  [key: string]: any;
}

export const usePartnerProfileData = () => {
  const { profileData, setProfileData, loadFromStorage, saveToStorage } = useProfileStorage();
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = loadFromStorage('partner_profile_questionnaire');
        setProfileData(data);
      } catch (error) {
        console.error('Error loading partner profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadFromStorage, setProfileData]);

  // Save data function
  const saveData = async (newData: Partial<PartnerProfileData>) => {
    const updatedData = { ...profileData, ...newData };
    setProfileData(updatedData);
    saveToStorage('partner_profile_questionnaire', updatedData);
  };

  const { updateField, handleMultiSelect } = useProfileFields(profileData, saveData);

  return {
    profileData,
    isLoading,
    updateField,
    handleMultiSelect,
    saveData
  };
};
