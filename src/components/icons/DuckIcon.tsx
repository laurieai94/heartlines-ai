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
      role="img"
      aria-label="Duck icon"
    >
      {/* Duck body - rounded bottom */}
      <path d="M5 14c0 3.866 3.134 7 7 7s7-3.134 7-7" />
      
      {/* Duck back/tail area */}
      <path d="M19 14c0-2-1-4-2-5" />
      <path d="M5 14c0-2 1-4 2-5" />
      
      {/* Duck head/neck */}
      <circle cx="12" cy="8" r="3.5" />
      
      {/* Beak */}
      <path d="M15.2 8h2.3" strokeWidth={strokeWidth + 0.5} />
      
      {/* Eye */}
      <circle cx="13.2" cy="7.5" r="0.8" fill={color} stroke="none" />
      
      {/* Wing detail */}
      <path d="M10 16c0.5-0.5 1.5-1 2.5-1s2 0.5 2.5 1" />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
