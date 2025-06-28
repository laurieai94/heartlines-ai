
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfileData {
  id: string;
  user_id: string;
  profile_type: 'your' | 'partner';
  profile_data: any;
  demographics_data: any;
  created_at: string;
  updated_at: string;
}

export const useUserProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<{ your: UserProfileData | null; partner: UserProfileData | null }>({
    your: null,
    partner: null
  });
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const profilesMap = { your: null, partner: null };
      data?.forEach((profile) => {
        profilesMap[profile.profile_type as 'your' | 'partner'] = profile;
      });

      setProfiles(profilesMap);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (
    profileType: 'your' | 'partner',
    profileData: any,
    demographicsData: any
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          profile_type: profileType,
          profile_data: profileData,
          demographics_data: demographicsData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setProfiles(prev => ({
        ...prev,
        [profileType]: data
      }));

      toast.success(`${profileType === 'your' ? 'Your' : 'Partner'} profile saved successfully!`);
      return data;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
      throw error;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  return {
    profiles,
    loading,
    saveProfile,
    refetchProfiles: fetchProfiles
  };
};
