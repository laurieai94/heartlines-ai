import { useEffect, useMemo } from 'react';
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
    isSyncing,
    updateField: rawUpdateField,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner');

  // EMERGENCY FIX: Debounced auto-completion to prevent excessive calls
  useEffect(() => {
    if (!isReady || !onAutoComplete) return;
    
    const timer = setTimeout(() => {
      try {
        const progress = calculatePartnerProgress(profileData as PartnerProfileData);
        if (progress === 100) {
          onAutoComplete();
        }
      } catch (error) {
        console.error('[Partner] Auto-completion error:', error);
      }
    }, 2000); // Debounce auto-completion
    
    return () => clearTimeout(timer);
  }, [isReady, onAutoComplete]); // Removed profileData dependency

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

  // Normalize multi-select handling with enhanced logging
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    console.log(`[Partner] Multi-select attempt ${field}:`, value, 'current:', profileData?.[field]);
    rawHandleMultiSelect(field, value);
  };

  // EMERGENCY FIX: Safe merge to prevent circular references and infinite re-renders
  const mergedProfileData = useMemo(() => {
    if (!profileData || Object.keys(profileData).length === 0) {
      return { ...defaultPartnerProfileData };
    }
    // Deep clone to break any circular references
    try {
      const safeData = JSON.parse(JSON.stringify(profileData || {}));
      const merged = { ...defaultPartnerProfileData, ...safeData } as PartnerProfileData;
      return merged;
    } catch (error) {
      console.error('[Partner] Data merge error:', error);
      return { ...defaultPartnerProfileData };
    }
  }, [profileData]);

  return {
    profileData: mergedProfileData,
    isLoading,
    isReady,
    isSyncing,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveProfile: saveData
  };
};