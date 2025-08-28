import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { profileSyncDiagnostics } from '@/utils/profileSyncDiagnostics';
import { logger } from '@/utils/logger';

// Module-level cache and inflight promise tracking to prevent duplicate requests
const cachedDataByType = new Map<ProfileType, ProfileData>();
const inflightRequestsByType = new Map<ProfileType, Promise<ProfileData>>();
const PROFILE_UPDATED_EVENT = 'profile:updated';

export type ProfileType = 'personal' | 'partner';

interface ProfileData {
  [key: string]: any;
}

interface StorageKeys {
  localStorage: string;
  databaseColumn: string;
}

const STORAGE_CONFIG: Record<ProfileType, StorageKeys> = {
  personal: {
    localStorage: 'personal_profile_questionnaire',
    databaseColumn: 'demographics_data' // Will read from both columns, save to both
  },
  partner: {
    localStorage: 'partner_profile_questionnaire', 
    databaseColumn: 'demographics_data'
  }
};

// Field normalization mappings for personal profiles
const PERSONAL_FIELD_MAPPINGS = {
  // New Questionnaire -> Demographics (to storage)
  toStorage: {
    'orientation': 'sexualOrientation',
    'gender': 'genderIdentity',
    'loveLanguage': 'feelLovedWhen'
  },
  // Demographics/Legacy -> New Questionnaire (from storage)
  fromStorage: {
    'sexualOrientation': 'orientation',
    'genderIdentity': 'gender',
    'feelLovedWhen': 'loveLanguage'
  }
};

// Helper function to normalize field names when loading data
const normalizeFieldsFromStorage = (data: ProfileData, profileType: ProfileType): ProfileData => {
  if (profileType !== 'personal') return data;
  
  const normalized = { ...data };
  const mappings = PERSONAL_FIELD_MAPPINGS.fromStorage;
  
  Object.entries(mappings).forEach(([oldField, newField]) => {
    if (data[oldField] !== undefined) {
      // Handle sexualOrientation -> orientation (keep both for UI compatibility)
      if (oldField === 'sexualOrientation') {
        if (Array.isArray(data[oldField])) {
          // Convert array to single string for new questionnaire
          normalized[newField] = data[oldField].length > 0 ? data[oldField][0] : '';
          // Keep original array for legacy UI components
          normalized[oldField] = data[oldField];
        } else if (typeof data[oldField] === 'string') {
          normalized[newField] = data[oldField];
          normalized[oldField] = data[oldField] ? [data[oldField]] : [];
        }
      }
      // Handle genderIdentity -> gender (keep both for UI compatibility)
      else if (oldField === 'genderIdentity') {
        if (Array.isArray(data[oldField])) {
          // Convert array to single string for new questionnaire
          normalized[newField] = data[oldField].length > 0 ? data[oldField][0] : '';
          // Keep original array for legacy UI components
          normalized[oldField] = data[oldField];
        } else if (typeof data[oldField] === 'string') {
          normalized[newField] = data[oldField];
          normalized[oldField] = data[oldField] ? [data[oldField]] : [];
        }
      }
      // Handle feelLovedWhen -> loveLanguage (keep original for backward compatibility)
      else if (oldField === 'feelLovedWhen') {
        const arr = Array.isArray(data[oldField])
          ? data[oldField]
          : (data[oldField] ? [data[oldField]] : []);
        normalized[newField] = arr;
        // Do NOT delete feelLovedWhen so legacy readers still work
      }
      else {
        normalized[newField] = data[oldField];
        delete normalized[oldField];
      }
    }
  });
  
  return normalized;
};

