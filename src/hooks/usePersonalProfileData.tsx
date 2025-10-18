import { useProfileStoreV2 } from './useProfileStoreV2';
import { ProfileData } from '../components/NewPersonalQuestionnaire/types';

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

  // Create default values to ensure all required fields are present
  const defaultProfileData: ExtendedProfileData = {
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
  };

  // Merge with defaults to ensure all fields exist
  const mergedProfileData = { ...defaultProfileData, ...v2Store.profileData } as ExtendedProfileData;

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
      v2Store.updateFieldImmediate(normalizedField, value);
      
      // Force immediate event dispatch for UI updates
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
      
      // Secondary dispatch to ensure React picks up the change
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
      }, 0);
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

  // Wrap updateFieldImmediate to normalize field names and dispatch events
  const normalizedUpdateFieldImmediate = (field: string, value: any) => {
    const normalizedField = normalizeFieldName(field);
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    
    if (requiredFields.includes(normalizedField)) {
      // Clear caches for immediate responsiveness
      try {
        const { profileCompletionCache, validationCache, requirementCache } = require('@/utils/calculationCache');
        profileCompletionCache?.clear();
        validationCache?.clear();
        requirementCache?.clear();
      } catch (e) {
        // Cache modules not ready yet
      }
      
      // Update store
      v2Store.updateFieldImmediate(normalizedField, value);
      
      // Dispatch events for UI updates
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
      }, 0);
    } else {
      v2Store.updateFieldImmediate(normalizedField, value);
    }
  };

  return {
    profileData: mergedProfileData,
    isLoading: v2Store.isLoading,
    isReady: v2Store.isReady,
    isSyncing: v2Store.isSyncing,
    lastSaved: v2Store.lastSaved,
    saveData: v2Store.saveData,
    updateField: normalizedUpdateField,
    updateFieldImmediate: normalizedUpdateFieldImmediate,
    handleMultiSelect: normalizedHandleMultiSelect,
    flush: v2Store.flush
  };
};