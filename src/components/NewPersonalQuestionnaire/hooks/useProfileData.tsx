
import { useEffect } from 'react';
import { ProfileData } from '../types';
import { calculateProgress } from '../utils/validation';
import { useUnifiedProfileStorage } from '@/hooks/useUnifiedProfileStorage';

const defaultProfileData: ProfileData = {
  // Section 1: The Basics
  name: '',
  age: '',
  gender: '',
  orientation: '',
  pronouns: '',
  
  // Section 2: Your Relationship
  relationshipStatus: '',
  relationshipLength: '',
  talkingDuration: '',
  talkingDescription: [],
  talkingChallenges: [],
  relationshipChallenges: [],
  relationshipWorking: [],
  datingChallenges: [],
  
    // Separated/Divorced specific fields
    separationSituation: [],
    datingReadiness: [],
    
    // Widowed specific fields
    timeSinceLoss: '',
    grievingProcess: [],
  
  // Section 3: How You Operate
  stressResponse: [],
  conflictStyle: [],
  loveLanguage: [],
  
  // Section 4: Your Foundation
  heartbreakBetrayal: [],
  familyStructure: [],
  attachmentStyle: ''
};

export const useProfileData = (onAutoComplete?: () => void) => {
  const {
    profileData,
    isLoading,
    isReady,
    updateField,
    handleMultiSelect,
    saveData
  } = useUnifiedProfileStorage('personal');

  // Auto-completion detection
  useEffect(() => {
    if (isReady && onAutoComplete) {
      const progress = calculateProgress(profileData as ProfileData);
      
      if (progress === 100) {
        // Add a small delay for smooth transition
        setTimeout(() => {
          onAutoComplete();
        }, 1500);
      }
    }
  }, [profileData, isReady, onAutoComplete]);

  // Merge with default data to ensure all expected fields exist
  const mergedProfileData = { ...defaultProfileData, ...profileData } as ProfileData;

  return {
    profileData: mergedProfileData,
    updateField: updateField as (field: keyof ProfileData, value: any) => void,
    handleMultiSelect: handleMultiSelect as (field: keyof ProfileData, value: string) => void,
    isLoading,
    saveProfile: saveData
  };
};
