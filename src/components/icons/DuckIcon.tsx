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
      {/* Main body - rounder duck body */}
      <ellipse cx="13" cy="15" rx="7" ry="5.5" fill={color} opacity="0.95" />
      
      {/* Head - duck head */}
      <circle cx="7" cy="8" r="4" fill={color} />
      
      {/* Curved neck connecting head to body */}
      <path d="M9 10.5 Q11 12 12 13.5" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      
      {/* Larger, more prominent beak with triangular shape */}
      <path d="M3 8 L0 7.5 L3 9.5 Z" fill="#FFD700" stroke="#FFC700" strokeWidth="0.8" />
      <path d="M3 8.5 Q1.5 8.5 1.5 8.2" stroke="#FFC700" strokeWidth="0.5" fill="none" />
      
      {/* Eye - clear and visible */}
      <circle cx="8" cy="7.5" r="1.3" fill="white" />
      <circle cx="8.4" cy="7.2" r="0.7" fill="#1a1a1a" />
      
      {/* Wing detail on body */}
      <path d="M13 13 Q15 14 16 15.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      
      {/* Prominent upward-pointing tail */}
      <path d="M19 15 Q21 13 22 11" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M19.5 15.5 Q20.5 14 21 12.5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
