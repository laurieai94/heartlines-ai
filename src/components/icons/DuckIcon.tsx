import { memo } from 'react';

interface DuckIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const DuckIcon = memo(({ 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2,
  className = "" 
}: DuckIconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Duck icon"
    >
      {/* Main body - single egg shape */}
      <ellipse cx="12" cy="14" rx="8" ry="6" fill={color} opacity="0.95" />
      
      {/* Head - positioned on top of body */}
      <circle cx="8" cy="8" r="4.5" fill={color} />
      
      {/* Beak - MUCH larger and more prominent with orange color */}
      <path d="M3.5 8 L0.5 7 L3.5 10 Z" fill="#FFA500" stroke={color} strokeWidth="0.5" />
      
      {/* Eye - larger with clear white highlight */}
      <circle cx="9" cy="7.5" r="1.5" fill="white" />
      <circle cx="9.5" cy="7" r="0.8" fill="#1a1a1a" />
      
      {/* Simple tail bump for character */}
      <path d="M19 14 Q20 12 21 14" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
