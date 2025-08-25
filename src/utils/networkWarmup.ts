// Network warmup utility to preload critical resources
export const warmupNetwork = () => {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Preload critical API endpoints
  const criticalEndpoints = [
    '/api/anthropic-chat', // AI chat endpoint
    '/api/check-subscription' // User subscription check
  ];

  criticalEndpoints.forEach(endpoint => {
    // Create invisible image requests to warm up connections
    const warmupRequest = new Image();
    warmupRequest.src = `${window.location.origin}/supabase/functions${endpoint}?warmup=1`;
  });

  // DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'https://api.anthropic.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical resources
  const preconnectDomains = [
    'https://api.anthropic.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};