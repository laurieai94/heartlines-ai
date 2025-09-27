import { useEffect, useMemo } from 'react';
import { useOptimizedProfileStore, PartnerProfileOptimized } from './useOptimizedProfileStore';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';
import { PartnerProfileData } from '@/components/NewPartnerProfile/types';

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

export const useOptimizedPartnerProfileData = (onAutoComplete?: () => void) => {
  const store = useOptimizedProfileStore('partner');
  
  // Type-safe profile data casting
  const partnerData = store.profileData as PartnerProfileOptimized;

  // Auto-completion logic
  useEffect(() => {
    if (store.isReady && onAutoComplete) {
      const progress = calculatePartnerProgress(partnerData as any);
      if (progress === 100) {
        const timer = setTimeout(() => {
          onAutoComplete();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [partnerData, onAutoComplete, store.isReady]);

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
    store.updateField(field, normalizedValue);
  };

  // Normalize multi-select handling with enhanced logging
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    console.log(`[Partner] Multi-select attempt ${field}:`, value, 'current:', partnerData?.[field]);
    store.handleMultiSelect(field, value);
  };

  // Optimized merge with useMemo to prevent unnecessary re-renders
  const mergedProfileData = useMemo(() => {
    const merged = { ...defaultPartnerProfileData, ...partnerData } as PartnerProfileData;
    console.log('[Partner] Data merge:', { partnerData, merged });
    return merged;
  }, [partnerData]);

  return {
    profileData: mergedProfileData,
    isLoading: store.isLoading,
    isReady: store.isReady,
    isSyncing: store.isSyncing,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveProfile: store.saveData
  };
};