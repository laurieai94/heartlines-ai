import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { debounce } from '@/utils/throttle';

export type ProfileType = 'personal' | 'partner';

// Simplified profile interfaces
export interface PersonalProfileOptimized {
  name: string;
  age: string;
  gender: string[];
  orientation: string[];
  pronouns: string;
  relationshipStatus: string;
  relationshipLength: string;
  stressResponse: string[];
  conflictStyle: string[];
  loveLanguage: string[];
  heartbreakBetrayal: string[];
  familyStructure: string[];
  attachmentStyle: string;
  lastUpdated: string;
  version: string;
}

export interface PartnerProfileOptimized {
  partnerName: string;
  partnerPronouns: string;  
  partnerAge: string;
  partnerOrientation: string;
  partnerGender: string[];
  partnerLoveLanguage: string[];
  partnerConflictStyle: string[];
  partnerAttachmentStyle: string;
  lastUpdated: string;
  version: string;
}

// Default profiles with minimal required fields
const defaultPersonalProfile: PersonalProfileOptimized = {
  name: '', age: '', gender: [], orientation: [], pronouns: '',
  relationshipStatus: '', relationshipLength: '',
  stressResponse: [], conflictStyle: [], loveLanguage: [],
  heartbreakBetrayal: [], familyStructure: [], attachmentStyle: '',
  lastUpdated: '', version: '3.0'
};

const defaultPartnerProfile: PartnerProfileOptimized = {
  partnerName: '', partnerPronouns: '', partnerAge: '', partnerOrientation: '', partnerGender: [],
  partnerLoveLanguage: [], partnerConflictStyle: [], partnerAttachmentStyle: '',
  lastUpdated: '', version: '3.0'
};

// Lightweight storage configuration
const STORAGE_CONFIG = {
  personal: { key: 'personal_profile_v3', dbType: 'your' as const },
  partner: { key: 'partner_profile_v3', dbType: 'partner' as const }
};

// Circuit breaker to prevent concurrent operations
const activeOperations = new Set<string>();

export const useOptimizedProfileStore = (profileType: ProfileType) => {
  const { user } = useAuth();
  const config = STORAGE_CONFIG[profileType];
  const defaultProfile = profileType === 'personal' ? defaultPersonalProfile : defaultPartnerProfile;
  
  // Simplified state management
  const [profile, setProfile] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Refs for optimization
  const mountedRef = useRef(true);
  const lastSyncRef = useRef<number>(0);
  
  // Memoized profile data to prevent unnecessary re-renders
  const memoizedProfile = useMemo(() => profile, [profile]);
  
  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Optimized storage operations
  const loadFromStorage = useCallback((): typeof defaultProfile => {
    try {
      const stored = localStorage.getItem(config.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultProfile, ...parsed };
      }
    } catch (error) {
      console.error(`Storage load error:`, error);
    }
    return defaultProfile;
  }, [config.key, defaultProfile]);
  
  const saveToStorage = useCallback((data: typeof defaultProfile) => {
    if (!mountedRef.current) return;
    
    try {
      const toSave = { ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem(config.key, JSON.stringify(toSave));
    } catch (error) {
      console.error(`Storage save error:`, error);
    }
  }, [config.key]);
  
  // Debounced database sync with circuit breaker
  const syncToDatabase = useMemo(
    () => debounce(async (updates: Partial<typeof defaultProfile>) => {
      if (!user || !mountedRef.current) return;
      
      const operationKey = `${user.id}-${profileType}`;
      if (activeOperations.has(operationKey)) return;
      
      // Rate limiting: prevent syncs more frequent than every 2 seconds
      const now = Date.now();
      if (now - lastSyncRef.current < 2000) return;
      
      activeOperations.add(operationKey);
      setIsSyncing(true);
      lastSyncRef.current = now;
      
      try {
        await supabase.rpc('upsert_user_profile_patch', {
          p_profile_type: config.dbType,
          p_patch: updates
        });
      } catch (error) {
        console.error(`Database sync error:`, error);
      } finally {
        activeOperations.delete(operationKey);
        if (mountedRef.current) {
          setIsSyncing(false);
        }
      }
    }, 2000),
    [user, profileType, config.dbType]
  );
  
  // Initialize profile data
  useEffect(() => {
    const initialize = async () => {
      if (!mountedRef.current) return;
      
      setIsLoading(true);
      
      // Load from localStorage immediately
      const localProfile = loadFromStorage();
      setProfile(localProfile);
      setIsReady(true);
      setIsLoading(false);
      
      // Sync with database in background if user is authenticated
      if (user) {
        try {
          const { data } = await supabase
            .from('user_profiles')
            .select('profile_data')
            .eq('user_id', user.id)
            .eq('profile_type', config.dbType)
            .single();
            
          if (data?.profile_data && mountedRef.current) {
            const dbProfile = { ...defaultProfile, ...(data.profile_data as Partial<typeof defaultProfile>) };
            setProfile(dbProfile);
            saveToStorage(dbProfile);
          }
        } catch (error) {
          // Non-critical error, continue with local data
          console.warn(`Background sync error:`, error);
        }
      }
    };
    
    initialize();
  }, [user, config.dbType, defaultProfile, loadFromStorage, saveToStorage]);
  
  // Optimized update functions
  const updateField = useCallback((field: string, value: any) => {
    if (!mountedRef.current) return;
    
    const updates = { [field]: value } as Partial<typeof defaultProfile>;
    
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveToStorage(updated);
      syncToDatabase(updates);
      return updated;
    });
  }, [saveToStorage, syncToDatabase]);
  
  const handleMultiSelect = useCallback((field: string, value: string) => {
    if (!mountedRef.current) return;
    
    setProfile(prev => {
      const currentArray = (prev as any)[field] || [];
      const updated = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      const newProfile = { ...prev, [field]: updated };
      saveToStorage(newProfile);
      syncToDatabase({ [field]: updated });
      return newProfile;
    });
  }, [saveToStorage, syncToDatabase]);
  
  const saveData = useCallback(async (updates: Partial<typeof defaultProfile>) => {
    if (!mountedRef.current) return;
    
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveToStorage(updated);
      syncToDatabase(updates);
      return updated;
    });
  }, [saveToStorage, syncToDatabase]);
  
  return {
    profileData: memoizedProfile,
    isLoading,
    isReady,
    isSyncing,
    updateField,
    handleMultiSelect,
    saveData
  };
};