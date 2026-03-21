CREATE OR REPLACE FUNCTION public.generate_priority_code()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  SELECT encode(extensions.gen_random_bytes(8), 'hex');
$function$;