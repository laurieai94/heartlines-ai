import { useMemo, useState, useEffect } from 'react';
import { useProfileStoreV2 } from './useProfileStoreV2';
import { ProfileData } from '../components/new-personal-questionnaire/types';

// Extended interface to support both old and new field names
interface ExtendedProfileData extends ProfileData {
  // Legacy field names for backward compatibility
  avatar_url?: string;
  sexualOrientation?: string[];
  genderIdentity?: string[];
  [key: string]: any;
}

export const usePersonalProfileData = () => {
  // Use the new V2 storage system
  const v2Store = useProfileStoreV2('personal');
  
  // Track profile updates to force re-memoization
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Field name normalization mappings
  const FIELD_NORMALIZATIONS: Record<string, string> = {
    'sexualOrientation': 'orientation',
    'genderIdentity': 'gender',
    'relationshipWorkingWell': 'relationshipWorking',
    'conflictNeeds': 'conflictStyle',
    'feelLovedWhen': 'loveLanguage',
    'stressReactions': 'stressResponse'
  };

  // Normalize field name when writing
  const normalizeFieldName = (field: string): string => {
    return FIELD_NORMALIZATIONS[field] || field;
  };

  // Memoize default values to ensure stable reference
  const defaultProfileData: ExtendedProfileData = useMemo(() => ({
    name: '',
    age: '',
    gender: [],
    orientation: [],
    pronouns: '',
    relationshipStatus: '',
    relationshipLength: '',
    talkingDuration: '',
    talkingDescription: [],
    talkingChallenges: [],
    relationshipChallenges: [],
    relationshipWorking: [],
    datingChallenges: [],
    separationSituation: [],
    datingReadiness: [],
    timeSinceLoss: '',
    grievingProcess: [],
    stressResponse: [],
    conflictStyle: [],
    loveLanguage: [],
    heartbreakBetrayal: [],
    familyStructure: [],
    attachmentStyle: ''
  }), []);

  // Listen for profile updates to force re-memoization
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Force memoization to recalculate by incrementing trigger
      setUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    };
  }, []);

  // Memoize merged data to provide stable reference that only changes when actual data changes
  const mergedProfileData = useMemo(() => {
    return { ...defaultProfileData, ...v2Store.profileData } as ExtendedProfileData;
  }, [v2Store.profileData, defaultProfileData, updateTrigger]);

  // Wrap updateField to normalize field names with immediate updates for required fields
  const normalizedUpdateField = (field: string, value: any) => {
    const normalizedField = normalizeFieldName(field);
    
    // List of required fields that need instant updates
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    
    // Invalidate caches BEFORE updating for immediate responsiveness
    if (requiredFields.includes(normalizedField)) {
      try {
        const { profileCompletionCache, validationCache, requirementCache } = require('@/utils/calculationCache');
        profileCompletionCache?.clear();
        validationCache?.clear();
        requirementCache?.clear();
      } catch (e) {
        // Cache modules not ready yet
      }
      
      // Use immediate update for required fields (no debounce)
      // Event will be dispatched by useProfileStoreV2 after render completes
      v2Store.updateFieldImmediate(normalizedField, value);
    } else {
      // Use debounced update for optional fields
      v2Store.updateField(normalizedField, value);
    }
  };

  // Wrap handleMultiSelect to normalize field names (removed excessive logging)
  const normalizedHandleMultiSelect = (field: string, value: string) => {
    const normalizedField = normalizeFieldName(field);
    v2Store.handleMultiSelect(normalizedField, value);
  };

  return {
    profileData: mergedProfileData,
    isLoading: v2Store.isLoading,
    isReady: v2Store.isReady,
    isSyncing: v2Store.isSyncing,
    lastSaved: v2Store.lastSaved,
    saveData: v2Store.saveData,
    updateField: normalizedUpdateField,
    updateFieldImmediate: v2Store.updateFieldImmediate,
    handleMultiSelect: normalizedHandleMultiSelect,
    flush: v2Store.flush
  };
};