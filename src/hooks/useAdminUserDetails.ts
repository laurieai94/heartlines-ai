import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useUserRole';

export const useAdminUserDetails = (userId: string | null) => {
  const { isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-user-details', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: summary } = await supabase
        .from('user_analytics_summary')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: conversations } = await supabase
        .from('chat_conversations')
        .select('id, title, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      const { data: tokenUsage } = await supabase
        .from('user_token_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      return {
        summary,
        conversations: conversations || [],
        tokenUsage: tokenUsage || []
      };
    },
    enabled: isAdmin && !!userId,
  });
};
