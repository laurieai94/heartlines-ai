import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Safe sessionStorage access with fallback
    try {
      return !sessionStorage.getItem("homepage-visited");
    } catch (error) {
      console.log("SessionStorage not available, showing splash");
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
  if (showSplash) {
    return <SplashScreen titleText="heartlines loading..." />;
  }

  return <LandingPage />;
};

export default Index;

