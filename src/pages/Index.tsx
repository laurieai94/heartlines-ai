import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

const Index: React.FC = () => {
  console.log('[Index] Component mounting...');
  
  const [showSplash, setShowSplash] = useState(() => {
    // Safe sessionStorage access with fallback
    try {
      const hasVisited = !sessionStorage.getItem("homepage-visited");
      console.log('[Index] SessionStorage check:', hasVisited);
      return hasVisited;
    } catch (error) {
      console.log("[Index] SessionStorage not available, showing splash", error);
      return true;
    }
  });

  useEffect(() => {
    if (showSplash) {
      try {
        sessionStorage.setItem("homepage-visited", "true");
      } catch (error) {
        console.log("Cannot set sessionStorage");
      }
      
      // Single, clean transition after minimal delay
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Always render something visible
  console.log('[Index] Rendering with showSplash:', showSplash);
  
  if (showSplash) {
    console.log('[Index] Showing splash screen');
    return <SplashScreen titleText="heartlines loading..." />;
  }

  console.log('[Index] Showing landing page');
  return <LandingPage />;
};

export default Index;

