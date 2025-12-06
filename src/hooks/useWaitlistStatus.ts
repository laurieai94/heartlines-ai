import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistStatus {
  waitlistActive: boolean;
  waitlistMessage: string | null;
  loading: boolean;
}

export const useWaitlistStatus = () => {
  const [status, setStatus] = useState<WaitlistStatus>({
    waitlistActive: false,
    waitlistMessage: null,
    loading: true,
  });

  const checkWaitlistStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('launch_limits')
        .select('waitlist_active, waitlist_message')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking waitlist status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
        return { waitlistActive: false, waitlistMessage: null };
      }

      const result = {
        waitlistActive: data?.waitlist_active ?? false,
        waitlistMessage: data?.waitlist_message ?? null,
      };

      setStatus({
        ...result,
        loading: false,
      });

      return result;
    } catch (error) {
      console.error('Error checking waitlist status:', error);
      setStatus(prev => ({ ...prev, loading: false }));
      return { waitlistActive: false, waitlistMessage: null };
    }
  }, []);

  useEffect(() => {
    checkWaitlistStatus();
  }, [checkWaitlistStatus]);

  return { ...status, checkWaitlistStatus };
};
