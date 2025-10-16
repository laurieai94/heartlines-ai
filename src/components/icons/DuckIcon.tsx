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
      {/* Duck body - rounded bottom */}
      <ellipse cx="12" cy="16" rx="6" ry="4.5" />
      
      {/* Duck head */}
      <circle cx="12" cy="8" r="3.5" />
      
      {/* Neck connection */}
      <path d="M10 11 C10 12, 11 13, 12 13 C13 13, 14 12, 14 11" />
      
      {/* Beak */}
      <path d="M15 8 L17.5 8 L16.5 9 Z" fill={color} />
      
      {/* Eye */}
      <circle cx="13" cy="7.5" r="0.8" fill={color} />
      
      {/* Wing detail */}
      <path d="M8 15 Q6 16, 7 17" />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
