import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LandingPage from '@/components/LandingPage';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import { CRITICAL_IMAGES } from '@/config/criticalResources';

const FADE_OUT_DURATION = 300; // 0.3 seconds

const FirstVisitSplash: React.FC = () => {
  // Check immediately if this is a return visit - skip all loading logic if so
  let hasVisited = false;
  let resourcesCached = false;
  
  try {
    if (typeof sessionStorage !== 'undefined') {
      hasVisited = sessionStorage.getItem('homepage_visited') === 'true';
      resourcesCached = sessionStorage.getItem('resources_loaded') === 'true';
    }
  } catch (error) {
    console.warn('[FirstVisitSplash] SessionStorage access failed:', error);
    // On storage failure, show landing page directly
    return <LandingPage />;
  }
  
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
    try {
      const hasVisited = sessionStorage.getItem('homepage_visited');
      
      if (!hasVisited) {
        console.log('[FirstVisitSplash] First visit detected - showing splash');
      }
    } catch (error) {
      console.warn('[FirstVisitSplash] SessionStorage access failed on mount:', error);
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
      try {
        sessionStorage.setItem('homepage_visited', 'true');
        sessionStorage.setItem('resources_loaded', 'true');
      } catch (error) {
        console.warn('[FirstVisitSplash] Failed to set sessionStorage:', error);
      }
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
      try {
        sessionStorage.setItem('homepage_visited', 'true');
        sessionStorage.setItem('resources_loaded', 'true');
      } catch (error) {
        console.warn('[FirstVisitSplash] Failed to set sessionStorage on emergency timeout:', error);
      }
    }, isMobile ? 2500 : 5000); // 2.5s on mobile, 5s on desktop - reduced for better UX
    
    return () => clearTimeout(emergencyTimeout);
  }, [showSplash, isMobile]);

  // Render landing page in background while splash is showing
  return (
    <>
      {/* Landing page loads in background */}
      <LandingPage />
      
      {/* Splash overlay - only visible during first visit */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] ${isFadingOut ? 'animate-fade-out pointer-events-none' : ''}`}
          style={{ pointerEvents: isFadingOut ? 'none' : 'auto' }}
        >
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
