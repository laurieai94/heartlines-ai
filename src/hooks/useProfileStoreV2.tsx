import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { debounce } from '@/utils/throttle';

// Global instance tracking to prevent conflicts
const HOOK_INSTANCES = new Map<string, number>();
const DB_CACHE = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export type ProfileType = 'personal' | 'partner';

// Canonical Personal Profile Schema
export interface PersonalProfileV2 {
  // Section 1: Basics
  name: string;
  age: string;
  gender: string[];
  orientation: string[];
  pronouns: string;
  
  // Section 2: Relationship
  relationshipStatus: string;
  relationshipLength: string;
  talkingDuration: string;
  talkingDescription: string[];
  talkingChallenges: string[];
  relationshipChallenges: string[];
  relationshipWorking: string[];
  datingChallenges: string[];
  datingGoals: string[]; // Added for goals functionality
  separationSituation: string[];
  datingReadiness: string[];
  timeSinceLoss: string;
  grievingProcess: string[];
  
  // Section 3: Operations
  stressResponse: string[];
  conflictStyle: string[];
  loveLanguage: string[];
  
  // Section 4: Foundation
  heartbreakBetrayal: string[];
  familyStructure: string[];
  attachmentStyle: string;
  
  // Metadata
  lastUpdated: string;
  version: string;
}

// Partner Profile Schema  
export interface PartnerProfileV2 {
  // Section 1: The Basics
  partnerName: string;
  partnerPronouns: string;
  partnerAge: string;
  partnerOrientation: string;
  partnerGender: string[];
  
  // Section 2: How They Operate
  partnerLoveLanguage: string[];
  partnerConflictStyle: string[];
  partnerCommunicationResponse: string[];
  partnerSelfAwareness: string;
  
  // Section 3: Their Foundation
  partnerHeartbreakBetrayal: string[];
  partnerFamilyStructure: string[];
  partnerAttachmentStyle: string;
  
  // Metadata
  lastUpdated: string;
  version: string;
}

const defaultPersonalProfile: PersonalProfileV2 = {
  name: '', age: '', gender: [], orientation: [], pronouns: '',
  relationshipStatus: '', relationshipLength: '', talkingDuration: '',
  talkingDescription: [], talkingChallenges: [], relationshipChallenges: [],
  relationshipWorking: [], datingChallenges: [], datingGoals: [],
  separationSituation: [], datingReadiness: [], timeSinceLoss: '', grievingProcess: [],
  stressResponse: [], conflictStyle: [], loveLanguage: [],
  heartbreakBetrayal: [], familyStructure: [], attachmentStyle: '',
  lastUpdated: '', version: '2.0'
};

const defaultPartnerProfile: PartnerProfileV2 = {
  partnerName: '', partnerPronouns: '', partnerAge: '', partnerOrientation: '', partnerGender: [],
  partnerLoveLanguage: [], partnerConflictStyle: [], partnerCommunicationResponse: [], partnerSelfAwareness: '',
  partnerHeartbreakBetrayal: [], partnerFamilyStructure: [], partnerAttachmentStyle: '',
  lastUpdated: '', version: '2.0'
};

// Legacy field mappings for migration
const PERSONAL_LEGACY_MAPPINGS: Record<string, string> = {
  'stressReactions': 'stressResponse',
  'conflictNeeds': 'conflictStyle',
  'feelLovedWhen': 'loveLanguage',
  'workingWell': 'relationshipWorking',
  'relationshipPositives': 'relationshipWorking',
  'relationshipWorkingWell': 'relationshipWorking',
  'biggestChallenge': 'relationshipChallenges',
  'sexualOrientation': 'orientation',
  'genderIdentity': 'gender',
  // Goals field mappings
  'relationshipGoals': 'datingGoals',
  'goals': 'datingGoals'
};

const STORAGE_CONFIG = {
  personal: {
    storageKey: 'personal_profile_v2',
    legacyKeys: ['personal_profile_questionnaire', 'newPersonalQuestionnaire', 'personalProfile'],
    dbType: 'your' as const
  },
  partner: {
    storageKey: 'partner_profile_v2', 
    legacyKeys: ['partner_profile_questionnaire', 'newPartnerProfile', 'partnerProfile'],
    dbType: 'partner' as const
  }
};

const DEBOUNCE_MS = 2000;
const IN_TAB_PROFILE_UPDATE_EVENT = 'profile:updated';
export const useProfileStoreV2 = (profileType: ProfileType) => {
  // DISABLED: This 708-line performance bottleneck has been replaced by useOptimizedProfileStore
  console.warn('⚠️ useProfileStoreV2 is disabled for performance optimization. Use useOptimizedProfileStore instead.');
  
  // Return empty/disabled state to prevent usage
  return {
    profileData: {},
    isLoading: false,
    isReady: false,
    isSyncing: false,
    updateField: () => {
      console.warn('useProfileStoreV2.updateField is disabled. Use useOptimizedProfileStore instead.');
    },
    handleMultiSelect: () => {
      console.warn('useProfileStoreV2.handleMultiSelect is disabled. Use useOptimizedProfileStore instead.');
    },
    saveData: async () => {
      console.warn('useProfileStoreV2.saveData is disabled. Use useOptimizedProfileStore instead.');
    },
    clearProfile: () => {
      console.warn('useProfileStoreV2.clearProfile is disabled. Use useOptimizedProfileStore instead.');
    },
    lastSaved: null
  };
  
  /* DISABLED ORIGINAL IMPLEMENTATION TO PREVENT PERFORMANCE ISSUES
  const { user } = useAuth();
  const config = STORAGE_CONFIG[profileType];
  const defaultProfile = profileType === 'personal' ? defaultPersonalProfile : defaultPartnerProfile;
  ...
  [All original implementation code commented out for performance]
  */
};