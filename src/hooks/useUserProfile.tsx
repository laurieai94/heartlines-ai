
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Return cached result if available
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoading(false);
      return;
    }

    // Return inflight promise if already fetching
    if (inflightPromise) {
      const result = await inflightPromise;
      setProfile(result);
      setLoading(false);
      return;
    }

    try {
      inflightPromise = (async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        cachedProfile = data;
        return data;
      })();

      const result = await inflightPromise;
      setProfile(result);
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  return {
    profile,
    loading,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
