-- Update get_partner_profile_limit to check user_message_usage as fallback
CREATE OR REPLACE FUNCTION public.get_partner_profile_limit(user_id_input uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  tier text;
  has_override boolean;
BEGIN
  -- Check for account override first
  SELECT unlimited_messages INTO has_override
  FROM public.account_overrides ao
  JOIN auth.users u ON u.email = ao.email
  WHERE u.id = user_id_input
  LIMIT 1;
  
  IF has_override = true THEN
    RETURN 9999; -- Unlimited for overrides
  END IF;

  -- Get subscription tier from subscribers table first
  SELECT subscription_tier INTO tier
  FROM public.subscribers
  WHERE subscribers.user_id = user_id_input
    AND subscribed = true
  LIMIT 1;
  
  -- Fallback: check user_message_usage if no active subscriber record
  IF tier IS NULL THEN
    SELECT subscription_tier INTO tier
    FROM public.user_message_usage
    WHERE user_id = user_id_input
    ORDER BY usage_month DESC
    LIMIT 1;
  END IF;
  
  -- Return limit based on tier (matches pricingPlans.ts)
  RETURN CASE tier
    WHEN 'unlimited' THEN 9999
    WHEN 'vibe' THEN 6
    WHEN 'glow' THEN 2
    ELSE 1 -- freemium/begin
  END;
END;
$function$;