import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStripeMode = () => {
  return useQuery({
    queryKey: ["stripe-mode"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-stripe-mode");
      
      if (error) throw error;
      
      return data as { testMode: boolean; environment: string };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};
