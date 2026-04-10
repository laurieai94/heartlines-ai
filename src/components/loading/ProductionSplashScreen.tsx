import React from 'react';
import { cn } from '@/lib/utils';
import PhoneLockup from '@/components/brand/PhoneLockup';
import LoadingSpinner from './LoadingSpinner';

interface ProductionSplashScreenProps {
  message?: string;
  titleText?: string;
  showWordmark?: boolean;
  wordmarkSize?: 'sm' | 'md' | 'lg';
  messageSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProductionSplashScreen: React.FC<ProductionSplashScreenProps> = ({
  message = "loading...",
  titleText,
  showWordmark = true,
  wordmarkSize = 'lg',
  messageSize = 'md',
  className
}) => {
  const messageSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn(
      "min-h-screen bg-burgundy-800 flex flex-col items-center justify-center p-6",
      className
    )}>
      <div className="text-center space-y-6">
        {/* Phone Lockup */}
        <PhoneLockup 
          size={wordmarkSize} 
          showTagline={showWordmark}
          className="mx-auto"
        />
        
        {/* Title or Message */}
        {titleText ? (
          <h1 className={cn(
            "font-thin text-white/90 tracking-wide",
            messageSizeClasses[messageSize]
          )}>
            {titleText}
          </h1>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <LoadingSpinner size="sm" color="white" />
            <p className={cn(
              "font-light text-white/70 tracking-wide",
              messageSizeClasses[messageSize]
            )}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionSplashScreen;