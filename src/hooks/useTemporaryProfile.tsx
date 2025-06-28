
import { useState, useEffect } from 'react';

interface TemporaryProfileData {
  your: any[];
  partner: any[];
  demographics: {
    your: any;
    partner: any;
  };
}

const TEMP_PROFILE_KEY = 'realtalk_temp_profile';

export const useTemporaryProfile = () => {
  const [tempProfile, setTempProfile] = useState<TemporaryProfileData>({
    your: [],
    partner: [],
    demographics: {
      your: null,
      partner: null
    }
  });

  // Load temporary profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(TEMP_PROFILE_KEY);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setTempProfile(parsedData);
      } catch (error) {
        console.error('Error parsing temporary profile data:', error);
      }
    }
  }, []);

  const saveTemporaryProfile = (newProfile: TemporaryProfileData) => {
    setTempProfile(newProfile);
    localStorage.setItem(TEMP_PROFILE_KEY, JSON.stringify(newProfile));
  };

  const updateTemporaryProfile = (
    profileType: 'your' | 'partner',
    profileData: any,
    demographicsData: any
  ) => {
    const updatedProfile = {
      ...tempProfile,
      [profileType]: profileData ? [profileData] : tempProfile[profileType],
      demographics: {
        ...tempProfile.demographics,
        [profileType]: demographicsData || tempProfile.demographics[profileType]
      }
    };
    saveTemporaryProfile(updatedProfile);
  };

  const clearTemporaryProfile = () => {
    localStorage.removeItem(TEMP_PROFILE_KEY);
    setTempProfile({
      your: [],
      partner: [],
      demographics: {
        your: null,
        partner: null
      }
    });
  };

  const hasTemporaryData = () => {
    return tempProfile.your.length > 0 || 
           tempProfile.partner.length > 0 || 
           tempProfile.demographics.your || 
           tempProfile.demographics.partner;
  };

  return {
    tempProfile,
    saveTemporaryProfile,
    updateTemporaryProfile,
    clearTemporaryProfile,
    hasTemporaryData
  };
};