// Helper function to normalize field names when saving data  
const normalizeFieldsToStorage = (data: ProfileData, profileType: ProfileType): ProfileData => {
  if (profileType !== 'personal') return data;
  
  const normalized = { ...data };
  const mappings = PERSONAL_FIELD_MAPPINGS.toStorage;
  
  // Handle direct legacy field updates (from PersonalIdentity component)
  if (data.sexualOrientation !== undefined) {
    // Only update if incoming data is meaningful (not empty)
    if (Array.isArray(data.sexualOrientation) && data.sexualOrientation.length > 0) {
      normalized.sexualOrientation = data.sexualOrientation;
      normalized.orientation = data.sexualOrientation[0];
    } else if (typeof data.sexualOrientation === 'string' && data.sexualOrientation.trim()) {
      normalized.sexualOrientation = [data.sexualOrientation];
      normalized.orientation = data.sexualOrientation;
    }
    // Don't clear existing data with empty values
  }
  
  if (data.genderIdentity !== undefined) {
    // Only update if incoming data is meaningful (not empty)  
    if (Array.isArray(data.genderIdentity) && data.genderIdentity.length > 0) {
      normalized.genderIdentity = data.genderIdentity;
      normalized.gender = data.genderIdentity[0];
    } else if (typeof data.genderIdentity === 'string' && data.genderIdentity.trim()) {
      normalized.genderIdentity = [data.genderIdentity];
      normalized.gender = data.genderIdentity;
    }
    // Don't clear existing data with empty values
  }
  
  // Handle new field updates (from new questionnaire)
  Object.entries(mappings).forEach(([oldField, newField]) => {
    if (data[oldField] !== undefined) {
      // Handle orientation -> sexualOrientation (prevent empty string from clearing arrays)
      if (oldField === 'orientation') {
        if (data[oldField] && typeof data[oldField] === 'string' && data[oldField].trim()) {
          normalized[newField] = [data[oldField]];
        } else if (Array.isArray(data[oldField]) && data[oldField].length > 0) {
          normalized[newField] = data[oldField];
        }
        // Keep both fields for compatibility, but don't overwrite meaningful data with empty
        if (data[oldField] && ((typeof data[oldField] === 'string' && data[oldField].trim()) || 
                              (Array.isArray(data[oldField]) && data[oldField].length > 0))) {
          normalized[oldField] = data[oldField];
        }
      }
      // Handle gender -> genderIdentity (prevent empty string from clearing arrays)  
      else if (oldField === 'gender') {
        if (data[oldField] && typeof data[oldField] === 'string' && data[oldField].trim()) {
          normalized[newField] = [data[oldField]];
        } else if (Array.isArray(data[oldField]) && data[oldField].length > 0) {
          normalized[newField] = data[oldField];
        }
        // Keep both fields for compatibility, but don't overwrite meaningful data with empty
        if (data[oldField] && ((typeof data[oldField] === 'string' && data[oldField].trim()) ||
                              (Array.isArray(data[oldField]) && data[oldField].length > 0))) {
          normalized[oldField] = data[oldField];
        }
      }
      // Handle loveLanguage -> feelLovedWhen (keep both for runtime compatibility)
      else if (oldField === 'loveLanguage') {
        const arr = Array.isArray(data[oldField])
          ? data[oldField]
          : (data[oldField] ? [data[oldField]] : []);
        normalized[newField] = arr;
        // Do NOT delete loveLanguage so new UI keeps working
      }
      else {
        normalized[newField] = data[oldField];
        delete normalized[oldField];
      }
    }
  });
  
  return normalized;
};

