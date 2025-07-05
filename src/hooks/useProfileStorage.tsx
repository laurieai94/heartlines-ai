
import { useState, useEffect } from 'react';

interface PersonalProfileData {
  [key: string]: any;
}

export const useProfileStorage = () => {
  const [profileData, setProfileData] = useState<PersonalProfileData>({});

  // Load data from localStorage
  const loadFromStorage = () => {
    try {
      const localData = localStorage.getItem('personal_profile_questionnaire');
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('Loaded personal profile from localStorage:', parsed);
        return parsed || {};
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return {};
  };

  // Save data to localStorage
  const saveToStorage = (data: PersonalProfileData) => {
    try {
      localStorage.setItem('personal_profile_questionnaire', JSON.stringify(data));
      console.log('Saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return {
    profileData,
    setProfileData,
    loadFromStorage,
    saveToStorage
  };
};
