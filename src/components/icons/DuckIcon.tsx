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
      {/* Duck body */}
      <ellipse cx="13" cy="15" rx="7" ry="5" fill={color} opacity="0.9" />
      
      {/* Duck head */}
      <circle cx="9" cy="9" r="4" fill={color} />
      
      {/* Duck beak - prominent triangle */}
      <path d="M5 9 L2 8 L5 10 Z" fill={color} opacity="0.85" />
      
      {/* Eye - larger and more visible */}
      <circle cx="10" cy="8.5" r="1.2" fill="white" />
      <circle cx="10.3" cy="8.3" r="0.6" fill="#000" opacity="0.8" />
      
      {/* Neck/back curve for definition */}
      <path 
        d="M9 13 Q11 12, 13 13" 
        stroke={color} 
        strokeWidth="2.5" 
        fill="none"
        opacity="0.7"
      />
      
      {/* Tail accent */}
      <path 
        d="M19 15 Q21 14, 20 16" 
        stroke={color} 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
