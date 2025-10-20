import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LandingPage from '@/components/LandingPage';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import { CRITICAL_IMAGES } from '@/config/criticalResources';

const FADE_OUT_DURATION = 300; // 0.3 seconds

const FirstVisitSplash: React.FC = () => {
  // Check immediately if this is a return visit - skip all loading logic if so
  const hasVisited = typeof sessionStorage !== 'undefined' && 
    sessionStorage.getItem('homepage_visited') === 'true';
  
  const resourcesCached = typeof sessionStorage !== 'undefined' && 
    sessionStorage.getItem('resources_loaded') === 'true';
  
  // Early return for instant loading on return visits
  if (hasVisited || resourcesCached) {
    return <LandingPage />;
  }
  
  // First visit only - proceed with splash screen logic
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const { isLoading: resourcesLoading } = useResourceLoader(CRITICAL_IMAGES, {
    minDisplayTime: 3000,
    maxTimeout: isMobile ? 1500 : 4000
  });

  useEffect(() => {
    // Mark as visited on first mount
    const hasVisited = sessionStorage.getItem('homepage_visited');
    
    if (!hasVisited) {
      console.log('[FirstVisitSplash] First visit detected - showing splash');
    }
  }, []);

  // Hide splash only when resources are loaded
  useEffect(() => {
    if (!showSplash || resourcesLoading) return;

    let fadeOutTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    // Resources loaded - start fade out
    fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 0);
    
    // Hide splash and mark as visited + cache resources
    hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('homepage_visited', 'true');
      sessionStorage.setItem('resources_loaded', 'true');
    }, FADE_OUT_DURATION);
    
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [showSplash, resourcesLoading]);

  // Emergency timeout - force show page if splash hangs
  useEffect(() => {
    if (!showSplash) return;
    
    const emergencyTimeout = setTimeout(() => {
      console.log('[FirstVisitSplash] Emergency timeout - forcing page load');
      setShowSplash(false);
      sessionStorage.setItem('homepage_visited', 'true');
      sessionStorage.setItem('resources_loaded', 'true');
    }, isMobile ? 5000 : 8000); // 5s on mobile, 8s on desktop - buffer above 3s minDisplayTime
    
    return () => clearTimeout(emergencyTimeout);
  }, [showSplash, isMobile]);

  // Render landing page in background while splash is showing
  return (
    <>
      {/* Landing page loads in background */}
      <LandingPage />
      
      {/* Splash overlay - only visible during first visit */}
      {showSplash && (
        <div className={`fixed inset-0 z-50 ${isFadingOut ? 'animate-fade-out' : ''}`}>
          <SplashScreen
            showWordmark={true}
            wordmarkSize="xl"
          />
        </div>
      )}
    </>
  );
};

export default FirstVisitSplash;
