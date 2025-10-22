import React from 'react';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  fullScreen?: boolean;
  children?: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  className,
  fullScreen = false,
  children
}) => {
  const containerClasses = cn(
    'flex items-center justify-center',
    fullScreen ? 'min-h-screen bg-burgundy-800' : 'min-h-32',
    className
  );

  if (variant === 'minimal') {
    return (
      <div className={containerClasses}>
        <LoadingSpinner size={size} />
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        {children}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={containerClasses}>
      <div className="text-center space-y-4">
        <LoadingSpinner size={size} color={fullScreen ? "white" : "primary"} />
        {message && (
          <p className={cn(
            "text-sm animate-pulse",
            fullScreen ? "text-white/70" : "text-muted-foreground"
          )}>
            {message}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default LoadingState;