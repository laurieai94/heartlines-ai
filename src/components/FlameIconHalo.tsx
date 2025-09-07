import React from 'react';

interface FlameIconHaloProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const FlameIconHalo: React.FC<FlameIconHaloProps> = ({ 
  children,
  className = '',
  intensity = 'medium',
  size = 'md',
  animated = true
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { halo: 'w-8 h-8', flames: 'w-6 h-6' };
      case 'lg': return { halo: 'w-20 h-20', flames: 'w-16 h-16' };
      default: return { halo: 'w-12 h-12', flames: 'w-10 h-10' };
    }
  };

  const getIntensityStyles = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-[0.04]';
      case 'strong': return 'opacity-[0.12] flame-glow';
      default: return 'opacity-[0.08]';
    }
  };

  const styles = getSizeStyles();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Flame halo background */}
      <div className={`absolute ${styles.halo} ${getIntensityStyles()}`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Radial flame pattern */}
          <g fill="white">
            {/* Primary flames */}
            <path
              d="M50 15c-2-8 3-12 6-10 3 2 4 6 3 9-1 2-4 4-7 2-2-1-2-2-2 1z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '0s', 
                animationDuration: '3s' 
              }}
            />
            <path
              d="M75 30c-3-6 2-10 5-8 2 1 3 5 2 7-1 2-3 3-5 2-1-1-2-1-2 1z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '0.5s', 
                animationDuration: '2.5s' 
              }}
            />
            <path
              d="M85 50c-2-5 1-8 4-7 2 1 2 4 2 6-1 1-2 2-4 1-1-1-1-1-2 0z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '1s', 
                animationDuration: '3.5s' 
              }}
            />
            <path
              d="M75 70c-2-6 2-9 4-8 2 1 3 4 2 6-1 2-3 3-4 2-1-1-1-1-2 0z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '1.5s', 
                animationDuration: '2.8s' 
              }}
            />
            <path
              d="M50 85c-3-7 2-11 5-9 3 2 4 5 3 8-1 2-3 4-6 2-2-1-2-2-2 1z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '2s', 
                animationDuration: '3.2s' 
              }}
            />
            <path
              d="M25 70c-2-5 1-8 4-7 2 1 2 4 2 6-1 1-2 2-4 1-1-1-1-1-2 0z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '2.5s', 
                animationDuration: '2.7s' 
              }}
            />
            <path
              d="M15 50c-2-6 2-9 4-8 2 1 3 4 2 6-1 2-3 3-4 2-1-1-1-1-2 0z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '3s', 
                animationDuration: '3.8s' 
              }}
            />
            <path
              d="M25 30c-2-5 1-8 4-7 2 1 2 4 2 6-1 1-2 2-4 1-1-1-1-1-2 0z"
              className={animated ? 'animate-flame-flicker' : ''}
              style={{ 
                transformOrigin: '50% 50%',
                animationDelay: '3.5s', 
                animationDuration: '2.6s' 
              }}
            />
          </g>
          
          {/* Inner glow circle */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.1"
            className={animated ? 'animate-pulse' : ''}
          />
        </svg>
      </div>

      {/* Soft radial glow behind icon */}
      <div 
        className={`absolute ${styles.halo} bg-white rounded-full blur-md ${
          intensity === 'strong' ? 'opacity-[0.08]' : 'opacity-[0.04]'
        } ${animated ? 'animate-pulse' : ''}`}
        style={{ animationDuration: '4s' }}
      />

      {/* Content (icon/button) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FlameIconHalo;