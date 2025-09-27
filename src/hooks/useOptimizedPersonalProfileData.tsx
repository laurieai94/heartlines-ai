import { useOptimizedProfileStore, PersonalProfileOptimized } from './useOptimizedProfileStore';

// Adapter hook to maintain compatibility while using optimized storage
export const useOptimizedPersonalProfileData = () => {
  const store = useOptimizedProfileStore('personal');
  
  // Type-safe profile data casting
  const personalData = store.profileData as PersonalProfileOptimized;
  
  // Extended profile data with legacy field support
  const extendedProfileData = {
    ...personalData,
    // Legacy field mappings for backward compatibility
    sexualOrientation: personalData.orientation || [],
    genderIdentity: personalData.gender || [],
    relationshipWorkingWell: [], // Default for missing fields
    conflictNeeds: personalData.conflictStyle || [],
    feelLovedWhen: personalData.loveLanguage || [],
    stressReactions: personalData.stressResponse || []
  };
  
  return {
    profileData: extendedProfileData,
    isLoading: store.isLoading,
    isReady: store.isReady,
    isSyncing: store.isSyncing,
    saveData: store.saveData,
    updateField: store.updateField,
    handleMultiSelect: store.handleMultiSelect
  };
};