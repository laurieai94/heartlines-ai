import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    databaseColumn: 'profile_data'
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

  // Load from localStorage with error handling
  const loadFromStorage = useCallback((): ProfileData => {
    try {
      const localData = localStorage.getItem(config.localStorage);
      if (localData) {
        const parsed = JSON.parse(localData);
        return parsed || {};
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

  // Load from database with error handling
  const loadFromDatabase = useCallback(async (): Promise<ProfileData> => {
    if (!user) return {};

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`${config.databaseColumn}`)
        .eq('user_id', user.id)
        .eq('profile_type', profileType === 'personal' ? 'your' : 'partner')
        .maybeSingle();

      if (error) {
        console.error(`Database load error for ${profileType}:`, error);
        return {};
      }

      if (data && data[config.databaseColumn]) {
        const dbData = typeof data[config.databaseColumn] === 'object' && data[config.databaseColumn] !== null 
          ? data[config.databaseColumn] 
          : {};
        
        return dbData;
      }
    } catch (error) {
      console.error(`Error loading ${profileType} profile from database:`, error);
    }
    return {};
  }, [user, config.databaseColumn, profileType]);

  // Save to database with error handling and retry
  const saveToDatabase = useCallback(async (data: ProfileData, retryCount = 0): Promise<boolean> => {
    if (!user) return false;

    try {
      const upsertData = {
        user_id: user.id,
        profile_type: profileType === 'personal' ? 'your' : 'partner',
        [config.databaseColumn]: data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(upsertData);
      
      if (error) {
        console.error(`Database save error for ${profileType}:`, error);
        
        // Retry logic for transient errors
        if (retryCount < 2 && error.code !== '23505') { // Don't retry constraint violations
          console.log(`Retrying database save for ${profileType}, attempt ${retryCount + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return saveToDatabase(data, retryCount + 1);
        }
        
        toast.error(`Failed to sync ${profileType} profile to cloud`);
        return false;
      } else {
        setLastSaved(new Date());
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

  // Data migration when user authenticates
  const migrateLocalToDatabase = useCallback(async () => {
    if (!user) return;

    const localData = loadFromStorage();
    if (Object.keys(localData).length > 0) {
      console.log(`Migrating ${profileType} profile data to database`);
      await saveToDatabase(localData);
    }
  }, [user, loadFromStorage, saveToDatabase, profileType]);

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
          if (Object.keys(dbData).length > 0) {
            // Merge database data (authoritative) with local data
            setProfileData(prev => {
              const merged = { ...prev, ...dbData };
              saveToStorage(merged);
              return merged;
            });
          } else if (Object.keys(localData).length > 0) {
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
  }, [user, profileType, loadFromStorage, loadFromDatabase, saveToStorage, migrateLocalToDatabase, recoverFromDatabase]);

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