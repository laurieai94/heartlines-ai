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
  const { user } = useAuth();
  const config = STORAGE_CONFIG[profileType];
  const defaultProfile = profileType === 'personal' ? defaultPersonalProfile : defaultPartnerProfile;
  
  // EMERGENCY: Circuit breaker to prevent multiple concurrent operations
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  
  // Instance tracking
  const instanceId = useRef<string>(`${profileType}-${Date.now()}-${Math.random()}`);
  const isPrimaryInstance = useRef<boolean>(false);
  
  const [profile, setProfile] = useState<PersonalProfileV2 | PartnerProfileV2>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const pendingUpdates = useRef<Partial<PersonalProfileV2 | PartnerProfileV2>>({});
  
  // Register this instance and determine if it's primary
  useEffect(() => {
    const instanceCount = HOOK_INSTANCES.get(profileType) || 0;
    HOOK_INSTANCES.set(profileType, instanceCount + 1);
    isPrimaryInstance.current = instanceCount === 0;
    
    console.log(`[ProfileV2-${profileType}] Instance ${instanceId.current} registered (primary: ${isPrimaryInstance.current})`);
    
    return () => {
      const currentCount = HOOK_INSTANCES.get(profileType) || 1;
      HOOK_INSTANCES.set(profileType, Math.max(0, currentCount - 1));
    };
  }, [profileType]);

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
    
    // Apply legacy field mappings for personal profiles
    if (profileType === 'personal') {
      Object.entries(PERSONAL_LEGACY_MAPPINGS).forEach(([oldKey, newKey]) => {
        if (migrated[oldKey] && !migrated[newKey]) {
          migrated[newKey] = migrated[oldKey];
          delete migrated[oldKey];
        }
      });
    }
    
    // Apply partner profile data normalization
    if (profileType === 'partner') {
      // Ensure partnerOrientation is a string (not array)
      if (Array.isArray(migrated.partnerOrientation)) {
        migrated.partnerOrientation = migrated.partnerOrientation[0] || '';
      }
      
      // Ensure array fields are arrays
      const arrayFields = [
        'partnerGender', 'partnerLoveLanguage', 'partnerConflictStyle', 
        'partnerCommunicationResponse', 'partnerHeartbreakBetrayal', 'partnerFamilyStructure'
      ];
      
      arrayFields.forEach(field => {
        if (migrated[field] && !Array.isArray(migrated[field])) {
          // Convert string to array
          migrated[field] = [migrated[field]];
        } else if (!migrated[field]) {
          // Ensure field exists as empty array
          migrated[field] = [];
        }
      });
      
      // Ensure string fields are strings
      const stringFields = ['partnerName', 'partnerPronouns', 'partnerAge', 'partnerOrientation', 'partnerSelfAwareness', 'partnerAttachmentStyle'];
      stringFields.forEach(field => {
        if (Array.isArray(migrated[field])) {
          migrated[field] = migrated[field][0] || '';
        } else if (!migrated[field]) {
          migrated[field] = '';
        }
      });
    }
    
    return migrated;
  }, [profileType]);

  // Optimized storage loading with migration optimization
  const loadFromStorage = useCallback((): PersonalProfileV2 | PartnerProfileV2 => {
    // Fast path: Check migration sentinel first to avoid unnecessary processing
    const migrationSentinel = localStorage.getItem(`${config.storageKey}_migrated`);
    
    try {
      // Try new format first
      const v2Data = localStorage.getItem(config.storageKey);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        return { ...defaultProfile, ...parsed };
      }
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] V2 storage load error:`, error);
    }

    // Early exit if migration already completed
    if (migrationSentinel) {
      return defaultProfile;
    }

    // Try legacy formats for one-time promotion
    for (const key of config.legacyKeys) {
      try {
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          if (parsed && Object.keys(parsed).length > 0) {
            console.log(`🔄 One-time promotion: Migrating ${profileType} profile from legacy key: ${key}`);
            
            // Migrate and enhance with V2 metadata
            const migrated = migrateLegacyData(parsed);
            const now = new Date().toISOString();
            const fullProfile = { 
              ...defaultProfile, 
              ...migrated, 
              lastUpdated: now,
              version: '2.0' 
            };
            
            // Save migrated data to V2 storage
            localStorage.setItem(config.storageKey, JSON.stringify(fullProfile));
            
            // Create migration sentinel
            localStorage.setItem(`${config.storageKey}_migrated`, JSON.stringify({
              from: key,
              at: now
            }));
            
            // Optional cleanup of legacy keys (partner profiles only for now)
            const CLEANUP_LEGACY = profileType === 'partner';
            if (CLEANUP_LEGACY) {
              try {
                config.legacyKeys.forEach(legacyKey => {
                  if (localStorage.getItem(legacyKey)) {
                    localStorage.removeItem(legacyKey);
                    console.log(`🧹 Cleaned up legacy key: ${legacyKey}`);
                  }
                });
              } catch (cleanupError) {
                console.warn(`Non-critical: Failed to cleanup some legacy keys:`, cleanupError);
              }
            }
            
            console.log(`✅ Successfully promoted ${profileType} profile to V2 storage from ${key}${CLEANUP_LEGACY ? ' (cleaned legacy keys)' : ''}`);
            
            // Note: Immediate DB sync will be triggered by the useEffect after this returns
            return fullProfile;
          }
        }
      } catch (error) {
        console.error(`[ProfileV2-${profileType}] Migration error from ${key}:`, error);
      }
    }
    
    console.log(`[ProfileV2-${profileType}] No existing data found, using defaults`);
    return defaultProfile;
  }, [config, defaultProfile, migrateLegacyData, profileType]);

  // Save to localStorage (immediate) + broadcast in-tab update
  const saveToStorage = useCallback((data: PersonalProfileV2 | PartnerProfileV2) => {
    try {
      const toSave = { ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem(config.storageKey, JSON.stringify(toSave));
      setLastSaved(new Date());
      // Broadcast to other hook instances in this tab
      window.dispatchEvent(new CustomEvent(IN_TAB_PROFILE_UPDATE_EVENT, {
        detail: { profileType, storageKey: config.storageKey, lastUpdated: toSave.lastUpdated }
      }));
      console.log(`[ProfileV2-${profileType}] Saved to localStorage & broadcasted:`, toSave);
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

      // Only update timestamp and version from server, preserve local changes
      if (data && typeof data === 'object') {
        setLastSaved(new Date());
        console.log(`[ProfileV2-${profileType}] Synced to database successfully`);
        
        // Only merge server data if it doesn't conflict with recent local updates
        // This prevents the server from overwriting fields the user just modified
        setProfile(prev => {
          const serverProfile = { ...defaultProfile, ...(data as any), version: '2.0' };
          
          // Preserve local changes that were just made
          const preservedProfile = { ...serverProfile };
          Object.keys(updates).forEach(key => {
            if (prev[key] !== undefined) {
              preservedProfile[key] = prev[key];
            }
          });
          
          saveToStorage(preservedProfile);
          console.log(`[ProfileV2-${profileType}] Preserved local changes:`, Object.keys(updates));
          return preservedProfile;
        });
      }
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Database sync error:`, error);
    }
  }, [user, config.dbType, defaultProfile, saveToStorage, profileType]);

  // Add flush method to syncToDatabase for immediate execution
  (syncToDatabase as any).flush = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      const toSync = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      syncToDatabase(toSync);
    }
  };

  // Intelligent database loading with caching
  const loadFromDatabase = useCallback(async (): Promise<PersonalProfileV2 | PartnerProfileV2> => {
    if (!user) return defaultProfile;

    // Check cache first
    const cacheKey = `${user.id}-${config.dbType}`;
    const cached = DB_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`[ProfileV2-${profileType}] Using cached database data`);
      return cached.data;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_data, demographics_data')
        .eq('user_id', user.id)
        .eq('profile_type', config.dbType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      let result = defaultProfile;
      if (data) {
        const profileData = (data.profile_data && typeof data.profile_data === 'object') ? data.profile_data : {};
        const demographicsData = (data.demographics_data && typeof data.demographics_data === 'object') ? data.demographics_data : {};
        
        const merged = { 
          ...(profileData as any), 
          ...(demographicsData as any) 
        };
        const migrated = migrateLegacyData(merged);
        result = { ...defaultProfile, ...migrated, version: '2.0' };
      }

      // Cache the result
      DB_CACHE.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: CACHE_TTL
      });

      return result;
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Database load error:`, error);
    }

    return defaultProfile;
  }, [user, config.dbType, defaultProfile, migrateLegacyData, profileType]);

  // Initialize and load data with performance optimizations
  useEffect(() => {
    const initialize = async () => {
      console.log(`[ProfileV2-${profileType}] Starting optimized initialization...`);
      setIsLoading(true);
      
      try {
        // Load from localStorage first (instant) - use requestIdleCallback for non-critical work
        const localProfile = loadFromStorage();
        setProfile(localProfile);
        setIsReady(true);
        setIsLoading(false); // UI can render immediately with local data
        console.log(`[ProfileV2-${profileType}] Local profile loaded, UI ready`);
        
        // Defer database sync to not block the main thread
        if (user && isPrimaryInstance.current) {
          // Use requestIdleCallback to defer database operations
          const deferredSync = () => {
            setIsSyncing(true);
            console.log(`[ProfileV2-${profileType}] Starting deferred database sync...`);
            
            // Use timeout with lower priority
            setTimeout(async () => {
              try {
                const dbProfile = await loadFromDatabase();
                
                // Merge local and remote, preferring newer data
                const localTime = new Date(localProfile.lastUpdated || 0).getTime();
                const dbTime = new Date(dbProfile.lastUpdated || 0).getTime();
                
                const finalProfile = dbTime > localTime ? dbProfile : localProfile;
                
                // Use React transition for non-urgent updates
                setTimeout(() => {
                  setProfile(finalProfile);
                  saveToStorage(finalProfile);
                  setIsSyncing(false);
                  console.log(`[ProfileV2-${profileType}] Deferred database sync completed`);
                }, 0);
              } catch (dbError) {
                console.error(`[ProfileV2-${profileType}] Database sync failed:`, dbError);
                setIsSyncing(false);
              }
            }, 100); // Small delay to let UI render first
          };
          
          // Use requestIdleCallback if available, otherwise setTimeout
          if ('requestIdleCallback' in window) {
            requestIdleCallback(deferredSync, { timeout: 2000 });
          } else {
            setTimeout(deferredSync, 50);
          }
        } else {
          console.log(`[ProfileV2-${profileType}] Skipping database sync (no user or non-primary instance)`);
        }
      } catch (error) {
        console.error(`[ProfileV2-${profileType}] Initialization error:`, error);
        setProfile(defaultProfile);
        setIsReady(true);
        setIsLoading(false);
        setIsSyncing(false);
      }
    };

    // Mobile-optimized safety timeout to prevent aggressive loading states
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const timeoutDelay = isMobile ? 15000 : 8000; // Much more generous timeout on mobile
    
    const safetyTimeout = setTimeout(() => {
      console.warn(`[ProfileV2-${profileType}] Safety timeout triggered - forcing states to complete`);
      setIsLoading(false);
      setIsSyncing(false);
      if (!isReady) {
        setIsReady(true);
        setProfile(defaultProfile);
      }
    }, timeoutDelay);

    initialize();
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [user, loadFromStorage, loadFromDatabase, saveToStorage, defaultProfile, profileType, isReady]);

  // Listen for in-tab and cross-tab profile updates to keep instances in sync
  useEffect(() => {
    const applyLatestFromStorage = (raw: string | null) => {
      try {
        const json = raw ?? localStorage.getItem(config.storageKey);
        if (!json) return;
        const parsed = JSON.parse(json);
        const currentTs = new Date((profile as any).lastUpdated || 0).getTime();
        const incomingTs = new Date(parsed.lastUpdated || 0).getTime();
        if (incomingTs > currentTs) {
          const merged = { ...parsed, version: '2.0' } as any;
          setProfile(merged);
          setLastSaved(new Date());
          setIsReady(true);
          console.log(`[ProfileV2-${profileType}] State updated from external change (ts ${incomingTs})`);
        }
      } catch (e) {
        console.warn(`[ProfileV2-${profileType}] Failed to apply external update`, e);
      }
    };

    // Debounced and filtered external updates to prevent race conditions
    const debouncedApplyUpdate = debounce(applyLatestFromStorage, 50);

    const onCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (detail.profileType !== profileType || detail.storageKey !== config.storageKey) return;
      
      // Prevent self-triggered updates and only apply if data is actually newer
      const currentTime = new Date((profile as any).lastUpdated || 0).getTime();
      const incomingTime = new Date(detail.lastUpdated || 0).getTime();
      if (incomingTime > currentTime) {
        debouncedApplyUpdate(null);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === config.storageKey && e.newValue) {
        applyLatestFromStorage(e.newValue);
      }
    };

    window.addEventListener(IN_TAB_PROFILE_UPDATE_EVENT, onCustomEvent as EventListener);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(IN_TAB_PROFILE_UPDATE_EVENT, onCustomEvent as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [config.storageKey, defaultProfile, profileType, profile]);

  // Clear profile data
  const clearProfile = useCallback(async () => {
    try {
      console.log(`[ProfileV2-${profileType}] Clearing profile data...`);
      
      // Clear from localStorage
      localStorage.removeItem(config.storageKey);
      
      // Clear from database if user is authenticated
      if (user) {
        await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', user.id)
          .eq('profile_type', config.dbType);
      }
      
      // Reset to default profile
      setProfile(defaultProfile);
      saveToStorage(defaultProfile);
      setLastSaved(new Date());
      
      // Broadcast the clear to other tabs/components
      window.dispatchEvent(new CustomEvent(IN_TAB_PROFILE_UPDATE_EVENT, {
        detail: { profileType, storageKey: config.storageKey, lastUpdated: new Date().toISOString() }
      }));
      
      console.log(`[ProfileV2-${profileType}] Profile cleared successfully`);
    } catch (error) {
      console.error(`[ProfileV2-${profileType}] Error clearing profile:`, error);
      throw error;
    }
  }, [profileType, config.storageKey, config.dbType, user, defaultProfile, saveToStorage]);

  // Listen for global refresh and clear events
  useEffect(() => {
    const handleForceReload = async (event: CustomEvent) => {
      const { profileType: targetType } = event.detail;
      
      if (targetType === 'all' || targetType === profileType) {
        if (!user) return;
        
        try {
          setIsSyncing(true);
          const dbData = await loadFromDatabase();
          if (Object.keys(dbData).length > 0) {
            const refreshedData = { ...defaultProfile, ...dbData };
            setProfile(refreshedData);
            saveToStorage(refreshedData);
            setLastSaved(new Date());
          }
        } catch (error) {
          console.error(`Error refreshing ${profileType} profile:`, error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    const handleClearProfile = async (event: CustomEvent) => {
      const { profileType: targetType } = event.detail;
      
      if (targetType === 'all' || targetType === profileType) {
        try {
          await clearProfile();
        } catch (error) {
          console.error(`Error clearing ${profileType} profile:`, error);
        }
      }
    };

    window.addEventListener('profile:forceReload', handleForceReload as EventListener);
    window.addEventListener('profile:clear', handleClearProfile as EventListener);
    
    return () => {
      window.removeEventListener('profile:forceReload', handleForceReload as EventListener);
      window.removeEventListener('profile:clear', handleClearProfile as EventListener);
    };
  }, [user, profileType, loadFromDatabase, saveToStorage, defaultProfile, clearProfile]);

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

  // Handle multi-select with functional updates to prevent stale state
  const handleMultiSelect = useCallback((field: string, value: string) => {
    console.log(`[ProfileStore] Multi-select ${field}:`, value);
    
    // Use functional update to get fresh state
    setProfile(currentProfile => {
      const current = (currentProfile as any)[field] as string[] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      console.log(`[ProfileStore] ${field} updated:`, current, '->', updated);
      
      const newProfile = { ...currentProfile, [field]: updated };
      
      // Immediate storage update
      saveToStorage(newProfile);
      
      // Trigger debounced database sync
      pendingUpdates.current = { ...pendingUpdates.current, [field]: updated };
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        const toSync = { ...pendingUpdates.current };
        pendingUpdates.current = {};
        syncToDatabase(toSync);
      }, DEBOUNCE_MS);
      
      return newProfile;
    });
  }, [saveToStorage, syncToDatabase]);

  return {
    profileData: profile,
    isLoading,
    isReady,
    isSyncing: isSyncing || false,
    updateField,
    handleMultiSelect,
    saveData: updateProfile,
    clearProfile,
    lastSaved
  };
};