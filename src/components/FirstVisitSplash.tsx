import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LandingPage from '@/components/LandingPage';

const SPLASH_DURATION = 1800; // 1.8 seconds
const FADE_OUT_DURATION = 300; // 0.3 seconds

const FirstVisitSplash: React.FC = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user has visited homepage in this session
    const hasVisited = sessionStorage.getItem('homepage_visited');
    
    if (!hasVisited) {
      // First visit - show splash
      setShowSplash(true);
      setIsChecking(false);
      
      // Start fade out before ending
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, SPLASH_DURATION);
      
      // Hide splash and mark as visited
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('homepage_visited', 'true');
      }, SPLASH_DURATION + FADE_OUT_DURATION);
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    } else {
      // Returning visit - skip splash
      setIsChecking(false);
    }
  }, []);

  // During initial check, show nothing to prevent flash
  if (isChecking) {
    return null;
  }

  // Show splash for first-time visitors
  if (showSplash) {
    return (
      <div className={isFadingOut ? 'animate-fade-out' : ''}>
        <SplashScreen 
          showWordmark={true}
          wordmarkSize="lg"
        />
      </div>
    );
  }

  // Show landing page
  return <LandingPage />;
};

export default FirstVisitSplash;
