import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileQueryOptions {
  profileType: 'your' | 'partner';
  enabled?: boolean;
}

export const useProfileQuery = ({ profileType, enabled = true }: ProfileQueryOptions) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_profile', user?.id, profileType],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_data, demographics_data')
        .eq('user_id', user.id)
        .eq('profile_type', profileType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) return null;

      // Merge profile_data and demographics_data
      return {
        ...(typeof data.profile_data === 'object' && data.profile_data !== null ? data.profile_data : {}),
        ...(typeof data.demographics_data === 'object' && data.demographics_data !== null ? data.demographics_data : {})
      };
    },
    enabled: enabled && !!user,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
