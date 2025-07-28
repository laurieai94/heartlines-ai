import { useEffect } from 'react';
import { PartnerProfileData } from '../types';
import { calculatePartnerProgress } from '../utils/partnerValidation';
import { useUnifiedProfileStorage } from '@/hooks/useUnifiedProfileStorage';

const defaultPartnerProfileData: PartnerProfileData = {
  // Section 1: The Basics
  partnerName: '',
  partnerPronouns: '',
  partnerAge: '',
  partnerOrientation: '',
  partnerGender: [],
  
  // Section 2: How They Operate
  partnerLoveLanguage: [],
  partnerConflictStyle: [],
  partnerCommunicationResponse: [],
  partnerSelfAwareness: '',
  
  // Section 3: Their Foundation
  partnerHeartbreakBetrayal: [],
  partnerFamilyStructure: [],
  partnerAttachmentStyle: ''
};

export const usePartnerProfileData = (onAutoComplete?: () => void) => {
  const {
    profileData,
    isLoading,
    isReady,
    updateField,
    handleMultiSelect,
    saveData
  } = useUnifiedProfileStorage('partner');

  // Auto-completion logic
  useEffect(() => {
    if (isReady && onAutoComplete) {
      const progress = calculatePartnerProgress(profileData as PartnerProfileData);
      if (progress === 100) {
        const timer = setTimeout(() => {
          onAutoComplete();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [profileData, onAutoComplete, isReady]);

  // Merge with default data to ensure all expected fields exist
  const mergedProfileData = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;

  return {
    profileData: mergedProfileData,
    isLoading,
    updateField: updateField as (field: keyof PartnerProfileData, value: any) => void,
    handleMultiSelect: handleMultiSelect as (field: keyof PartnerProfileData, value: string) => void,
    saveProfile: saveData
  };
};