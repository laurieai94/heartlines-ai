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

  return {
    profileData: mergedProfileData,
    isLoading: v2Store.isLoading,
    isReady: v2Store.isReady,
    saveData: v2Store.saveData,
    updateField: v2Store.updateField as (field: string, value: any) => void,
    handleMultiSelect: v2Store.handleMultiSelect as (field: string, value: string) => void
  };
};