import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import FlameIconHalo from "@/components/brand/FlameIconHalo";

interface NavAvatarProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const NavAvatar = ({ children, icon: Icon, className }: NavAvatarProps) => {
  const reduceMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const uniqueId = `nav-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <FlameIconHalo intensity="medium" size="lg" animated={!reduceMotion}>
      <div className={cn(
        "relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24",
        "flex items-center justify-center",
        "transition-all duration-300 hover:scale-105",
        className
      )}>
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <defs>
            {/* Molten gradient */}
            <linearGradient id={`navLava-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC76A">
                {!reduceMotion && (
                  <animate attributeName="offset" values="0%;10%;0%" dur="7s" repeatCount="indefinite" />
                )}
              </stop>
              <stop offset="55%" stopColor="#FF6F98" />
              <stop offset="100%" stopColor="#E3476B" />
            </linearGradient>

            {/* Liquid animation filter */}
            <filter id={`navLiquid-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="2" result="noise">
                {!reduceMotion && (
                  <animate attributeName="baseFrequency" values="0.55;0.8;0.55" dur="6s" repeatCount="indefinite" />
                )}
              </feTurbulence>
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={reduceMotion ? 2 : 5} 
                xChannelSelector="R" 
                yChannelSelector="G"
              >
                {!reduceMotion && (
                  <animate attributeName="scale" values="3;6;3" dur="6s" repeatCount="indefinite" />
                )}
              </feDisplacementMap>
            </filter>

            {/* Glow filter */}
            <filter id={`navGlow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
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
            filter={`url(#navGlow-${uniqueId})`}
            opacity="0.55"
          />

          {/* Main heart with molten fill */}
          <path
            d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z"
            fill={`url(#navLava-${uniqueId})`}
            filter={`url(#navLiquid-${uniqueId})`}
            stroke="white"
            strokeWidth="3"
          />

          {/* Dashed inner accent with rotation */}
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

        {/* Initial overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center isolate pointer-events-none">
          <div
            className="text-white font-brand uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl pointer-events-auto"
            style={{
              fontFamily: "'Shrikhand', cursive",
              textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3), 0 0 2px rgba(0,0,0,0.8)'
            }}
          >
            {children}
          </div>
          {Icon && (
            <Icon 
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-white"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3))'
              }}
            />
          )}
        </div>
      </div>
    </FlameIconHalo>
  );
};

export default NavAvatar;
