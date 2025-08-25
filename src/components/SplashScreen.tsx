import React from "react";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-fade-in">
        <HeartlinesWordmark size="xl" className="animate-pulse" />
      </div>
    </div>
  );
};

export default SplashScreen;