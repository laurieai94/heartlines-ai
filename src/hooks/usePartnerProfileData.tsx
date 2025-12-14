
import { useProfileStoreV2 } from './useProfileStoreV2';
import { usePartnerProfiles } from './usePartnerProfiles';
import { safeLog } from '@/utils/safeLogging';

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
  // Get active partner profile ID and virgin status to ensure data isolation
  const { activeProfileId, isVirginProfile, clearVirginStatus } = usePartnerProfiles();
  
  // Check if current profile is virgin (brand new)
  const isVirgin = activeProfileId ? isVirginProfile(activeProfileId) : false;
  
  const {
    profileData,
    isLoading,
    isReady,
    updateField: rawUpdateField,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner', activeProfileId || undefined, isVirgin);

  // Normalize data types at write time
  const normalizedUpdateField = (field: keyof PartnerProfileData, value: any) => {
    // CRITICAL: Clear virgin status on first edit
    if (activeProfileId && isVirgin) {
      console.log('[VirginProfile] First edit - clearing virgin status:', activeProfileId);
      clearVirginStatus(activeProfileId);
    }
    
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
    
    // Safe logging without circular reference risk
    safeLog.fieldUpdate('Partner', field, !!normalizedValue);
    rawUpdateField(field, normalizedValue);
  };

  // Normalize multi-select handling
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    safeLog.multiSelect('Partner', field, 'add', value);
    rawHandleMultiSelect(field, value);
  };

  // Merge with default data to ensure all expected fields exist
  const mergedProfileData = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;

  return {
    profileData: mergedProfileData,
    isLoading,
    isReady,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveData
  };
};
