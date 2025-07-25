import { useState, useEffect } from 'react';
import { useProfileFields } from '@/hooks/useProfileFields';
import { PartnerProfileData } from '../types';

export const usePartnerProfileData = (autoCompleteCallback?: () => void) => {
  const [profileData, setProfileData] = useState<PartnerProfileData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  const loadFromStorage = () => {
    try {
      const localData = localStorage.getItem('new_partner_profile_questionnaire');
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('Loaded new partner profile from localStorage:', parsed);
        return parsed || {};
      }
    } catch (error) {
      console.error('Error loading new partner profile from localStorage:', error);
    }
    return {};
  };

  // Save data to localStorage
  const saveToStorage = (data: PartnerProfileData) => {
    try {
      localStorage.setItem('new_partner_profile_questionnaire', JSON.stringify(data));
      console.log('Saved new partner profile to localStorage successfully');
    } catch (error) {
      console.error('Error saving new partner profile to localStorage:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = loadFromStorage();
        setProfileData(data);
      } catch (error) {
        console.error('Error loading new partner profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data function
  const saveData = async (newData: Partial<PartnerProfileData>) => {
    const updatedData = { ...profileData, ...newData };
    setProfileData(updatedData);
    saveToStorage(updatedData);
  };

  // Save profile function for completion
  const saveProfile = async () => {
    saveToStorage(profileData);
    return profileData;
  };

  const { updateField, handleMultiSelect } = useProfileFields(profileData, saveData);

  return {
    profileData,
    isLoading,
    updateField,
    handleMultiSelect,
    saveData,
    saveProfile
  };
};