import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Module-level cache and inflight promise tracking to prevent duplicate requests
const cachedDataByType = new Map<ProfileType, ProfileData>();
const inflightRequestsByType = new Map<ProfileType, Promise<ProfileData>>();

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
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      
      return value !== null && value !== undefined;
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
        return parsed || {};
      }

      // For personal profiles, migrate from old keys (exclude canonical key!)
      if (profileType === 'personal') {
        const oldKeys = ['personal_profile_data']; // Don't include the canonical key here!
        let migratedData = {};
        
        for (const oldKey of oldKeys) {
          const oldData = localStorage.getItem(oldKey);
          if (oldData) {
            try {
              const parsed = JSON.parse(oldData);
              migratedData = { ...migratedData, ...parsed };
              console.log(`Migrated data from ${oldKey} to ${config.localStorage}`);
            } catch (error) {
              console.error(`Error parsing data from ${oldKey}:`, error);
            }
          }
        }
        
        // Save migrated data to canonical key and clean up old keys (not including canonical!)
        if (Object.keys(migratedData).length > 0) {
          localStorage.setItem(config.localStorage, JSON.stringify(migratedData));
          // Only remove the old keys, not the canonical key
          oldKeys.forEach(key => {
            if (key !== config.localStorage) {
              localStorage.removeItem(key);
            }
          });
          return migratedData;
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
      localStorage.setItem(config.localStorage, JSON.stringify(data));
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
            result = {
              ...(typeof profileData === 'object' && profileData !== null ? profileData : {}),
              ...(typeof demographicsData === 'object' && demographicsData !== null ? demographicsData : {})
            };
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
            const dbData = typeof data[config.databaseColumn] === 'object' && data[config.databaseColumn] !== null 
              ? data[config.databaseColumn] 
              : {};
            
            console.log(`Loaded ${profileType} profile from database:`, dbData);
            cachedDataByType.set(profileType, dbData);
            return dbData;
          }
        }
      } catch (error) {
        console.error(`Error loading ${profileType} profile from database:`, error);
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

    try {
      const dbProfileType = profileType === 'personal' ? 'your' : 'partner';
      
      // For personal profiles, save to both columns for compatibility
      let upsertData;
      if (profileType === 'personal') {
        upsertData = {
          user_id: user.id,
          profile_type: dbProfileType,
          profile_data: data,
          demographics_data: data,
          updated_at: new Date().toISOString()
        };
      } else {
        upsertData = {
          user_id: user.id,
          profile_type: dbProfileType,
          [config.databaseColumn]: data,
          updated_at: new Date().toISOString()
        };
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(upsertData, {
          onConflict: 'user_id,profile_type'
        });
      
      if (error) {
        console.error(`Database save error for ${profileType}:`, error);
        
        // Retry logic for transient errors
        if (retryCount < 2 && error.code !== '23505') { // Don't retry constraint violations
          console.log(`Retrying database save for ${profileType}, attempt ${retryCount + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return saveToDatabase(data, retryCount + 1);
        }
        
        // Don't show toast for duplicate key errors (they're handled by upsert)
        if (error.code !== '23505') {
          toast.error(`Failed to sync ${profileType} profile to cloud`);
        }
        return false;
      } else {
        setLastSaved(new Date());
        // Update cache with fresh data
        cachedDataByType.set(profileType, data);
        console.log(`Saved ${profileType} profile to database successfully`);
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

  // Unified save function with optimistic updates
  const saveData = useCallback(async (newData: Partial<ProfileData>) => {
    if (!newData || Object.keys(newData).length === 0) {
      return;
    }
    
    const currentData = profileData || {};
    const updatedData = { ...currentData, ...newData };
    
    // Optimistic update
    setProfileData(updatedData);
    
    // Save to localStorage immediately (fast backup)
    saveToStorage(updatedData);
    
    // Save to database with fallback
    if (user) {
      const success = await saveToDatabase(updatedData);
      if (!success) {
        console.warn(`Database save failed for ${profileType}, data preserved locally`);
      }
    }
  }, [profileData, saveToStorage, saveToDatabase, user, profileType]);

  // Field update helpers
  const updateField = useCallback((field: string, value: any) => {
    saveData({ [field]: value });
  }, [saveData]);

  const handleMultiSelect = useCallback((field: string, value: string) => {
    const currentValues = (profileData[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateField(field, newValues);
  }, [profileData, updateField]);

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
          if (isMeaningfullyFilled(dbData)) {
            // Use intelligent merge that prefers non-empty values
            setProfileData(prev => {
              const merged = mergePreferNonEmpty(prev, dbData);
              saveToStorage(merged);
              return merged;
            });
          } else if (isMeaningfullyFilled(localData)) {
            // Migrate local data to database if it's meaningful
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

  // Periodic sync for data consistency (every 5 minutes when user is active)
  useEffect(() => {
    if (!user || !isReady) return;

    const syncInterval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        try {
          const dbData = await loadFromDatabase();
          const localData = loadFromStorage();
          
          // Check if data is out of sync
          const localString = JSON.stringify(localData);
          const dbString = JSON.stringify(dbData);
          
          if (localString !== dbString && Object.keys(dbData).length > 0) {
            setProfileData(dbData);
            saveToStorage(dbData);
          }
        } catch (error) {
          console.error(`Error during periodic sync for ${profileType}:`, error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [user, isReady, loadFromDatabase, loadFromStorage, saveToStorage, profileType]);

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