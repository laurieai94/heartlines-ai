
import { useState, useEffect } from 'react';
import { batchedStorage } from '@/utils/batchedStorage';

interface PersonalProfileData {
  [key: string]: any;
}

export const useProfileStorage = () => {
  const [profileData, setProfileData] = useState<PersonalProfileData>({});

  // Load data from localStorage
  const loadFromStorage = () => {
    try {
      const localData = batchedStorage.getItem('personal_profile_questionnaire');
      if (localData) {
        const parsed = JSON.parse(localData);
        return parsed || {};
      }
    } catch (error) {
      // Silent fail
    }
    return {};
  };

  // Save data to localStorage
  const saveToStorage = (data: PersonalProfileData) => {
    try {
      batchedStorage.setItem('personal_profile_questionnaire', JSON.stringify(data));
    } catch (error) {
      // Silent fail
    }
  };

  return {
    profileData,
    setProfileData,
    loadFromStorage,
    saveToStorage
  };
};
