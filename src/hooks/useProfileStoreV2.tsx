import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  relationshipWorking: [], datingChallenges: [], separationSituation: [],
  datingReadiness: [], timeSinceLoss: '', grievingProcess: [],
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
  'genderIdentity': 'gender'
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

export const useProfileStoreV2 = (profileType: ProfileType) => {
  const { user } = useAuth();
  const config = STORAGE_CONFIG[profileType];
  const defaultProfile = profileType === 'personal' ? defaultPersonalProfile : defaultPartnerProfile;
  
  const [profile, setProfile] = useState<PersonalProfileV2 | PartnerProfileV2>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const pendingUpdates = useRef<Partial<PersonalProfileV2 | PartnerProfileV2>>({});

  // Clone arrays to prevent aliasing
  const cloneProfile = useCallback((data: Partial<PersonalProfileV2 | PartnerProfileV2>): Partial<PersonalProfileV2 | PartnerProfileV2> => {
    const cloned = { ...data };
    Object.keys(cloned).forEach(key => {
      if (Array.isArray(cloned[key as keyof typeof cloned])) {
        (cloned as any)[key] = [...(cloned as any)[key]];
      }
    });
    return cloned;
  }, []);

  // Migrate legacy data
  const migrateLegacyData = useCallback((data: any): Partial<PersonalProfileV2 | PartnerProfileV2> => {
    const migrated: any = { ...data };
    
    // Apply legacy field mappings (only for personal profiles)
    if (profileType === 'personal') {
      Object.entries(PERSONAL_LEGACY_MAPPINGS).forEach(([oldKey, newKey]) => {
        if (migrated[oldKey] && !migrated[newKey]) {
          migrated[newKey] = migrated[oldKey];
          delete migrated[oldKey];
        }
      });
    }
    
    return migrated;
  }, [profileType]);

  // Load from localStorage with migration
  const loadFromStorage = useCallback((): PersonalProfileV2 | PartnerProfileV2 => {
    try {
      // Try new format first
      const v2Data = localStorage.getItem(config.storageKey);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        console.log(`[ProfileV2-${profileType}] Loaded from v2 storage:`, parsed);
        return { ...defaultProfile, ...parsed };
      }

      // Try legacy formats
      for (const key of config.legacyKeys) {
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          const migrated = migrateLegacyData(parsed);
          console.log(`[ProfileV2-${profileType}] Migrated from ${key}:`, migrated);
          
          // Save migrated data to new format
          const fullProfile = { ...defaultProfile, ...migrated, version: '2.0' };
          localStorage.setItem(config.storageKey, JSON.stringify(fullProfile));
          
          return fullProfile;
        }
      }
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Storage load error:`, error);
    }
    
    return defaultProfile;
  }, [config, defaultProfile, migrateLegacyData, profileType]);

  // Save to localStorage (immediate)
  const saveToStorage = useCallback((data: PersonalProfileV2 | PartnerProfileV2) => {
    try {
      const toSave = { ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem(config.storageKey, JSON.stringify(toSave));
      console.log(`[ProfileV2-${profileType}] Saved to localStorage:`, toSave);
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Storage save error:`, error);
    }
  }, [config.storageKey, profileType]);

  // Debounced sync to Supabase
  const syncToDatabase = useCallback(async (updates: Partial<PersonalProfileV2 | PartnerProfileV2>) => {
    if (!user) return;

    try {
      console.log(`[ProfileV2-${profileType}] Syncing to database:`, updates);
      
      const { data, error } = await supabase.rpc('upsert_user_profile_patch', {
        p_profile_type: config.dbType,
        p_patch: updates
      });

      if (error) throw error;

      // Always update state from server response
      if (data && typeof data === 'object') {
        const serverProfile = { ...defaultProfile, ...(data as any), version: '2.0' };
        setProfile(serverProfile);
        saveToStorage(serverProfile);
        setLastSaved(new Date());
        console.log(`[ProfileV2-${profileType}] Updated from server:`, serverProfile);
      }
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Database sync error:`, error);
    }
  }, [user, config.dbType, defaultProfile, saveToStorage, profileType]);

  // Load from database
  const loadFromDatabase = useCallback(async (): Promise<PersonalProfileV2 | PartnerProfileV2> => {
    if (!user) return defaultProfile;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_data, demographics_data')
        .eq('user_id', user.id)
        .eq('profile_type', config.dbType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const profileData = (data.profile_data && typeof data.profile_data === 'object') ? data.profile_data : {};
        const demographicsData = (data.demographics_data && typeof data.demographics_data === 'object') ? data.demographics_data : {};
        
        const merged = { 
          ...(profileData as any), 
          ...(demographicsData as any) 
        };
        const migrated = migrateLegacyData(merged);
        return { ...defaultProfile, ...migrated, version: '2.0' };
      }
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Database load error:`, error);
    }

    return defaultProfile;
  }, [user, config.dbType, defaultProfile, migrateLegacyData, profileType]);

  // Initialize and load data
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Load from localStorage first (instant)
      const localProfile = loadFromStorage();
      setProfile(localProfile);
      setIsReady(true);
      
      // Then sync with database if authenticated
      if (user) {
        const dbProfile = await loadFromDatabase();
        
        // Merge local and remote, preferring newer data
        const localTime = new Date(localProfile.lastUpdated || 0).getTime();
        const dbTime = new Date(dbProfile.lastUpdated || 0).getTime();
        
        const finalProfile = dbTime > localTime ? dbProfile : localProfile;
        setProfile(finalProfile);
        saveToStorage(finalProfile);
      }
      
      setIsLoading(false);
    };

    initialize();
  }, [user, loadFromStorage, loadFromDatabase, saveToStorage]);

  // Update profile data
  const updateProfile = useCallback((updates: Partial<PersonalProfileV2 | PartnerProfileV2>) => {
    const clonedUpdates = cloneProfile(updates);
    
    // Optimistic update
    setProfile(prev => {
      const updated = { ...prev, ...clonedUpdates };
      saveToStorage(updated);
      return updated;
    });

    // Accumulate pending updates
    Object.assign(pendingUpdates.current, clonedUpdates);

    // Debounced database sync
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const toSync = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      syncToDatabase(toSync);
    }, DEBOUNCE_MS);
  }, [cloneProfile, saveToStorage, syncToDatabase]);

  // Update single field
  const updateField = useCallback((field: string, value: any) => {
    updateProfile({ [field]: value } as any);
  }, [updateProfile]);

  // Handle multi-select
  const handleMultiSelect = useCallback((field: string, value: string) => {
    const current = (profile as any)[field] as string[] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    updateField(field, updated);
  }, [profile, updateField]);

  return {
    profileData: profile,
    isLoading,
    isReady,
    updateField,
    handleMultiSelect,
    saveData: updateProfile,
    lastSaved
  };
};