export const useUnifiedProfileStorage = (profileType: ProfileType) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const config = STORAGE_CONFIG[profileType];

  // Helper function to check if data has meaningful content
  const isMeaningfullyFilled = useCallback((data: ProfileData): boolean => {
    if (!data || Object.keys(data).length === 0) return false;
    
    return Object.entries(data).some(([key, value]) => {
      // Skip metadata fields
      if (key === 'completedAt' || key === 'profileSource') return false;
      
      // Check for meaningful values
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) {
        // Check if array has meaningful items (not just empty strings)
        return value.some(item => 
          typeof item === 'string' ? item.trim().length > 0 : item != null
        );
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => 
          typeof v === 'string' ? v.trim().length > 0 : v != null
        );
      }
      
      return value !== null && value !== undefined && value !== '';
    });
  }, []);

  // Helper function to merge data preferring non-empty values
  const mergePreferNonEmpty = useCallback((localData: ProfileData, dbData: ProfileData): ProfileData => {
    const result = { ...localData };
    
    Object.entries(dbData).forEach(([key, value]) => {
      const localValue = localData[key];
      
      // If local value is empty/meaningless, use db value
      if (!localValue || 
          (typeof localValue === 'string' && localValue.trim().length === 0) ||
          (Array.isArray(localValue) && localValue.length === 0)) {
        result[key] = value;
      }
      // If db value is meaningful and local value is also meaningful, prefer local (user's latest work)
      // But for arrays, we might want to merge unique values
      else if (Array.isArray(localValue) && Array.isArray(value)) {
        const uniqueValues = Array.from(new Set([...localValue, ...value]));
        result[key] = uniqueValues;
      }
    });
    
    return result;
  }, []);

  // Load from localStorage with error handling and migration
  const loadFromStorage = useCallback((): ProfileData => {
    try {
      // First try the canonical key
      let localData = localStorage.getItem(config.localStorage);
      if (localData) {
        const parsed = JSON.parse(localData);
        const normalized = normalizeFieldsFromStorage(parsed || {}, profileType);
        return normalized;
      }

      // For personal profiles, migrate from old keys (exclude canonical key!)
      if (profileType === 'personal') {
        const oldKeys = ['personal_profile_data', 'realtalk_temp_profiles'];
        let migratedData = {};
        
        for (const oldKey of oldKeys) {
          const oldData = localStorage.getItem(oldKey);
          if (oldData) {
            try {
              const parsed = JSON.parse(oldData);
              if (oldKey === 'realtalk_temp_profiles') {
                // Extract 'your' profile from realtalk structure
                if (parsed.your && Array.isArray(parsed.your) && parsed.your[0]) {
                  migratedData = { ...migratedData, ...parsed.your[0] };
                } else if (parsed.your && typeof parsed.your === 'object') {
                  migratedData = { ...migratedData, ...parsed.your };
                }
              } else {
                migratedData = { ...migratedData, ...parsed };
              }
              console.log(`✅ Migrated data from ${oldKey} to ${config.localStorage}`);
            } catch (error) {
              console.error(`Error parsing data from ${oldKey}:`, error);
            }
          }
        }
        
        // Save migrated data to canonical key and clean up old keys (not including canonical!)
        if (Object.keys(migratedData).length > 0) {
          const normalized = normalizeFieldsFromStorage(migratedData, profileType);
          localStorage.setItem(config.localStorage, JSON.stringify(normalized));
          // Only remove the old keys, not the canonical key
          oldKeys.forEach(key => {
            if (key !== config.localStorage) {
              localStorage.removeItem(key);
            }
          });
          return normalized;
        }
      }
    } catch (error) {
      console.error(`Error loading ${profileType} profile from localStorage:`, error);
      toast.error(`Failed to load saved ${profileType} profile data`);
    }
    return {};
  }, [config.localStorage, profileType]);

  // Save to localStorage with error handling
  const saveToStorage = useCallback((data: ProfileData) => {
    try {
      const normalizedData = normalizeFieldsToStorage(data, profileType);
      localStorage.setItem(config.localStorage, JSON.stringify(normalizedData));
      
      // For personal profiles, also mirror to the legacy questionnaire key for compatibility
      if (profileType === 'personal') {
        localStorage.setItem('personal_profile_questionnaire', JSON.stringify(normalizedData));
        console.log('🔄 Mirrored personal profile to legacy questionnaire storage');
      }
      
      // Keep in-memory cache in UI shape for instant cross-hook reads
      cachedDataByType.set(profileType, data);
      setLastSaved(new Date());
    } catch (error) {
      console.error(`Error saving ${profileType} profile to localStorage:`, error);
      toast.error(`Failed to save ${profileType} profile data locally`);
    }
  }, [config.localStorage, profileType]);

  // Load from database with error handling and caching
  const loadFromDatabase = useCallback(async (): Promise<ProfileData> => {
    if (!user) return {};

    // Check cache first
    if (cachedDataByType.has(profileType)) {
      return cachedDataByType.get(profileType)!;
    }

    // Check if request is already in flight
    if (inflightRequestsByType.has(profileType)) {
      return await inflightRequestsByType.get(profileType)!;
    }

    // Create new request
    const requestPromise = (async (): Promise<ProfileData> => {
      try {
        const dbProfileType = profileType === 'personal' ? 'your' : 'partner';
        
        // For personal profiles, read from both columns and merge
        if (profileType === 'personal') {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('profile_data, demographics_data')
            .eq('user_id', user.id)
            .eq('profile_type', dbProfileType)
            .maybeSingle();

          if (error) {
            console.error(`Database load error for ${profileType}:`, error);
            return {};
          }

          // Merge both profile_data and demographics_data
          let result = {};
          if (data) {
            const profileData = data.profile_data || {};
            const demographicsData = data.demographics_data || {};
            const merged = {
              ...(typeof profileData === 'object' && profileData !== null ? profileData : {}),
              ...(typeof demographicsData === 'object' && demographicsData !== null ? demographicsData : {})
            };
            result = normalizeFieldsFromStorage(merged, profileType);
          }
          
          console.log(`Loaded ${profileType} profile from database (merged):`, result);
          cachedDataByType.set(profileType, result);
          return result;
        } else {
          // For partner profiles, use demographics_data as before
          const { data, error } = await supabase
            .from('user_profiles')
            .select(`${config.databaseColumn}`)
            .eq('user_id', user.id)
            .eq('profile_type', dbProfileType)
            .maybeSingle();

          if (error) {
            console.error(`Database load error for ${profileType}:`, error);
            return {};
          }

          if (data && data[config.databaseColumn]) {
            const rawData = typeof data[config.databaseColumn] === 'object' && data[config.databaseColumn] !== null 
              ? data[config.databaseColumn] 
              : {};
            const dbData = normalizeFieldsFromStorage(rawData, profileType);
            
        logger.info(`Loaded ${profileType} profile from database:`, { 
          fieldCount: Object.keys(dbData).length,
          hasData: Object.keys(dbData).length > 0
        });
            cachedDataByType.set(profileType, dbData);
            return dbData;
          }
        }
      } catch (error) {
        logger.error(`Error loading ${profileType} profile from database:`, error);
      }
      
      const emptyData = {};
      cachedDataByType.set(profileType, emptyData);
      return emptyData;
    })();

    // Store inflight request
    inflightRequestsByType.set(profileType, requestPromise);
    
    // Clean up inflight tracking when done
    const result = await requestPromise;
    inflightRequestsByType.delete(profileType);
    
    return result;
  }, [user, config.databaseColumn, profileType]);

  // Save to database with error handling and retry
  const saveToDatabase = useCallback(async (data: ProfileData, retryCount = 0): Promise<boolean> => {
    if (!user) return false;

    const profileTypeName = profileType === 'personal' ? 'personal' : 'partner';
    profileSyncDiagnostics.logSyncAttempt(profileTypeName, data);

    try {
      const dbProfileType = profileType === 'personal' ? 'your' : 'partner';
      
      // For personal profiles, save to both columns for compatibility
      let upsertData;
      if (profileType === 'personal') {
        const normalizedData = normalizeFieldsToStorage(data, profileType);
        upsertData = {
          user_id: user.id,
          profile_type: dbProfileType,
          profile_data: normalizedData,
          demographics_data: normalizedData,
          updated_at: new Date().toISOString()
        };
      } else {
        const normalizedData = normalizeFieldsToStorage(data, profileType);
        upsertData = {
          user_id: user.id,
          profile_type: dbProfileType,
          [config.databaseColumn]: normalizedData,
          updated_at: new Date().toISOString()
        };
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id,profile_type'
        });
      
      if (error) {
        profileSyncDiagnostics.logSyncFailure(profileTypeName, error);
        logger.error(`Database save error for ${profileType}:`, error);
        
        // Retry logic for transient errors
        if (retryCount < 2 && error.code !== '23505') { // Don't retry constraint violations
          logger.info(`Retrying database save for ${profileType}, attempt ${retryCount + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return saveToDatabase(data, retryCount + 1);
        }
        
        // Don't show toast for duplicate key errors (they're handled by upsert)
        if (error.code !== '23505') {
          toast.error(`Failed to sync ${profileType} profile to cloud`);
        }
        return false;
      } else {
        profileSyncDiagnostics.logSyncSuccess(profileTypeName);
        setLastSaved(new Date());
        // Update cache with fresh data
        cachedDataByType.set(profileType, data);
        logger.info(`Saved ${profileType} profile to database successfully`);
        return true;
      }
    } catch (error) {
      console.error(`Error saving ${profileType} profile to database:`, error);
      
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return saveToDatabase(data, retryCount + 1);
      }
      
      toast.error(`Failed to sync ${profileType} profile to cloud`);
      return false;
    }
  }, [user, config.databaseColumn, profileType]);

  // Unified save function with optimistic updates and "prefer non-empty" merge strategy
  const saveData = useCallback(async (newData: Partial<ProfileData>) => {
    if (!newData || Object.keys(newData).length === 0) {
      console.log('🚫 saveData: No meaningful data to save');
      return;
    }
    
    const currentData = profileData || {};
    console.log('💾 saveData: Merging data', { current: currentData, new: newData });
    
    // Use "prefer non-empty" merge strategy to prevent data loss
    const updatedData = mergePreferNonEmpty(currentData, newData);
    console.log('✅ saveData: Merged result', updatedData);

    // Optimistic update for this hook instance
    setProfileData(updatedData);

    // Persist locally and update shared cache
    saveToStorage(updatedData);
    cachedDataByType.set(profileType, updatedData);

    // Broadcast to other hook instances immediately
    try {
      window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: { profileType, data: updatedData } }));
    } catch (e) {
      console.warn('Profile update event dispatch failed', e);
    }

    // Save to database with fallback
    if (user) {
      const success = await saveToDatabase(updatedData);
      if (!success) {
        console.warn(`Database save failed for ${profileType}, data preserved locally`);
      }
    }
  }, [profileData, saveToStorage, saveToDatabase, user, profileType, mergePreferNonEmpty]);

// Field update helpers
const updateField = useCallback((field: string, value: any) => {
  // Mirror between legacy and new keys for personal profile
  if (profileType === 'personal' && (field === 'loveLanguage' || field === 'feelLovedWhen')) {
    const mirroredKey = field === 'loveLanguage' ? 'feelLovedWhen' : 'loveLanguage';
    saveData({ [field]: value, [mirroredKey]: Array.isArray(value) ? value : (value ? [value] : []) });
    return;
  }
  saveData({ [field]: value });
}, [saveData, profileType]);

const handleMultiSelect = useCallback((field: string, value: string) => {
  const currentValues = (profileData[field] as string[]) || [];
  const newValues = currentValues.includes(value)
    ? currentValues.filter(v => v !== value)
    : [...currentValues, value];
  // Mirror for loveLanguage/feelLovedWhen
  if (profileType === 'personal' && (field === 'loveLanguage' || field === 'feelLovedWhen')) {
    const mirroredKey = field === 'loveLanguage' ? 'feelLovedWhen' : 'loveLanguage';
    updateField(field, newValues);
    updateField(mirroredKey, newValues);
    return;
  }
  updateField(field, newValues);
}, [profileData, updateField, profileType]);

  // Data migration when user authenticates (only if local data is meaningful)
  const migrateLocalToDatabase = useCallback(async () => {
    if (!user) return;

    const localData = loadFromStorage();
    if (isMeaningfullyFilled(localData)) {
      console.log(`Migrating meaningful ${profileType} profile data to database`);
      await saveToDatabase(localData);
    }
  }, [user, loadFromStorage, saveToDatabase, profileType, isMeaningfullyFilled]);

  // Data recovery from database if localStorage is corrupted
  const recoverFromDatabase = useCallback(async () => {
    if (!user) return;

    try {
      const dbData = await loadFromDatabase();
      if (Object.keys(dbData).length > 0) {
        console.log(`Recovering ${profileType} profile data from database`);
        setProfileData(dbData);
        saveToStorage(dbData);
        return true;
      }
    } catch (error) {
      console.error(`Failed to recover ${profileType} profile data:`, error);
    }
    return false;
  }, [user, loadFromDatabase, saveToStorage, profileType]);

  // Load data on mount and auth changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load from localStorage first (immediate)
        const localData = loadFromStorage();
        if (Object.keys(localData).length > 0) {
          setProfileData(localData);
        }

        // Load from database if user is authenticated
        if (user) {
          const dbData = await loadFromDatabase();
          console.log(`📊 ${profileType} data comparison:`, {
            localMeaningful: isMeaningfullyFilled(localData),
            dbMeaningful: isMeaningfullyFilled(dbData),
            localKeys: Object.keys(localData),
            dbKeys: Object.keys(dbData)
          });
          
          if (isMeaningfullyFilled(dbData)) {
            // Use intelligent merge that prefers non-empty values
            setProfileData(prev => {
              const merged = mergePreferNonEmpty(prev, dbData);
              console.log(`🔄 Merged ${profileType} profile data:`, merged);
              saveToStorage(merged);
              return merged;
            });
          } else if (isMeaningfullyFilled(localData)) {
            // Migrate local data to database if it's meaningful
            console.log(`⬆️ Migrating meaningful ${profileType} data to database`);
            await migrateLocalToDatabase();
          }
        }
      } catch (error) {
        console.error(`Error loading ${profileType} profile data:`, error);
        if (user) {
          const recovered = await recoverFromDatabase();
          if (!recovered) {
            toast.error(`Failed to load ${profileType} profile data`);
          }
        }
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadData();
  }, [user, profileType, loadFromStorage, loadFromDatabase, saveToStorage, migrateLocalToDatabase, recoverFromDatabase, isMeaningfullyFilled, mergePreferNonEmpty]);

// One-time self-heal/repair for aliases and shapes
useEffect(() => {
  if (!isReady || profileType !== 'personal') return;
  const data = profileData || {};
  const updates: Record<string, any> = {};

  console.log('🔧 Self-heal check for personal profile:', data);

  // Restore from legacy questionnaire storage if current data is empty but legacy has data
  try {
    const legacyData = localStorage.getItem('personal_profile_questionnaire');
    if (legacyData && !isMeaningfullyFilled(data)) {
      const parsed = JSON.parse(legacyData);
      if (isMeaningfullyFilled(parsed)) {
        console.log('🚑 Recovering personal profile from legacy questionnaire storage');
        Object.assign(updates, parsed);
      }
    }
  } catch (error) {
    console.error('Error during self-heal recovery:', error);
  }

  // Ensure both loveLanguage and feelLovedWhen exist and are arrays
  const ll = Array.isArray(data.loveLanguage)
    ? data.loveLanguage
    : (data.loveLanguage ? [data.loveLanguage] : []);
  const flw = Array.isArray(data.feelLovedWhen)
    ? data.feelLovedWhen
    : (data.feelLovedWhen ? [data.feelLovedWhen] : []);
  if (ll.length > 0 && flw.length === 0) updates.feelLovedWhen = ll;
  if (flw.length > 0 && ll.length === 0) updates.loveLanguage = flw;

  // Ensure sexualOrientation/genderIdentity arrays exist if orientation/gender strings exist
  if (data.orientation && !data.sexualOrientation) {
    updates.sexualOrientation = [data.orientation];
  }
  if (data.gender && !data.genderIdentity) {
    updates.genderIdentity = [data.gender];
  }

  // Ensure orientation/gender are strings (pick first if arrays snuck in)
  if (Array.isArray(data.orientation)) updates.orientation = data.orientation[0] || '';
  if (Array.isArray(data.gender)) updates.gender = data.gender[0] || '';

  if (Object.keys(updates).length > 0) {
    console.log('🛠 Repairing personal profile data:', updates);
    saveData(updates);
  }
}, [isReady, profileType, profileData, saveData, isMeaningfullyFilled]);

// Safe periodic sync for data consistency (every 5 minutes when user is active)
useEffect(() => {
  if (!user || !isReady) return;

  const syncInterval = setInterval(async () => {
    if (document.visibilityState === 'visible') {
      try {
        const dbData = await loadFromDatabase();
        const localData = loadFromStorage();
        
        // Only sync if database has meaningful data AND it's different from local
        if (isMeaningfullyFilled(dbData)) {
          const localString = JSON.stringify(localData);
          const dbString = JSON.stringify(dbData);
          
          if (localString !== dbString) {
            console.log(`🔄 Syncing ${profileType} profile from database (meaningful changes detected)`);
            const merged = mergePreferNonEmpty(localData, dbData);
            setProfileData(merged);
            saveToStorage(merged);
          }
        } else if (isMeaningfullyFilled(localData)) {
          // If local has data but database doesn't, push local to database
          console.log(`⬆️ Pushing local ${profileType} data to database`);
          await saveToDatabase(localData);
        }
      } catch (error) {
        console.error(`Error during periodic sync for ${profileType}:`, error);
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(syncInterval);
}, [user, isReady, loadFromDatabase, loadFromStorage, saveToStorage, saveToDatabase, profileType, isMeaningfullyFilled, mergePreferNonEmpty]);

// Real-time sync across hook instances via a tiny event bus
useEffect(() => {
  const handler = (e: any) => {
    try {
      const detail = e.detail as { profileType: ProfileType; data: ProfileData };
      if (detail?.profileType === profileType) {
        setProfileData(prev => {
          const prevStr = JSON.stringify(prev || {});
          const nextStr = JSON.stringify(detail.data || {});
          return prevStr === nextStr ? prev : detail.data;
        });
      }
    } catch (err) {
      console.warn('Error handling profile update event', err);
    }
  };
  window.addEventListener(PROFILE_UPDATED_EVENT as any, handler as any);
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT as any, handler as any);
}, [profileType]);

// Cross-tab/localStorage synchronization listener
useEffect(() => {
  const onStorage = (e: StorageEvent) => {
    if (e.key === config.localStorage && typeof e.newValue === 'string') {
      try {
        const parsed = JSON.parse(e.newValue || '{}');
        const normalized = normalizeFieldsFromStorage(parsed, profileType);
        cachedDataByType.set(profileType, normalized);
        setProfileData(normalized);
      } catch (err) {
        console.warn('Failed to process storage event for profile data', err);
      }
    }
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, [config.localStorage, profileType]);

return {
  profileData,
  isLoading,
  isReady,
  saveData,
  updateField,
  handleMultiSelect,
  lastSaved,
  recoverFromDatabase
};
};