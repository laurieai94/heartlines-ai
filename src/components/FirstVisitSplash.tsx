import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LandingPage from '@/components/LandingPage';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import { CRITICAL_IMAGES } from '@/config/criticalResources';

const FADE_OUT_DURATION = 300; // 0.3 seconds

const FirstVisitSplash: React.FC = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Aggressive mobile optimization - faster everything
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Check if resources were previously loaded
  const resourcesCached = typeof sessionStorage !== 'undefined' && 
    sessionStorage.getItem('resources_loaded') === 'true';
  
  const { isLoading: resourcesLoading } = useResourceLoader(CRITICAL_IMAGES, {
    minDisplayTime: isMobile ? 500 : 2000, // 0.5s on mobile, 2s on desktop
    maxTimeout: isMobile ? 1500 : 4000 // 1.5s timeout on mobile, 4s on desktop
  });

  useEffect(() => {
    // Check if user has visited homepage in this session
    const hasVisited = sessionStorage.getItem('homepage_visited');
    
    if (!hasVisited) {
      // First visit - show splash (but skip if resources cached)
      setShowSplash(!resourcesCached);
      setIsChecking(false);
      
      // If resources cached, mark as visited immediately
      if (resourcesCached) {
        sessionStorage.setItem('homepage_visited', 'true');
      }
    } else {
      // Returning visit - skip splash
      setIsChecking(false);
    }
  }, [resourcesCached]);

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
    }, isMobile ? 3000 : 6000); // 3s on mobile (increased from 2s), 6s on desktop
    
    return () => clearTimeout(emergencyTimeout);
  }, [showSplash, isMobile]);

  // During initial check, show nothing to prevent flash
  if (isChecking) {
    return null;
  }

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
