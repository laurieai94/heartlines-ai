import React, { useState, useEffect, Suspense } from "react";
import SplashScreen from "@/components/SplashScreen";

const LandingPage = React.lazy(() => import("@/components/LandingPage"));

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on first visit in this session
    return !sessionStorage.getItem("homepage-visited");
  });

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("homepage-visited", "true");
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <LandingPage />
    </Suspense>
  );
};

export default Index;

