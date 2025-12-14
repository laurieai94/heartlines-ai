import { useEffect, useMemo } from 'react';
import { PartnerProfileData } from '../types';
import { calculatePartnerProgress } from '../utils/partnerValidation';
import { useProfileStoreV2 } from '@/hooks/useProfileStoreV2';
import { usePartnerProfiles } from '@/hooks/usePartnerProfiles';
import { safeLog, inspectObject } from '@/utils/safeLogging';
import { profileCompletionCache } from '@/utils/calculationCache';

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

export const usePartnerProfileData = (onAutoComplete?: () => void, explicitProfileId?: string | null) => {
  // Get active partner profile ID and virgin status to ensure data isolation
  const { activeProfileId, isVirginProfile, clearVirginStatus } = usePartnerProfiles();
  
  // Use explicit ID if provided (prevents race conditions), otherwise fall back to activeProfileId
  const effectiveProfileId = explicitProfileId || activeProfileId;
  
  // Check if current profile is virgin (brand new)
  const isVirgin = effectiveProfileId ? isVirginProfile(effectiveProfileId) : false;
  
  const {
    profileData,
    isLoading,
    isReady,
    isSyncing,
    updateField: rawUpdateField,
    updateFieldImmediate: rawUpdateFieldImmediate,
    handleMultiSelect: rawHandleMultiSelect,
    saveData
  } = useProfileStoreV2('partner', effectiveProfileId || undefined, isVirgin);

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
    // CRITICAL: Clear virgin status on first edit
    if (effectiveProfileId && isVirgin) {
      console.log('[VirginProfile] First edit - clearing virgin status:', effectiveProfileId);
      clearVirginStatus(effectiveProfileId);
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
    
    // Optimistic UI update for partner name - immediate display in profile list
    if (field === 'partnerName' && effectiveProfileId) {
      window.dispatchEvent(new CustomEvent('partner:nameUpdate', {
        detail: { profileId: effectiveProfileId, name: normalizedValue || 'New Partner' }
      }));
    }
    
    // Clear validation cache when required fields change
    const requiredFields: (keyof PartnerProfileData)[] = [
      'partnerName', 'partnerPronouns', 'partnerLoveLanguage', 'partnerAttachmentStyle'
    ];
    
    if (requiredFields.includes(field)) {
      profileCompletionCache.clear();
      // Notify listeners that a required field was updated
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated', { 
        detail: { profileType: 'partner', field } 
      }));
    }
    
    // Safe logging without circular reference risk
    safeLog.fieldUpdate('Partner', field, !!normalizedValue);
    rawUpdateField(field, normalizedValue);
  };

  // Normalize multi-select handling with safe logging
  const normalizedHandleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    const current = profileData?.[field];
    const isRemoving = Array.isArray(current) && current.includes(value);
    safeLog.multiSelect('Partner', field, isRemoving ? 'remove' : 'add', value);
    rawHandleMultiSelect(field, value);
  };

  // Optimized merge with useMemo to prevent unnecessary re-renders
  const mergedProfileData = useMemo(() => {
    const merged = { ...defaultPartnerProfileData, ...profileData } as PartnerProfileData;
    // Safe inspection without circular reference risk
    inspectObject(merged, '[Partner] Data merged');
    return merged;
  }, [profileData]);

  return {
    profileData: mergedProfileData,
    isLoading,
    isReady,
    isSyncing,
    updateField: normalizedUpdateField,
    updateFieldImmediate: rawUpdateFieldImmediate,
    handleMultiSelect: normalizedHandleMultiSelect,
    saveProfile: saveData
  };
};