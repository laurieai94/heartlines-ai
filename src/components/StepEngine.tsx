import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface StepEngineProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
  showProgress?: boolean;
  showNavigation?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  className?: string;
}

const StepEngine = ({
  currentStep,
  totalSteps,
  progress,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  children,
  showProgress = true,
  showNavigation = true,
  nextButtonText = "Continue",
  previousButtonText = "Back",
  className = ""
}: StepEngineProps) => {
  return (
    <div className={`step-engine-container ${className}`}>
      {showProgress && (
        <div className="step-progress mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-white/70">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="step-content mb-6">
        {children}
      </div>

      {showNavigation && (
        <div className="step-navigation flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {previousButtonText}
          </Button>

          <Button
            onClick={onNext}
            className="flex items-center gap-2 questionnaire-button-primary"
          >
            {nextButtonText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepEngine;