import { useProfileStoreV2 } from './useProfileStoreV2';
import { ProfileData } from '../components/NewPersonalQuestionnaire/types';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { profilePreloader } from '@/utils/profilePreloader';

// Extended interface to support both old and new field names
interface ExtendedProfileData extends ProfileData {
  // Legacy field names for backward compatibility
  avatar_url?: string;
  sexualOrientation?: string[];
  genderIdentity?: string[];
  [key: string]: any;
}

export const usePersonalProfileData = () => {
  performanceMonitor.mark('personal-profile-data-init');
  
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

  // Check session cache first for ultra-fast access
  const cachedData = profilePreloader.getCachedProfileData('personal');
  const mergedProfileData = cachedData || { ...defaultProfileData, ...v2Store.profileData } as ExtendedProfileData;

  // Cache the merged data for next access
  if (!cachedData && Object.keys(v2Store.profileData).length > 0) {
    profilePreloader.cacheProfileData('personal', mergedProfileData, 10 * 60 * 1000);
  }

  // Wrap updateField to normalize field names with performance monitoring
  const normalizedUpdateField = (field: string, value: any) => {
    performanceMonitor.mark(`update-field-${field}`);
    
    const normalizedField = normalizeFieldName(field);
    console.log(`[NORMALIZE] Writing ${field} -> ${normalizedField}:`, value);
    v2Store.updateField(normalizedField, value);
    
    // Update cache immediately
    const updated = { ...mergedProfileData, [normalizedField]: value };
    profilePreloader.cacheProfileData('personal', updated, 10 * 60 * 1000);
    
    performanceMonitor.measure(`update-field-${field}`, 5);
  };

  // Wrap handleMultiSelect to normalize field names with performance monitoring
  const normalizedHandleMultiSelect = (field: string, value: string) => {
    performanceMonitor.mark(`multiselect-${field}`);
    
    const normalizedField = normalizeFieldName(field);
    console.log(`[NORMALIZE] Multi-select ${field} -> ${normalizedField}:`, value);
    v2Store.handleMultiSelect(normalizedField, value);
    
    performanceMonitor.measure(`multiselect-${field}`, 5);
  };

  performanceMonitor.measure('personal-profile-data-init', 10);

  return {
    profileData: mergedProfileData,
    isLoading: v2Store.isLoading,
    isReady: v2Store.isReady,
    isSyncing: v2Store.isSyncing,
    saveData: v2Store.saveData,
    updateField: normalizedUpdateField,
    handleMultiSelect: normalizedHandleMultiSelect
  };
};