
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Timeout wrapper for queries
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    )
  ]);
};

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Module-level cache to prevent duplicate requests
let cachedProfile: UserProfile | null = null;
let inflightPromise: Promise<UserProfile | null> | null = null;

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);

  const fetchProfile = async (retries = 2) => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Return cached result immediately if available
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoading(false);
      return;
    }

    // Return inflight promise if already fetching
    if (inflightPromise) {
      try {
        const result = await inflightPromise;
        setProfile(result);
      } catch (error) {
        console.warn('Inflight promise failed:', error);
      }
      setLoading(false);
      return;
    }

    try {
      inflightPromise = (async () => {
        // Create the query and convert to proper Promise
        const queryPromise = Promise.resolve(
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
        );

        // Wrap with 5-second timeout
        const { data, error } = await withTimeout(queryPromise, 5000);

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        cachedProfile = data;
        return data;
      })();

      const result = await inflightPromise;
      setProfile(result);
    } catch (error) {
      console.warn('Error fetching profile:', error);
      
      // Retry with exponential backoff
      if (retries > 0) {
        const delay = (3 - retries) * 1000; // 1s, then 2s
        setTimeout(() => fetchProfile(retries - 1), delay);
        return;
      }
      
      // Use cached data if available, even if stale
      if (cachedProfile) {
        setProfile(cachedProfile);
      }
    } finally {
      inflightPromise = null;
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update cache
      cachedProfile = data;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Listen for global refresh events
  useEffect(() => {
    const handleRefresh = async () => {
      // Clear cache and refetch
      cachedProfile = null;
      inflightPromise = null;
      await fetchProfile();
    };

    window.addEventListener('user-profile:refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('user-profile:refresh', handleRefresh);
    };
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
