
import { useMemo } from 'react';
import { useProfileStoreV2 } from './useProfileStoreV2';

export interface PartnerProfileData {
  // Section 1: The Basics
  partnerName: string;
  partnerPronouns: string;
  partnerAge: string;
  partnerOrientation: string;
  partnerGender: string[];
  
  // Section 2: How They Operate
  partnerLoveLanguage: string[];
  partnerConflictStyle: string[];
  partnerCommunicationResponse: string[];
  partnerSelfAwareness: string;
  
  // Section 3: Their Foundation
  partnerHeartbreakBetrayal: string[];
  partnerFamilyStructure: string[];
  partnerAttachmentStyle: string;
}

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

export const usePartnerProfileData = () => {
  const {
    profileData,
    isLoading,
    isReady,
    updateField: rawUpdateField,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner');

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

  // EMERGENCY FIX: Avoid circular reference by using simple object cloning
  const mergedProfileData = useMemo(() => {
    if (!profileData || Object.keys(profileData).length === 0) {
      return { ...defaultPartnerProfileData };
    }
    // Create a safe merge without circular references
    const safeData = JSON.parse(JSON.stringify(profileData || {}));
    return { ...defaultPartnerProfileData, ...safeData } as PartnerProfileData;
  }, [profileData]);

  return {
    profileData: mergedProfileData,
    isLoading,
    isReady,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveData
  };
};
