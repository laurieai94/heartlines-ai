import { useEffect, useMemo } from 'react';
import { PartnerProfileData } from '../types';
import { calculatePartnerProgress } from '../utils/partnerValidation';
import { useProfileStoreV2 } from '@/hooks/useProfileStoreV2';
import { optimizedLogger } from '@/utils/optimizedLogger';

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
    
    optimizedLogger.debug(`[Partner] Normalized ${field}:`, value, '->', normalizedValue);
    rawUpdateField(field, normalizedValue);
  };

  // Normalize multi-select handling with enhanced logging
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    optimizedLogger.debug(`[Partner] Multi-select attempt ${field}:`, value, 'current:', profileData?.[field]);
    rawHandleMultiSelect(field, value);
  };

  // Optimized merge with useMemo to prevent unnecessary re-renders
  const mergedProfileData = useMemo(() => {
    const merged = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;
    optimizedLogger.debug('[Partner] Data merge:', { profileData, merged });
    return merged;
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