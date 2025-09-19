import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on first visit in this session
    return !sessionStorage.getItem("homepage-visited");
  });

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("homepage-visited", "true");
      
      // Single, clean transition after minimal delay
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen titleText="heartlines loading..." />;
  }

  return <LandingPage />;
};

export default Index;

