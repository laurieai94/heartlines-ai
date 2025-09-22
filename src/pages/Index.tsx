import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

const Index: React.FC = () => {
  console.log('[Index] Component mounting in full App context...');
  
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

  console.log('[Index] Showing landing page in full App...');
  try {
    return <LandingPage />;
  } catch (error) {
    console.error('[Index] LandingPage render error:', error);
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        color: 'white',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          ❌ LandingPage Error
        </h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
};

export default Index;

