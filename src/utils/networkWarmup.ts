// Network warmup utility - DISABLED for performance
let hasRun = false;

export const warmupNetwork = () => {
  // COMPLETELY DISABLED for performance
  return;
  
  const runWarmup = () => {
    // Preload critical homepage assets first
    const criticalAssets = [
      '/lovable-uploads/heartlines-logo.png',
      '/assets/couple-connection.jpg',
      '/assets/millennial-woman-portrait.jpg'
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = 'image';
      document.head.appendChild(link);
    });

    // Preload critical Supabase endpoints with actual fetch requests
    const supabaseUrl = 'https://relqmhrzyqckoaebscgx.supabase.co';
    const criticalEndpoints = [
      `${supabaseUrl}/functions/v1/anthropic-chat`,
      `${supabaseUrl}/functions/v1/check-subscription`
    ];

    criticalEndpoints.forEach(endpoint => {
      // Use fetch with no-cors to warm up connections without triggering CORS
      fetch(endpoint, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache'
      }).catch(() => {
        // Silently ignore errors - this is just for connection warmup
      });
    });

    // Enhanced DNS prefetch for homepage-specific domains
    const dnsPrefetchDomains = [
      'https://api.anthropic.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://images.unsplash.com',
      'https://cdn.jsdelivr.net' // For potential external assets
    ];

    dnsPrefetchDomains.forEach(domain => {
      // Avoid duplicate dns-prefetch links
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Preconnect to critical resources
    const preconnectDomains = [
      'https://api.anthropic.com',
      'https://fonts.googleapis.com'
    ];

    preconnectDomains.forEach(domain => {
      // Avoid duplicate preconnect links
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  };
  
  // Schedule warmup during idle time to avoid competing with first paint
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runWarmup, { timeout: 2000 });
  } else {
    setTimeout(runWarmup, 1500);
  }
};