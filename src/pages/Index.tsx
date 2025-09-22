import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on first visit in this session
    return !sessionStorage.getItem("homepage-visited");
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("homepage-visited", "true");
      
      // Smart timing: wait for DOM ready + small buffer, or max 1500ms
      const markReady = () => setIsReady(true);
      
      if (document.readyState === 'complete') {
        // Already loaded, minimal delay
        setTimeout(markReady, 300);
      } else {
        // Wait for load with timeout
        const timer = setTimeout(markReady, 1500);
        window.addEventListener('load', () => {
          clearTimeout(timer);
          setTimeout(markReady, 300);
        }, { once: true });
        return () => {
          clearTimeout(timer);
        };
      }
    } else {
      setIsReady(true);
    }
  }, [showSplash]);

  useEffect(() => {
    if (isReady && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReady, showSplash]);

  if (showSplash) {
    return <SplashScreen titleText="heartlines loading..." />;
  }

  return <LandingPage />;
};

export default Index;

