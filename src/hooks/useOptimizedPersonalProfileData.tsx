import { useOptimizedProfileStore, PersonalProfileOptimized } from './useOptimizedProfileStore';

// Extended interface to support both old and new field names
interface ExtendedPersonalProfileData extends PersonalProfileOptimized {
  // Legacy field names for backward compatibility
  avatar_url?: string;
  sexualOrientation?: string[];
  genderIdentity?: string[];
  relationshipWorkingWell?: string[];
  conflictNeeds?: string[];
  feelLovedWhen?: string[];
  stressReactions?: string[];
  [key: string]: any;
}

export const useOptimizedPersonalProfileData = () => {
  const store = useOptimizedProfileStore('personal');
  
  // Type-safe profile data casting
  const personalData = store.profileData as PersonalProfileOptimized;
  
  // Extended profile data with legacy field support
  const extendedProfileData: ExtendedPersonalProfileData = {
    ...personalData,
    // Legacy field mappings for backward compatibility
    sexualOrientation: personalData.orientation || [],
    genderIdentity: personalData.gender || [],
    relationshipWorkingWell: personalData.relationshipWorking || [],
    conflictNeeds: personalData.conflictStyle || [],
    feelLovedWhen: personalData.loveLanguage || [],
    stressReactions: personalData.stressResponse || []
  };

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

  // Wrap updateField to normalize field names
  const normalizedUpdateField = (field: string, value: any) => {
    const normalizedField = normalizeFieldName(field);
    store.updateField(normalizedField, value);
  };

  // Wrap handleMultiSelect to normalize field names
  const normalizedHandleMultiSelect = (field: string, value: string) => {
    const normalizedField = normalizeFieldName(field);
    store.handleMultiSelect(normalizedField, value);
  };

  return {
    profileData: extendedProfileData,
    isLoading: store.isLoading,
    isReady: store.isReady,
    isSyncing: store.isSyncing,
    saveData: store.saveData,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect
  };
};