
import { useProfileStoreV2 } from './useProfileStoreV2';

interface PersonalProfileData {
  // Section 1 - The Basics
  name?: string;
  age?: string;
  gender?: string[];
  orientation?: string[];
  profilePhoto?: string;
  
  // Section 2 - Your Relationship World
  relationshipStatus?: string;
  relationshipLength?: string;
  whyRealTalk?: string[];
  biggestChallenge?: string[];
  workingWell?: string[];
  feelsDifficult?: string[];
  
  // Section 3 - How You Operate
  stressResponse?: string[];
  conflictNeeds?: string[];
  feelLovedWhen?: string[];
  attachmentStyle?: string;
  
  // Section 4 - Your Foundation (New Questions)
  familySituation?: string;
  familySituationOther?: string;
  familyEmotions?: string[];
  familyEmotionsOther?: string;
  familyConflict?: string[];
  familyConflictOther?: string;
  familyLove?: string[];
  familyLoveOther?: string;
  
  // Metadata
  completedAt?: string;
  profileSource?: string;
  [key: string]: any;
}

export const usePersonalProfileData = () => {
  // Use the new V2 storage system
  const v2Store = useProfileStoreV2('personal');

  return {
    profileData: v2Store.profileData,
    isLoading: v2Store.isLoading,
    isReady: v2Store.isReady,
    saveData: v2Store.saveData,
    updateField: v2Store.updateField,
    handleMultiSelect: v2Store.handleMultiSelect
  };
};
