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
  
  // Load critical resources with min 1s display, max 5s timeout
  const { isLoading: resourcesLoading } = useResourceLoader(CRITICAL_IMAGES, {
    minDisplayTime: 1000,
    maxTimeout: 5000
  });

  useEffect(() => {
    // Check if user has visited homepage in this session
    const hasVisited = sessionStorage.getItem('homepage_visited');
    
    if (!hasVisited) {
      // First visit - show splash
      setShowSplash(true);
      setIsChecking(false);
    } else {
      // Returning visit - skip splash
      setIsChecking(false);
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
    
    // Hide splash and mark as visited
    hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('homepage_visited', 'true');
    }, FADE_OUT_DURATION);
    
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [showSplash, resourcesLoading]);

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
            wordmarkSize="lg"
          />
        </div>
      )}
    </>
  );
};

export default FirstVisitSplash;
