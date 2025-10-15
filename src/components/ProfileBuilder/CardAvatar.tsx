import React, { useId } from 'react';
import FlameIconHalo from '@/components/FlameIconHalo';

interface CardAvatarProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CardAvatar = ({ children, className = "", size = 'md' }: CardAvatarProps) => {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const uniqueId = `${useId()}-${Math.random().toString(36).substring(2, 9)}`;

  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return {
          container: 'w-10 h-10',
          text: 'text-lg',
          haloSize: 'sm' as const
        };
      case 'lg':
        return {
          container: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
          text: 'text-3xl sm:text-4xl md:text-5xl',
          haloSize: 'lg' as const
        };
      case 'md':
      default:
        return {
          container: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
          text: 'text-xl sm:text-2xl md:text-3xl',
          haloSize: 'md' as const
        };
    }
  };
  
  const sizeClasses = getSizeClasses();

  return (
    <div className={`relative ${className}`}>
      {/* Heart container with flame halo */}
      <FlameIconHalo intensity="strong" size={sizeClasses.haloSize} animated={!reduceMotion}>
        <div className={`relative ${sizeClasses.container} flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <defs>
            {/* Warm molten gradient */}
            <linearGradient id={`lavaGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC76A">
                {!reduceMotion && <animate attributeName="offset" values="0%;10%;0%" dur="7s" repeatCount="indefinite" />}
              </stop>
              <stop offset="55%" stopColor="#FF6F98" />
              <stop offset="100%" stopColor="#E3476B" />
            </linearGradient>

            {/* Liquid flame filter */}
            <filter id={`liquid-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="2" result="noise">
                {!reduceMotion && <animate attributeName="baseFrequency" values="0.55;0.8;0.55" dur="6s" repeatCount="indefinite" />}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={reduceMotion ? 2 : 5} xChannelSelector="R" yChannelSelector="G">
                {!reduceMotion && <animate attributeName="scale" values="3;6;3" dur="6s" repeatCount="indefinite" />}
              </feDisplacementMap>
            </filter>

            {/* Soft glow filter for outer stroke */}
            <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow stroke behind heart */}
          <path
            d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
            fill="none"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="8"
            filter={`url(#glow-${uniqueId})`}
            opacity="0.55"
          />

          {/* Main heart with molten fill */}
          <path
            d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
            fill={`url(#lavaGrad-${uniqueId})`}
            filter={`url(#liquid-${uniqueId})`}
            stroke="white"
            strokeWidth="3"
          />

          {/* Dashed inner accent with slower spin */}
          <path
            d="M100 150 C 94 144, 67 123, 54 108 C 37 88, 39 63, 58 55 C 69 50, 83 53, 92 65 C 101 53, 115 50, 126 55 C 145 63, 147 86, 133 105 C 121 121, 106 139, 100 150 Z"
            fill="none"
            stroke="white"
            strokeDasharray="2,3"
            strokeOpacity="0.6"
            className={!reduceMotion ? 'animate-spin' : undefined}
            style={{ animationDuration: '12s' }}
          />
        </svg>

        {/* Foreground content (initials / icon) */}
        <div className="absolute inset-0 z-10 w-full h-full text-white flex items-center justify-center">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-semibold drop-shadow text-center -mt-1 sm:-mt-2 md:-mt-2.5 ${sizeClasses.text}`}>
            {children}
          </div>
        </div>
        </div>
      </FlameIconHalo>
    </div>
  );
};

export default CardAvatar;