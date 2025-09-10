import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseStepEngineProps {
  totalSteps: number;
  onComplete: () => void;
  autoAdvanceDelay?: number;
}

export const useStepEngine = ({ totalSteps, onComplete, autoAdvanceDelay = 800 }: UseStepEngineProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current step from URL params
  const getCurrentStep = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const step = parseInt(params.get('step') || '0');
    return Math.max(0, Math.min(step, totalSteps - 1));
  }, [location.search, totalSteps]);

  const [currentStep, setCurrentStep] = useState(getCurrentStep);

  // Update step when URL changes
  useEffect(() => {
    setCurrentStep(getCurrentStep());
  }, [getCurrentStep]);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= totalSteps) return;
    
    const params = new URLSearchParams(location.search);
    params.set('step', step.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [navigate, location, totalSteps]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, goToStep, onComplete]);

  const goPrevious = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const autoAdvance = useCallback(() => {
    setTimeout(() => {
      goNext();
    }, autoAdvanceDelay);
  }, [goNext, autoAdvanceDelay]);

  return {
    currentStep,
    totalSteps,
    goNext,
    goPrevious,
    goToStep,
    autoAdvance,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100
  };
};