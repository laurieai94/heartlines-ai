
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStatus {
  id: string;
  user_id: string;
  profile_completed: boolean;
  partner_profile_completed: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setStatus(data);
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (updates: Partial<Omit<OnboardingStatus, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_status')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setStatus(data);
      return data;
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  return {
    status,
    loading,
    updateStatus,
    refetchStatus: fetchStatus
  };
};
