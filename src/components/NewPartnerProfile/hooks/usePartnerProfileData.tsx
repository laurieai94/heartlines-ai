import { useEffect } from 'react';
import { PartnerProfileData } from '../types';
import { calculatePartnerProgress } from '../utils/partnerValidation';
import { useProfileStoreV2 } from '@/hooks/useProfileStoreV2';

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
    updateField: rawUpdateField,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner');

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

  // Normalize data types at write time
  const normalizedUpdateField = (field: keyof PartnerProfileData, value: any) => {
    let normalizedValue = value;
    
    // Ensure correct data types for specific fields
    const arrayFields: (keyof PartnerProfileData)[] = [
      'partnerGender', 'partnerLoveLanguage', 'partnerConflictStyle', 
      'partnerCommunicationResponse', 'partnerHeartbreakBetrayal', 'partnerFamilyStructure'
    ];
    
    const stringFields: (keyof PartnerProfileData)[] = [
      'partnerName', 'partnerPronouns', 'partnerAge', 'partnerOrientation', 
      'partnerSelfAwareness', 'partnerAttachmentStyle'
    ];
    
    if (arrayFields.includes(field)) {
      normalizedValue = Array.isArray(value) ? value : (value ? [value] : []);
    } else if (stringFields.includes(field)) {
      normalizedValue = Array.isArray(value) ? (value[0] || '') : (value || '');
    }
    
    console.log(`[Partner] Normalized ${field}:`, value, '->', normalizedValue);
    rawUpdateField(field, normalizedValue);
  };

  // Normalize multi-select handling
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    console.log(`[Partner] Multi-select ${field}:`, value);
    rawHandleMultiSelect(field, value);
  };

  // Merge with default data to ensure all expected fields exist
  const mergedProfileData = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;

  return {
    profileData: mergedProfileData,
    isLoading,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveProfile: saveData
  };
};