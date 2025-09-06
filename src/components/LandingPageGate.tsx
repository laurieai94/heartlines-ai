import React, { useState, useEffect, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import SplashScreen from './SplashScreen';
import LandingPageShell from './LandingPageShell';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

const LandingPage = React.lazy(() => import('./LandingPage'));

const LandingPageGate = () => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'timeout' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let splashTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;
    
    // Show splash screen for initial loading period
    splashTimer = setTimeout(() => {
      if (loadState === 'loading') {
        // Still loading after 3s, but give it more time before fallback
      }
    }, 3000);

    // Fallback to shell if chunk hasn't loaded after 6 seconds
    timeoutTimer = setTimeout(() => {
      if (loadState === 'loading') {
        console.info('[LandingPageGate] Chunk load timeout - showing shell fallback');
        setLoadState('timeout');
      }
    }, 6000);

    // Pre-warm the landing page import
    const preloadPromise = import('./LandingPage')
      .then(() => {
        if (loadState === 'loading') {
          console.info('[LandingPageGate] Landing page chunk loaded successfully');
          setLoadState('loaded');
        }
      })
      .catch((error) => {
        console.warn('[LandingPageGate] Failed to load landing page chunk:', error);
        setLoadState('error');
      });

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(timeoutTimer);
    };
  }, [retryCount, loadState]);

  const handleRetry = () => {
    console.info('[LandingPageGate] Retrying chunk load');
    setLoadState('loading');
    setRetryCount(prev => prev + 1);
    // Force a page reload to get fresh chunks from CDN
    window.location.reload();
  };

  // Error fallback with retry option
  const ErrorFallback = () => (
    <div className="min-h-screen bg-burgundy-900 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-thin text-white mb-4">
          Having trouble loading the page
        </h1>
        <p className="text-gray-300 mb-8 leading-relaxed">
          This might be a temporary network issue. You can try again or continue to the app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-3 rounded-full border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/get-started'}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-full"
          >
            Continue to App
          </Button>
        </div>
      </div>
    </div>
  );

  // Show appropriate content based on load state
  switch (loadState) {
    case 'loading':
      return <SplashScreen titleText="heartlines loading..." />;
      
    case 'loaded':
      return (
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <LandingPage />
          </Suspense>
        </ErrorBoundary>
      );
      
    case 'timeout':
      console.info('[LandingPageGate] Using shell fallback due to chunk timeout');
      return (
        <ErrorBoundary fallback={ErrorFallback}>
          <LandingPageShell />
        </ErrorBoundary>
      );
      
    case 'error':
      return <ErrorFallback />;
      
    default:
      return <SplashScreen titleText="heartlines loading..." />;
  }
};

export default LandingPageGate;