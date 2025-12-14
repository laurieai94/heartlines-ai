import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedSubscription } from './useOptimizedSubscription';
import { toast } from 'sonner';

export interface PartnerProfile {
  id: string;
  partner_profile_id: string;
  partner_profile_name: string;
  profile_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface PartnerProfileLimits {
  current: number;
  limit: number;
  canAdd: boolean;
  tierName: string;
}

// Global virgin profiles tracker - survives component remounts
const VIRGIN_PROFILES = new Set<string>();

// Helper to get virgin profiles from localStorage
const getVirginProfilesFromStorage = (userId: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(`virgin_profiles_${userId}`) || '[]');
  } catch {
    return [];
  }
};

// Helper to save virgin profiles to localStorage
const saveVirginProfilesToStorage = (userId: string, profiles: string[]) => {
  localStorage.setItem(`virgin_profiles_${userId}`, JSON.stringify(profiles));
};

export const usePartnerProfiles = () => {
  const { user } = useAuth();
  const subscriptionData = useOptimizedSubscription();
  const [profiles, setProfiles] = useState<PartnerProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingNameUpdates, setPendingNameUpdates] = useState<Map<string, string>>(new Map());

  // Listen for optimistic name updates from questionnaire
  useEffect(() => {
    const handleNameUpdate = (e: CustomEvent<{ profileId: string; name: string }>) => {
      const { profileId, name } = e.detail;
      setPendingNameUpdates(prev => new Map(prev).set(profileId, name));
    };
    
    window.addEventListener('partner:nameUpdate', handleNameUpdate as EventListener);
    return () => window.removeEventListener('partner:nameUpdate', handleNameUpdate as EventListener);
  }, []);

  // Merge pending name updates into profiles for immediate display
  const profilesWithPendingNames = useMemo(() => {
    if (pendingNameUpdates.size === 0) return profiles;
    return profiles.map(profile => {
      const pendingName = pendingNameUpdates.get(profile.partner_profile_id);
      return {
        ...profile,
        partner_profile_name: pendingName !== undefined ? (pendingName || 'New Partner') : profile.partner_profile_name
      };
    });
  }, [profiles, pendingNameUpdates]);

  // Clear pending update when DB confirms the change
  useEffect(() => {
    if (pendingNameUpdates.size === 0) return;
    
    pendingNameUpdates.forEach((pendingName, profileId) => {
      const dbProfile = profiles.find(p => p.partner_profile_id === profileId);
      if (dbProfile && dbProfile.partner_profile_name === pendingName) {
        setPendingNameUpdates(prev => {
          const next = new Map(prev);
          next.delete(profileId);
          return next;
        });
      }
    });
  }, [profiles, pendingNameUpdates]);
  // Check if a profile is virgin (brand new, never edited)
  const isVirginProfile = useCallback((profileId: string): boolean => {
    if (!profileId) return false;
    // Check in-memory set first
    if (VIRGIN_PROFILES.has(profileId)) return true;
    // Check localStorage backup
    if (user) {
      const stored = getVirginProfilesFromStorage(user.id);
      return stored.includes(profileId);
    }
    return false;
  }, [user]);

  // Clear virgin status after first edit
  const clearVirginStatus = useCallback((profileId: string) => {
    VIRGIN_PROFILES.delete(profileId);
    if (user) {
      const stored = getVirginProfilesFromStorage(user.id);
      const updated = stored.filter(id => id !== profileId);
      saveVirginProfilesToStorage(user.id, updated);
    }
  }, [user]);

  // Calculate limits based on subscription tier
  const getLimits = useCallback((): PartnerProfileLimits => {
    const tier = subscriptionData?.subscription_tier || 'freemium';
    let limit = 1;
    let tierName = 'begin';

    switch (tier) {
      case 'unlimited':
        limit = 9999;
        tierName = 'unlimited';
        break;
      case 'vibe':
        limit = 6;
        tierName = 'vibe';
        break;
      case 'glow':
        limit = 2;
        tierName = 'glow';
        break;
      default:
        limit = 1;
        tierName = 'begin';
    }

    return {
      current: profiles.length,
      limit,
      canAdd: profiles.length < limit,
      tierName
    };
  }, [subscriptionData?.subscription_tier, profiles.length]);

  // Fetch all partner profiles for the user
  const fetchProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('profile_type', 'partner')
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const formattedProfiles: PartnerProfile[] = (data || []).map(row => {
        const profileData = typeof row.profile_data === 'object' && row.profile_data !== null 
          ? row.profile_data as Record<string, any>
          : {};
        
        return {
          id: row.id,
          partner_profile_id: row.partner_profile_id || '',
          partner_profile_name: row.partner_profile_name || (profileData as any)?.partnerName || 'Partner',
          profile_data: profileData,
          created_at: row.created_at,
          updated_at: row.updated_at
        };
      });

      setProfiles(formattedProfiles);

      // Set active profile to first one if not set
      if (formattedProfiles.length > 0 && !activeProfileId) {
        setActiveProfileId(formattedProfiles[0].partner_profile_id);
      }
    } catch (err: any) {
      console.error('Error fetching partner profiles:', err);
      setError(err.message || 'Failed to fetch partner profiles');
    } finally {
      setIsLoading(false);
    }
  }, [user, activeProfileId]);

  // Create a new partner profile
  const createProfile = useCallback(async (name?: string): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to create a partner profile');
      return null;
    }

    const limits = getLimits();
    if (!limits.canAdd) {
      toast.error(`You've reached your limit of ${limits.limit} partner profile${limits.limit > 1 ? 's' : ''} on the ${limits.tierName} plan`);
      return null;
    }

    try {
      const newProfileId = crypto.randomUUID();
      const profileName = name || 'their name';

      // CRITICAL: Mark as virgin BEFORE any other operations
      VIRGIN_PROFILES.add(newProfileId);
      const virginList = getVirginProfilesFromStorage(user.id);
      virginList.push(newProfileId);
      saveVirginProfilesToStorage(user.id, virginList);
      console.log('[VirginProfile] Marked new profile as virgin:', newProfileId);

      const { data, error: createError } = await supabase.rpc('upsert_user_profile_patch', {
        p_profile_type: 'partner',
        p_patch: { partnerName: profileName },
        p_partner_profile_id: newProfileId
      });

      if (createError) {
        // Rollback virgin status on error
        VIRGIN_PROFILES.delete(newProfileId);
        const rollbackList = getVirginProfilesFromStorage(user.id).filter(id => id !== newProfileId);
        saveVirginProfilesToStorage(user.id, rollbackList);
        
        if (createError.message.includes('Partner profile limit reached')) {
          toast.error('Partner profile limit reached. Upgrade your plan for more profiles.');
          return null;
        }
        throw createError;
      }

      // Clear ALL potential stale data for this new profile
      localStorage.removeItem(`partner_profile_v2_${user.id}_${newProfileId}`);
      
      // Refresh profiles list
      await fetchProfiles();
      
      // Set the new profile as active
      setActiveProfileId(newProfileId);
      
      return newProfileId;
    } catch (err: any) {
      console.error('Error creating partner profile:', err);
      toast.error(err.message || 'Failed to create partner profile');
      return null;
    }
  }, [user, getLimits, fetchProfiles]);

  // Delete a partner profile
  const deleteProfile = useCallback(async (partnerProfileId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to delete a partner profile');
      return false;
    }

    // Prevent deleting the last profile
    if (profiles.length <= 1) {
      toast.error('You must have at least one partner profile');
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.id)
        .eq('profile_type', 'partner')
        .eq('partner_profile_id', partnerProfileId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('Partner profile deleted');
      
      // If we deleted the active profile, switch to another one
      if (activeProfileId === partnerProfileId) {
        const remainingProfiles = profiles.filter(p => p.partner_profile_id !== partnerProfileId);
        if (remainingProfiles.length > 0) {
          setActiveProfileId(remainingProfiles[0].partner_profile_id);
        }
      }

      // Refresh profiles list
      await fetchProfiles();
      
      return true;
    } catch (err: any) {
      console.error('Error deleting partner profile:', err);
      toast.error(err.message || 'Failed to delete partner profile');
      return false;
    }
  }, [user, profiles, activeProfileId, fetchProfiles]);

  // Switch active profile
  const switchProfile = useCallback((partnerProfileId: string) => {
    const profile = profiles.find(p => p.partner_profile_id === partnerProfileId);
    if (profile) {
      setActiveProfileId(partnerProfileId);
      // Store in localStorage for persistence
      if (user) {
        localStorage.setItem(`active_partner_profile_${user.id}`, partnerProfileId);
      }
      // Dispatch event to notify other components (like AIInsights) of profile switch
      window.dispatchEvent(new CustomEvent('partner:profileSwitch', { 
        detail: { newProfileId: partnerProfileId, profileName: profile.partner_profile_name } 
      }));
      console.log('[PartnerProfiles] Switched active profile to:', partnerProfileId);
    }
  }, [profiles, user]);

  // Get active profile data
  const getActiveProfile = useCallback((): PartnerProfile | null => {
    return profiles.find(p => p.partner_profile_id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      // Try to restore active profile from localStorage
      const savedActiveId = localStorage.getItem(`active_partner_profile_${user.id}`);
      if (savedActiveId) {
        setActiveProfileId(savedActiveId);
      }
      fetchProfiles();
    }
  }, [user, fetchProfiles]);

  // Ref for fetchProfiles to avoid stale closure in realtime subscription
  const fetchProfilesRef = useRef(fetchProfiles);
  useEffect(() => {
    fetchProfilesRef.current = fetchProfiles;
  }, [fetchProfiles]);

  // Unique instance ID for this hook instance to prevent duplicate channel names
  const instanceId = useRef(crypto.randomUUID()).current;

  // Real-time subscription for partner profile changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`partner-profiles-${user.id}-${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          // Only refetch if it's a partner profile change
          if (payload.new?.profile_type === 'partner' || payload.old?.profile_type === 'partner') {
            fetchProfilesRef.current();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    profiles: profilesWithPendingNames,
    activeProfileId,
    activeProfile: getActiveProfile(),
    isLoading,
    error,
    limits: getLimits(),
    fetchProfiles,
    createProfile,
    deleteProfile,
    switchProfile,
    setActiveProfileId,
    isVirginProfile,
    clearVirginStatus
  };
};
