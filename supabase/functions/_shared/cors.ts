
// Dynamic CORS headers based on ALLOWED_ORIGINS secret
export const getCorsHeaders = (origin?: string | null) => {
  const raw = Deno.env.get('ALLOWED_ORIGINS');
  const allowedOrigins = raw ? raw.split(',').map(o => o.trim()).filter(Boolean) : ['*'];

  // If wildcard is allowed or no specific origins configured, allow all
  if (allowedOrigins.includes('*')) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    } as const;
  }

  // If no origin provided, we cannot reflect it
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': 'null',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    } as const;
  }

  // Match origin with support for wildcard patterns (e.g., https://*.lovable.app or prefix*)
  const escapeRegex = (s: string) => s.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');
  const matched = allowedOrigins.find((allowed) => {
    if (allowed === origin) return true;
    if (allowed.includes('*')) {
      const pattern = '^' + escapeRegex(allowed).replace(/\\\*/g, '.*') + '$';
      try {
        return new RegExp(pattern).test(origin);
      } catch {
        return false;
      }
    }
    return false;
  });

  const allow = matched ? origin : 'null';

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  } as const;
};

// Legacy export for backward compatibility
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
