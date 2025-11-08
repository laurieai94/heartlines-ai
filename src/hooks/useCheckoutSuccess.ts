import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useOptimizedSubscription } from './useOptimizedSubscription';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useCheckoutSuccess = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { revalidateWithStripe } = useOptimizedSubscription();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    if (upgraded === 'true' && user) {
      // 1. Show success message
      toast.success("You're officially upgraded! ✨", {
        description: "Your new plan is active"
      });
      
      // 2. Fetch fresh data from Stripe
      revalidateWithStripe();
      
      // 3. Invalidate React Query cache to force refetch
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      
      // 4. Clean up URL parameter
      searchParams.delete('upgraded');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, revalidateWithStripe, queryClient, user]);
};
