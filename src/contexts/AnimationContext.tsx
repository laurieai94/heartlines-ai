import React, { createContext, useContext, useState } from 'react';

interface AnimationContextType {
  kaiAnimationStarted: boolean;
  setKaiAnimationStarted: (started: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kaiAnimationStarted, setKaiAnimationStarted] = useState(false);
  
  return (
    <AnimationContext.Provider value={{ kaiAnimationStarted, setKaiAnimationStarted }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};
