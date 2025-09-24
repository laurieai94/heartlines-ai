
import { useProfileStoreV2 } from './useProfileStoreV2';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { profilePreloader } from '@/utils/profilePreloader';

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
  performanceMonitor.mark('partner-profile-data-init');
  
  const {
    profileData,
    isLoading,
    isReady,
    updateField: rawUpdateField,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner');

  // Check session cache first for ultra-fast access
  const cachedData = profilePreloader.getCachedProfileData('partner');
  let mergedProfileData = cachedData;
  
  if (!cachedData) {
    // Merge with default data to ensure all expected fields exist
    mergedProfileData = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;
    
    // Cache for next access if we have data
    if (Object.keys(profileData).length > 0) {
      profilePreloader.cacheProfileData('partner', mergedProfileData, 10 * 60 * 1000);
    }
  }

  // Normalize data types at write time with performance monitoring
  const normalizedUpdateField = (field: keyof PartnerProfileData, value: any) => {
    performanceMonitor.mark(`partner-update-${field}`);
    
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
    
    // Update cache immediately
    const updated = { ...mergedProfileData, [field]: normalizedValue };
    profilePreloader.cacheProfileData('partner', updated, 10 * 60 * 1000);
    
    performanceMonitor.measure(`partner-update-${field}`, 5);
  };

  // Normalize multi-select handling with performance monitoring
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    performanceMonitor.mark(`partner-multiselect-${field}`);
    
    console.log(`[Partner] Multi-select ${field}:`, value);
    rawHandleMultiSelect(field, value);
    
    performanceMonitor.measure(`partner-multiselect-${field}`, 5);
  };

  // Trigger predictive prefetching for related components
  const partnerCompletion = Object.keys(mergedProfileData).filter(key => 
    mergedProfileData[key] && 
    mergedProfileData[key] !== '' && 
    (Array.isArray(mergedProfileData[key]) ? mergedProfileData[key].length > 0 : true)
  ).length;

  if (partnerCompletion > 5) {
    profilePreloader.predictivePrefetch(partnerCompletion * 4, true); // rough completion estimate
  }

  performanceMonitor.measure('partner-profile-data-init', 10);

  return {
    profileData: mergedProfileData,
    isLoading,
    isReady,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveData
  };
};
