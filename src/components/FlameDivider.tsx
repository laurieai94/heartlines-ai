import React from 'react';

interface FlameDividerProps {
  className?: string;
  orientation?: 'top' | 'bottom';
  intensity?: 'subtle' | 'medium' | 'strong';
}

const FlameDivider: React.FC<FlameDividerProps> = ({ 
  className = '',
  orientation = 'bottom',
  intensity = 'medium'
}) => {
  const getIntensityStyles = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-[0.06] blur-[1px]';
      case 'strong': return 'opacity-[0.12] flame-glow';
      default: return 'opacity-[0.08]';
    }
  };

  const getHeight = () => {
    switch (intensity) {
      case 'subtle': return 'h-8';
      case 'strong': return 'h-16';
      default: return 'h-12';
    }
  };

  return (
    <div className={`relative w-full ${getHeight()} overflow-hidden ${className}`}>
      <svg
        className={`absolute inset-0 w-full h-full ${getIntensityStyles()}`}
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          transform: orientation === 'top' ? 'rotate(180deg)' : 'none'
        }}
      >
        <defs>
          <pattern id="flame-pattern" x="0" y="0" width="60" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M15 90c-3-8 2-15 6-13 3 2 4 7 3 11-1 3-4 5-7 3-2-1-2-2-2 1z"
              fill="white"
              className="animate-flame-flicker"
              style={{ animationDelay: '0s', animationDuration: '3s' }}
            />
            <path
              d="M35 85c-2-12 4-20 8-18 4 2 6 8 5 14-1 4-5 6-9 4-3-1-4-4-4 0z"
              fill="white"
              className="animate-flame-flicker"
              style={{ animationDelay: '1s', animationDuration: '4s' }}
            />
            <path
              d="M50 88c-1-6 2-10 4-9 2 1 3 4 2 7-1 2-3 3-5 2-1-1-1-2-1 0z"
              fill="white"
              className="animate-flame-flicker"
              style={{ animationDelay: '2s', animationDuration: '2.5s' }}
            />
          </pattern>
        </defs>
        
        {/* Base flame edge */}
        <path
          d="M0 100 Q60 70 120 85 Q180 65 240 80 Q300 60 360 75 Q420 55 480 70 Q540 50 600 65 Q660 45 720 60 Q780 40 840 55 Q900 35 960 50 Q1020 30 1080 45 Q1140 25 1200 40 L1200 100 Z"
          fill="url(#flame-pattern)"
        />
        
        {/* Secondary flame layer for depth */}
        <path
          d="M0 100 Q80 75 160 90 Q240 70 320 85 Q400 65 480 80 Q560 60 640 75 Q720 55 800 70 Q880 50 960 65 Q1040 45 1120 60 Q1160 40 1200 50 L1200 100 Z"
          fill="white"
          className="opacity-30 animate-flame-drift"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Accent flames for sparkle effect */}
        {Array.from({ length: 8 }, (_, i) => (
          <circle
            key={i}
            cx={150 * i + 75}
            cy={80 + Math.sin(i) * 10}
            r="1"
            fill="white"
            className="animate-pulse opacity-60"
            style={{ 
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          />
        ))}
      </svg>
      
      {/* Soft glow backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-white/3 to-transparent blur-sm"
        style={{
          transform: orientation === 'top' ? 'rotate(180deg)' : 'none'
        }}
      />
    </div>
  );
};

export default FlameDivider;