import { useState, useEffect, useCallback, useRef, useDeferredValue } from 'react';
import { flushSync } from 'react-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceSafeguards } from './usePerformanceSafeguards';
import { safeLog } from '@/utils/safeLogging';
import { batchedStorage } from '@/utils/batchedStorage';
import { profileCompletionCache, validationCache } from '@/utils/calculationCache';

// Global instance tracking to prevent conflicts
const HOOK_INSTANCES = new Map<string, number>();
const DB_CACHE = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

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

// Helper function to get user-specific storage keys
const getUserStorageKey = (baseKey: string, userId: string | undefined): string => {
  if (!userId) return baseKey; // Fallback for when user isn't loaded yet
  return `${baseKey}_${userId}`;
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

const DEBOUNCE_MS = 300; // Reduced for faster data persistence
const IN_TAB_PROFILE_UPDATE_EVENT = 'profile:updated';
const RECENT_MODIFICATION_THRESHOLD = 10000; // 10 seconds

export const useProfileStoreV2 = (profileType: ProfileType, partnerProfileId?: string) => {
  const { user } = useAuth();
  const config = STORAGE_CONFIG[profileType];
  const defaultProfile = profileType === 'personal' ? defaultPersonalProfile : defaultPartnerProfile;
  
  // SIMPLIFIED: Removed complex instance tracking and circuit breakers
  const [profile, setProfile] = useState<PersonalProfileV2 | PartnerProfileV2>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const pendingUpdates = useRef<Partial<PersonalProfileV2 | PartnerProfileV2>>({});
  
  // Track recently modified fields to protect them during merge
  const recentlyModifiedFields = useRef<Map<string, number>>(new Map());
  const intentionallyDeletedFields = useRef<Set<string>>(new Set());

  // SIMPLIFIED: Removed complex instance tracking for performance

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
    // CRITICAL: If no user is authenticated, return default profile
    // This prevents loading another user's data before authentication completes
    if (!user) {
      return defaultProfile;
    }
    
    // Get user-specific storage key (partner-profile-aware)
    const baseKey = getUserStorageKey(config.storageKey, user.id);
    const userStorageKey = profileType === 'partner' && partnerProfileId 
      ? `${baseKey}_${partnerProfileId}` 
      : baseKey;
    const userMigrationKey = getUserStorageKey(`${config.storageKey}_migrated`, user.id);
    
    // Fast path: Check migration sentinel first to avoid unnecessary processing
    const migrationSentinel = batchedStorage.getItem(userMigrationKey);
    
    // MIGRATION: Check for old non-user-specific data and migrate it
    const oldNonUserKey = config.storageKey;
    const oldData = batchedStorage.getItem(oldNonUserKey);
    if (oldData && !batchedStorage.getItem(userStorageKey)) {
      // Migrate old non-user-specific data to new user-specific key
      try {
        const parsed = JSON.parse(oldData);
        if (parsed && Object.keys(parsed).length > 0) {
          batchedStorage.setItem(userStorageKey, oldData);
          batchedStorage.removeItem(oldNonUserKey); // Clean up old key
          safeLog.info(`Migrated ${profileType} profile to user-specific storage`);
        }
      } catch (error) {
        // Silent fail on migration error
      }
    }
    
    try {
      // Try new format first (with metadata)
      const v2Data = batchedStorage.getItem(userStorageKey);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        
        // Check if it's new format with metadata
        if (parsed.profile && Array.isArray(parsed.deletionMarkers)) {
          // Restore deletion markers
          intentionallyDeletedFields.current = new Set(parsed.deletionMarkers);
          // Preserve _updateTimestamp from storage
          return { 
            ...defaultProfile, 
            ...parsed.profile,
            ...(parsed.profile._updateTimestamp ? { _updateTimestamp: parsed.profile._updateTimestamp } : {})
          };
        }
        
        // Old format (direct profile object) - preserve _updateTimestamp if present
        return { 
          ...defaultProfile, 
          ...parsed,
          ...(parsed._updateTimestamp ? { _updateTimestamp: parsed._updateTimestamp } : {})
        };
      }
    } catch (error) {
      // Silent fail
    }

    // Early exit if migration already completed
    if (migrationSentinel) {
      return defaultProfile;
    }

    // Try legacy formats for one-time promotion
    for (const key of config.legacyKeys) {
      try {
        const legacyData = batchedStorage.getItem(key);
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          if (parsed && Object.keys(parsed).length > 0) {
            // Migrate and enhance with V2 metadata
            const migrated = migrateLegacyData(parsed);
            const now = new Date().toISOString();
            const fullProfile = { 
              ...defaultProfile, 
              ...migrated, 
              lastUpdated: now,
              version: '2.0' 
            };
            
            // Save migrated data to V2 storage (user-specific)
            batchedStorage.setItem(userStorageKey, JSON.stringify(fullProfile));
            
            // Create migration sentinel (user-specific)
            batchedStorage.setItem(userMigrationKey, JSON.stringify({
              from: key,
              at: now
            }));
            
            // Optional cleanup of legacy keys (partner profiles only for now)
            const CLEANUP_LEGACY = profileType === 'partner';
            if (CLEANUP_LEGACY) {
              try {
                config.legacyKeys.forEach(legacyKey => {
                  if (batchedStorage.getItem(legacyKey)) {
                    batchedStorage.removeItem(legacyKey);
                  }
                });
              } catch (cleanupError) {
                // Silent fail
              }
            }
            
            safeLog.info(`Loaded ${profileType} profile from database successfully`);
            
            // Note: Immediate DB sync will be triggered by the useEffect after this returns
            return fullProfile;
          }
        }
    } catch (error) {
      // Silently handle migration errors
    }
    }
    
    safeLog.info(`No existing ${profileType} data found, using defaults`);
    return defaultProfile;
  }, [config, defaultProfile, migrateLegacyData, profileType, user, partnerProfileId]);

  // Save to localStorage (immediate) + broadcast in-tab update
  const saveToStorage = useCallback((data: PersonalProfileV2 | PartnerProfileV2) => {
      // Don't save if no user is authenticated
      if (!user) {
        return;
      }
      
      try {
        // Get user-specific storage key (partner-profile-aware)
        const baseKey = getUserStorageKey(config.storageKey, user.id);
        const userStorageKey = profileType === 'partner' && partnerProfileId 
          ? `${baseKey}_${partnerProfileId}` 
          : baseKey;
        const metadata = {
          profile: { 
            ...data, 
            lastUpdated: new Date().toISOString(),
            // Explicitly preserve _updateTimestamp (client-only field)
            ...((data as any)._updateTimestamp ? { _updateTimestamp: (data as any)._updateTimestamp } : {})
          },
          deletionMarkers: Array.from(intentionallyDeletedFields.current),
          lastSaved: new Date().toISOString()
        };
        
        batchedStorage.setItem(userStorageKey, JSON.stringify(metadata));
        setLastSaved(new Date());
        
        // CRITICAL: Clear all caches immediately when saving to localStorage
        try {
          const { profileCompletionCache, validationCache, requirementCache } = require('@/utils/calculationCache');
          profileCompletionCache?.clear();
          validationCache?.clear();
          requirementCache?.clear();
        } catch (e) {
          // Cache module not ready yet
        }
        
        // Dispatch event after render completes
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated'));
        });
        
        // Broadcast to other hook instances in this tab
        window.dispatchEvent(new CustomEvent(IN_TAB_PROFILE_UPDATE_EVENT, {
          detail: { profileType, storageKey: config.storageKey, lastUpdated: metadata.profile.lastUpdated }
        }));
      } catch (error) {
        // Silently handle storage errors
      }
  }, [config.storageKey, profileType, user, partnerProfileId]);

  // SIMPLIFIED: Direct sync to Supabase without timeout protection
  const syncToDatabase = useCallback(async (updates: Partial<PersonalProfileV2 | PartnerProfileV2>) => {
    if (!user) return;
    
    try {
      
      // Build RPC params - include partner_profile_id for partner profiles
      let rpcResult;
      if (profileType === 'partner' && partnerProfileId) {
        rpcResult = await supabase.rpc('upsert_user_profile_patch', {
          p_profile_type: config.dbType,
          p_patch: updates,
          p_partner_profile_id: partnerProfileId
        });
      } else {
        rpcResult = await supabase.rpc('upsert_user_profile_patch', {
          p_profile_type: config.dbType,
          p_patch: updates
        });
      }

      const { data, error } = rpcResult;

      if (error) {
        // Only log error message, not full object
        safeLog.error(`Database sync failed for ${profileType}:`, error.message);
        
        // Restore pending updates on failure
        Object.assign(pendingUpdates.current, updates);
        
        return;
      }

      // Only update timestamp and version from server, preserve local changes
      if (data && typeof data === 'object') {
        setLastSaved(new Date());
        
        // Only merge server data if it doesn't conflict with recent local updates
        // This prevents the server from overwriting fields the user just modified
        setProfile(prev => {
          const serverProfile = { ...defaultProfile, ...(data as any), version: '2.0' };
          
          // Start with server data
          const preservedProfile = { ...serverProfile };
          
          // PRESERVE _updateTimestamp from previous state (client-only field)
          if ((prev as any)._updateTimestamp) {
            (preservedProfile as any)._updateTimestamp = (prev as any)._updateTimestamp;
          }
          
          // Track if any required fields were updated
          const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
          let hasRequiredFieldUpdate = false;
          
          // Override with the exact values we just sent (not prev which may be stale)
          Object.keys(updates).forEach(key => {
            preservedProfile[key] = updates[key]; // Use NEW value from updates, not old value from prev
            
            // Track required field updates
            if (requiredFields.includes(key)) {
              hasRequiredFieldUpdate = true;
            }
            
            // Keep deletion marker if the value is still empty (deletion confirmed)
            const isEmpty = updates[key] === '' || updates[key] === null || updates[key] === undefined ||
                            (Array.isArray(updates[key]) && updates[key].length === 0);
            if (!isEmpty) {
              // Only remove deletion marker if user filled in a value
              intentionallyDeletedFields.current.delete(key);
            }
          });
          
          // If required fields were updated, ensure fresh timestamp
          if (hasRequiredFieldUpdate) {
            (preservedProfile as any)._updateTimestamp = Date.now();
          }
          
          // Also protect any fields modified in the last 5 seconds
          const now = Date.now();
          recentlyModifiedFields.current.forEach((timestamp, field) => {
            if (now - timestamp < 5000 && prev[field as keyof typeof prev] !== undefined) {
              // Keep local version if modified recently
              preservedProfile[field as keyof typeof preservedProfile] = prev[field as keyof typeof prev];
            }
          });
          
          saveToStorage(preservedProfile);
          
          // Clear all caches immediately to ensure validation updates
          profileCompletionCache?.clear();
          validationCache?.clear();
          
          // Also clear requirement cache
          try {
            const { requirementCache } = require('@/utils/calculationCache');
            requirementCache?.clear();
          } catch (e) {
            // Cache not ready yet, skip clearing
          }
          
          return preservedProfile;
        });
        
        // Warm the completion cache with the merged profile (not raw DB data)
        // This ensures deletions are properly reflected in the cache
        const { calculateProgress } = await import('@/components/NewPersonalQuestionnaire/utils/validation');
        const { calculatePartnerProgress } = await import('@/components/NewPartnerProfile/utils/partnerValidation');
        
        // Get current profile state which has correct merged values including deletions
        const currentState = await new Promise<typeof defaultProfile>(resolve => {
          setProfile(current => {
            resolve(current);
            return current;
          });
        });
        
        const completion = profileType === 'personal' 
          ? calculateProgress(currentState as any)
          : calculatePartnerProgress(currentState as any);
        
        profileCompletionCache.set(
          profileType === 'personal' ? 'personal' : 'partner',
          currentState,
          completion
        );
      }
    } catch (error: any) {
      // Safe error logging without object serialization
      safeLog.error(`Database sync error for ${profileType}:`, error?.message || 'Unknown error');
      
      // Restore pending updates on failure
      Object.assign(pendingUpdates.current, updates);
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

    // Check cache first - include partnerProfileId for partner profiles
    const cacheKey = profileType === 'partner' && partnerProfileId
      ? `${user.id}-${config.dbType}-${partnerProfileId}`
      : `${user.id}-${config.dbType}`;
    const cached = DB_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      // Fetch from database - filter by partner_profile_id for partner profiles
      let query = supabase
        .from('user_profiles')
        .select('profile_data, demographics_data')
        .eq('user_id', user.id)
        .eq('profile_type', config.dbType);
      
      if (profileType === 'partner' && partnerProfileId) {
        query = query.eq('partner_profile_id', partnerProfileId);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) throw error;

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

      // Cache the result with partner-specific key
      const storeCacheKey = profileType === 'partner' && partnerProfileId
        ? `${user.id}-${config.dbType}-${partnerProfileId}`
        : `${user.id}-${config.dbType}`;
      DB_CACHE.set(storeCacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: CACHE_TTL
      });

      return result;
    } catch (error) {
      // Silently handle database errors
    }

    return defaultProfile;
  }, [user, config.dbType, defaultProfile, migrateLegacyData, profileType, partnerProfileId]);

  // Initialize and load data with instant local-first approach
  // Re-runs when partnerProfileId changes to load correct partner profile data
  useEffect(() => {
    const initialize = async () => {
      try {
        // CRITICAL: Only load data if user is authenticated
        if (!user) {
          setProfile(defaultProfile);
          setIsReady(true);
          setIsLoading(false);
          return;
        }
        
        // For partner profiles, require a valid partnerProfileId to proceed
        if (profileType === 'partner' && !partnerProfileId) {
          // Don't load any profile data yet - wait for partner profile ID
          setProfile(defaultProfile);
          setIsReady(false);
          setIsLoading(true);
          return;
        }
        
        // Clear DB cache for this specific partner profile to ensure fresh data
        if (profileType === 'partner' && partnerProfileId) {
          const cacheKey = `${user.id}-${config.dbType}-${partnerProfileId}`;
          DB_CACHE.delete(cacheKey);
        }
        
        // Load from localStorage first
        const localProfile = loadFromStorage();
        
        // Check if local profile has meaningful data (any required field filled)
        const hasLocalData = profileType === 'personal' 
          ? (localProfile as any).name || 
            (localProfile as any).pronouns || 
            (localProfile as any).relationshipStatus ||
            ((localProfile as any).loveLanguage && (localProfile as any).loveLanguage.length > 0) ||
            (localProfile as any).attachmentStyle
          : (localProfile as any).partnerName || 
            (localProfile as any).partnerPronouns ||
            ((localProfile as any).partnerLoveLanguage && (localProfile as any).partnerLoveLanguage.length > 0) ||
            (localProfile as any).partnerAttachmentStyle;
        
        if (hasLocalData) {
          // Fast path: localStorage has data, mark ready immediately
          setProfile(localProfile);
          setIsReady(true);
          setIsLoading(false);
          
          // Background sync to database (non-blocking)
          // Use requestIdleCallback to defer database operations to idle time
          const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
            
          idleCallback(async () => {
            try {
              setIsSyncing(true);
              const dbProfile = await loadFromDatabase();
              
              // Check if we have recent local modifications
              const now = Date.now();
              let hasRecentChanges = false;
              recentlyModifiedFields.current.forEach((timestamp) => {
                if (now - timestamp < 5000) {
                  hasRecentChanges = true;
                }
              });
                
              // Skip merge if profiles are identical (excluding lastUpdated)
              const localCopy = { ...localProfile };
              const dbCopy = { ...dbProfile };
              delete (localCopy as any).lastUpdated;
              delete (dbCopy as any).lastUpdated;
              
              // Skip merge if identical OR if user just made changes
              if (JSON.stringify(localCopy) === JSON.stringify(dbCopy) || hasRecentChanges) {
                setIsSyncing(false);
                return;
              }
              
              // Smart field-by-field merge that preserves user's recent edits
              const finalProfile = { ...dbProfile };
              
              // PRESERVE _updateTimestamp from local profile (client-only field)
              if ((localProfile as any)._updateTimestamp) {
                (finalProfile as any)._updateTimestamp = (localProfile as any)._updateTimestamp;
              }
              
              Object.keys(localProfile).forEach(key => {
                const localValue = localProfile[key as keyof typeof localProfile];
                const dbValue = dbProfile[key as keyof typeof dbProfile];
                
                // Always preserve recently modified fields (within last 10 seconds)
                const modTime = recentlyModifiedFields.current.get(key);
                if (modTime && (now - modTime) < RECENT_MODIFICATION_THRESHOLD) {
                  (finalProfile as any)[key] = localValue;
                  return;
                }
                
                // Preserve intentionally deleted fields (keep them empty)
                if (intentionallyDeletedFields.current.has(key)) {
                  const isEmpty = localValue === '' || localValue === null || localValue === undefined ||
                                  (Array.isArray(localValue) && localValue.length === 0);
                  if (isEmpty) {
                    (finalProfile as any)[key] = localValue;
                    return;
                  }
                }
                
                // Also preserve empty local values when deletion marker exists and DB has value
                const isEmpty = localValue === '' || localValue === null || localValue === undefined ||
                                (Array.isArray(localValue) && localValue.length === 0);
                const dbHasValue = dbValue && (
                  (typeof dbValue === 'string' && dbValue.trim()) ||
                  (Array.isArray(dbValue) && dbValue.length > 0)
                );
                
                if (isEmpty && dbHasValue && intentionallyDeletedFields.current.has(key)) {
                  // User intentionally deleted this - keep it empty
                  (finalProfile as any)[key] = localValue;
                  return;
                }
                
                // Preserve non-empty local values over empty db values
                if (Array.isArray(localValue)) {
                  if (localValue.length > 0 && (!dbValue || (Array.isArray(dbValue) && dbValue.length === 0))) {
                    (finalProfile as any)[key] = localValue;
                  }
                } else if (typeof localValue === 'string') {
                  if (localValue.trim() && (!dbValue || (typeof dbValue === 'string' && !dbValue.trim()))) {
                    (finalProfile as any)[key] = localValue;
                  }
                }
              });
              
              // Check if finalProfile is meaningfully different from current profile
              const currentCopy = { ...profile };
              const finalCopy = { ...finalProfile };
              delete (currentCopy as any).lastUpdated;
              delete (finalCopy as any).lastUpdated;
              delete (currentCopy as any)._updateTimestamp;
              delete (finalCopy as any)._updateTimestamp;
              
              // Deep comparison to prevent unnecessary re-renders
              const currentString = JSON.stringify(currentCopy);
              const finalString = JSON.stringify(finalCopy);
              
              if (currentString === finalString) {
                setIsSyncing(false);
                return;
              }
              
              // Additional check: if only metadata changed, skip update
              const hasRealChanges = Object.keys(finalCopy).some(key => {
                if (key.startsWith('_')) return false; // Skip internal metadata
                return JSON.stringify(currentCopy[key]) !== JSON.stringify(finalCopy[key]);
              });
              
              if (!hasRealChanges) {
                setIsSyncing(false);
                return;
              }
              
              // Use flushSync for synchronous updates to prevent UI flickering
              flushSync(() => {
                setProfile(finalProfile);
                saveToStorage(finalProfile);
              });
              setIsSyncing(false);
            } catch (dbError) {
              setIsSyncing(false);
            }
          });
        } else {
          // Slow path: localStorage empty, WAIT for database
          setProfile(localProfile); // Show default for now
          setIsLoading(true);
          
          try {
            const dbProfile = await loadFromDatabase();
            
            // Check if DB has data
            const hasDbData = profileType === 'personal'
              ? (dbProfile as any).name || 
                (dbProfile as any).pronouns || 
                (dbProfile as any).relationshipStatus ||
                ((dbProfile as any).loveLanguage && (dbProfile as any).loveLanguage.length > 0) ||
                (dbProfile as any).attachmentStyle
              : (dbProfile as any).partnerName || 
                (dbProfile as any).partnerPronouns ||
                ((dbProfile as any).partnerLoveLanguage && (dbProfile as any).partnerLoveLanguage.length > 0) ||
                (dbProfile as any).partnerAttachmentStyle;
            
            if (hasDbData) {
              setProfile(dbProfile);
              saveToStorage(dbProfile); // Cache to localStorage for next time
            }
            
            setIsReady(true);
            setIsLoading(false);
          } catch (dbError) {
            // DB failed, still mark ready with empty profile
            setIsReady(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        safeLog.error(`Initialization error for ${profileType}:`, error);
        setProfile(defaultProfile);
        setIsReady(true);
        setIsLoading(false);
        setIsSyncing(false);
      }
    };

    // Mobile-aware safety timeout to prevent excessive re-renders on touch devices
    const isMobileDevice = typeof window !== 'undefined' && (
      window.innerWidth < 768 || 
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
    
    const safetyTimeoutDuration = isMobileDevice ? 10000 : 5000; // 10s for mobile, 5s for desktop
    
    const safetyTimeout = setTimeout(() => {
      // Silent safety net - no logging needed
      setIsLoading(false);
      setIsSyncing(false);
      if (!isReady) {
        setIsReady(true);
        setProfile(defaultProfile);
      }
    }, safetyTimeoutDuration);

    initialize();
    
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [user, loadFromStorage, loadFromDatabase, saveToStorage, defaultProfile, profileType, isReady, partnerProfileId]);

  // Listen for in-tab and cross-tab profile updates to keep instances in sync
  useEffect(() => {
    const applyLatestFromStorage = (raw: string | null) => {
      try {
        const json = raw ?? localStorage.getItem(config.storageKey);
        if (!json) return;
        const parsed = JSON.parse(json);
        const currentTs = new Date((profile as any).lastUpdated || 0).getTime();
        const incomingTs = new Date(parsed.lastUpdated || 0).getTime();
        
        // Only apply if incoming is newer AND no recent local modifications
        if (incomingTs > currentTs) {
          const now = Date.now();
          let hasRecentChanges = false;
          
          recentlyModifiedFields.current.forEach((timestamp) => {
            if (now - timestamp < 5000) {
              hasRecentChanges = true;
            }
          });
          
          // Don't overwrite if user just made changes
          if (!hasRecentChanges) {
            const merged = { ...parsed, version: '2.0' } as any;
            setProfile(merged);
            setLastSaved(new Date());
            setIsReady(true);
          }
        }
      } catch (e) {
        // Silently handle parsing errors
      }
    };

    // Simple timeout-based external updates to prevent race conditions  
    let applyUpdateTimeout: NodeJS.Timeout;
    const throttledApplyUpdate = (value: string | null) => {
      clearTimeout(applyUpdateTimeout);
      applyUpdateTimeout = setTimeout(() => applyLatestFromStorage(value), 50);
    };

    const onCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (detail.profileType !== profileType || detail.storageKey !== config.storageKey) return;
      
      // Prevent self-triggered updates and only apply if data is actually newer
      const currentTime = new Date((profile as any).lastUpdated || 0).getTime();
      const incomingTime = new Date(detail.lastUpdated || 0).getTime();
      if (incomingTime > currentTime) {
        throttledApplyUpdate(null);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === config.storageKey && e.newValue) {
        applyLatestFromStorage(e.newValue);
      }
    };

    window.addEventListener(IN_TAB_PROFILE_UPDATE_EVENT, onCustomEvent as EventListener);
    window.addEventListener('storage', onStorage);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(applyUpdateTimeout);
      window.removeEventListener(IN_TAB_PROFILE_UPDATE_EVENT, onCustomEvent as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [config.storageKey, defaultProfile, profileType, profile]);

  // Save immediately when tab loses focus or page becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        const toSync = { ...pendingUpdates.current };
        pendingUpdates.current = {};
        if (Object.keys(toSync).length > 0) {
          syncToDatabase(toSync);
        }
      }
    };

    const handleBeforeUnload = () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        const toSync = { ...pendingUpdates.current };
        pendingUpdates.current = {};
        if (Object.keys(toSync).length > 0) {
          syncToDatabase(toSync);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [syncToDatabase]);

  // Periodic auto-save every 3 seconds if there are pending changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(pendingUpdates.current).length > 0) {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        
        const toSync = { ...pendingUpdates.current };
        pendingUpdates.current = {};
        syncToDatabase(toSync);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [syncToDatabase]);

  // Clear profile data
  const clearProfile = useCallback(async () => {
    try {
      // Clear from localStorage (user-specific key)
      if (user) {
        const userStorageKey = getUserStorageKey(config.storageKey, user.id);
        const userMigrationKey = getUserStorageKey(`${config.storageKey}_migrated`, user.id);
        localStorage.removeItem(userStorageKey);
        localStorage.removeItem(userMigrationKey);
      }
      
      // Also clear old non-user-specific key (for cleanup)
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
    
    // Track intentional deletions
    Object.entries(clonedUpdates).forEach(([field, value]) => {
      const isEmpty = value === '' || value === null || value === undefined || 
                      (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        intentionallyDeletedFields.current.add(field);
      } else {
        intentionallyDeletedFields.current.delete(field);
      }
    });
    
    // Check if any required field is being updated
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    const hasRequiredField = Object.keys(clonedUpdates).some(key => 
      requiredFields.includes(key) || key === '_updateTimestamp'
    );
    
    // Optimistic update - use flushSync for required fields to force immediate re-render
    if (hasRequiredField) {
      flushSync(() => {
        setProfile(prev => {
          const updated = { ...prev, ...clonedUpdates };
          saveToStorage(updated);
          return updated;
        });
      });
      
      // Dispatch event immediately after flushSync completes
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated', {
        detail: { fields: Object.keys(clonedUpdates), timestamp: Date.now() }
      }));
    } else {
      setProfile(prev => {
        const updated = { ...prev, ...clonedUpdates };
        saveToStorage(updated);
        return updated;
      });
    }

    // Accumulate pending updates
    Object.assign(pendingUpdates.current, clonedUpdates);

    // Timeout-based database sync
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const toSync = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      syncToDatabase(toSync);
    }, DEBOUNCE_MS);
  }, [cloneProfile, saveToStorage, syncToDatabase]);

  // Add flush method to updateProfile for immediate execution
  (updateProfile as any).flush = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      const toSync = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      syncToDatabase(toSync);
    }
  };

  // Update single field
  const updateField = useCallback((field: string, value: any) => {
    // FIRST: Clear caches immediately for required fields
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    if (requiredFields.includes(field)) {
      try {
        profileCompletionCache?.clear();
        validationCache?.clear();
        const { requirementCache } = require('@/utils/calculationCache');
        requirementCache?.clear();
      } catch (e) {
        // Silently handle if cache not ready
      }
    }
    
    // Mark field as recently modified
    recentlyModifiedFields.current.set(field, Date.now());
    
    // Track intentional deletions
    const isEmpty = value === '' || value === null || value === undefined || 
                    (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      intentionallyDeletedFields.current.add(field);
    } else {
      intentionallyDeletedFields.current.delete(field);
    }
    
    // For required fields, add timestamp to force React re-renders
    const updates = requiredFields.includes(field) 
      ? { [field]: value, _updateTimestamp: Date.now() } 
      : { [field]: value };
    
    updateProfile(updates as any);
  }, [updateProfile]);

  // Update single field with immediate database sync (for blur events)
  const updateFieldImmediate = useCallback((field: string, value: any) => {
    // FIRST: Clear caches immediately for required fields
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    if (requiredFields.includes(field)) {
      try {
        profileCompletionCache?.clear();
        validationCache?.clear();
        const { requirementCache } = require('@/utils/calculationCache');
        requirementCache?.clear();
      } catch (e) {
        // Silently handle if cache not ready
      }
    }
    
    recentlyModifiedFields.current.set(field, Date.now());
    
    // Track intentional deletions
    const isEmpty = value === '' || value === null || value === undefined || 
                    (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      intentionallyDeletedFields.current.add(field);
    } else {
      intentionallyDeletedFields.current.delete(field);
    }
    
    // For required fields, add timestamp to force React re-renders
    const updates = requiredFields.includes(field) 
      ? { [field]: value, _updateTimestamp: Date.now() } 
      : { [field]: value };
    
    const clonedUpdates = cloneProfile(updates as any);
    
    // Optimistic update - use flushSync for required fields to force immediate re-render
    if (requiredFields.includes(field)) {
      flushSync(() => {
        setProfile(prev => {
          const updated = { ...prev, ...clonedUpdates };
          saveToStorage(updated);
          return updated;
        });
      });
      
      // Dispatch event immediately after flushSync completes
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated', {
        detail: { field, value, timestamp: Date.now() }
      }));
    } else {
      setProfile(prev => {
        const updated = { ...prev, ...clonedUpdates };
        saveToStorage(updated);
        return updated;
      });
    }

    // Clear any pending debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Immediate sync to database
    syncToDatabase(clonedUpdates);
  }, [cloneProfile, saveToStorage, syncToDatabase]);

  // Handle multi-select with functional updates to prevent stale state
  const handleMultiSelect = useCallback((field: string, value: string) => {
    console.log(`[ProfileStore] Multi-select ${field}:`, value);
    
    // FIRST: Clear caches immediately for required fields
    const requiredFields = ['name', 'pronouns', 'relationshipStatus', 'loveLanguage', 'attachmentStyle'];
    if (requiredFields.includes(field)) {
      try {
        profileCompletionCache?.clear();
        validationCache?.clear();
        const { requirementCache } = require('@/utils/calculationCache');
        requirementCache?.clear();
      } catch (e) {
        // Silently handle if cache not ready
      }
    }
    
    // CRITICAL FIX: Mark field as recently modified to protect from database overwrites
    recentlyModifiedFields.current.set(field, Date.now());
    
    // Use functional update to get fresh state
    // Wrap in flushSync for required fields to force immediate re-render
    if (requiredFields.includes(field)) {
      let updatedArray: string[] = [];
      
      flushSync(() => {
        setProfile(currentProfile => {
          const current = (currentProfile as any)[field] as string[] || [];
          const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
          
          updatedArray = updated;
          
          safeLog.multiSelect('ProfileStore', field, current.includes(value) ? 'remove' : 'add', value);
          
          const newProfile = {
            ...currentProfile,
            [field]: updated,
            _updateTimestamp: Date.now()
          };
          
          saveToStorage(newProfile);
          
          return newProfile;
        });
      });
      
      // Dispatch event immediately after flushSync completes
      window.dispatchEvent(new CustomEvent('profile:requiredFieldUpdated', {
        detail: { field, value, timestamp: Date.now() }
      }));
      
      // Trigger timeout-based database sync
      pendingUpdates.current = { 
        ...pendingUpdates.current, 
        [field]: updatedArray
      } as any;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        const toSync = { ...pendingUpdates.current };
        pendingUpdates.current = {};
        syncToDatabase(toSync);
      }, DEBOUNCE_MS);
    } else {
      setProfile(currentProfile => {
        const current = (currentProfile as any)[field] as string[] || [];
        const updated = current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value];
        
        safeLog.multiSelect('ProfileStore', field, current.includes(value) ? 'remove' : 'add', value);
        
        const newProfile = { ...currentProfile, [field]: updated };
        
        saveToStorage(newProfile);
        
        // Trigger timeout-based database sync
        pendingUpdates.current = { 
          ...pendingUpdates.current, 
          [field]: updated
        } as any;
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
    }
  }, [saveToStorage, syncToDatabase]);

  const flush = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = undefined;
    }
    
    if (Object.keys(pendingUpdates.current).length > 0) {
      const toSync = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      
      const updatedProfile = { ...profile, ...toSync };
      saveToStorage(updatedProfile);
      syncToDatabase(toSync);
      
      return toSync;
    }
    
    return {};
  }, [profile, saveToStorage, syncToDatabase]);

  return {
    profileData: profile,
    isLoading,
    isReady,
    isSyncing: isSyncing || false,
    updateField,
    updateFieldImmediate,
    handleMultiSelect,
    saveData: updateProfile,
    clearProfile,
    lastSaved,
    flush
  };
};