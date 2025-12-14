import { useState, useEffect, useCallback, useRef } from 'react';
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

export const usePartnerProfiles = () => {
  const { user } = useAuth();
  const subscriptionData = useOptimizedSubscription();
  const [profiles, setProfiles] = useState<PartnerProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const profileName = name || 'New Partner';

      const { data, error: createError } = await supabase.rpc('upsert_user_profile_patch', {
        p_profile_type: 'partner',
        p_patch: { partnerName: profileName },
        p_partner_profile_id: newProfileId
      });

      if (createError) {
        // Check if it's a limit error
        if (createError.message.includes('Partner profile limit reached')) {
          toast.error('Partner profile limit reached. Upgrade your plan for more profiles.');
          return null;
        }
        throw createError;
      }

      // Clear any stale localStorage for this new profile to ensure it starts blank
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

  // Real-time subscription for partner profile changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`partner-profiles-${user.id}`)
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
    profiles,
    activeProfileId,
    activeProfile: getActiveProfile(),
    isLoading,
    error,
    limits: getLimits(),
    fetchProfiles,
    createProfile,
    deleteProfile,
    switchProfile,
    setActiveProfileId
  };
};
