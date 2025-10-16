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
      stroke="none"
      className={className}
      aria-label="Duck icon"
    >
      {/* Body - rounded duck body shape */}
      <ellipse cx="14" cy="14" rx="7" ry="5.5" fill={color} />
      
      {/* Head - round and distinct on the left */}
      <circle cx="7" cy="9" r="4" fill={color} />
      
      {/* Neck connection - smooth transition */}
      <ellipse cx="10" cy="11.5" rx="2.5" ry="3" fill={color} />
      
      {/* Beak - large, prominent, bright orange */}
      <path 
        d="M3 9 L1 8.5 L1 9.5 L3 10 Z" 
        fill="#FF8C00" 
        stroke="#FF6B00" 
        strokeWidth="0.5"
      />
      
      {/* Eye - large and prominent with bright highlight */}
      <circle cx="8" cy="8.5" r="1.3" fill="white" />
      <circle cx="8.3" cy="8.2" r="0.7" fill="#1a1a1a" />
      <circle cx="8.5" cy="8" r="0.3" fill="white" opacity="0.9" />
      
      {/* Wing detail - curved line on body */}
      <path 
        d="M12 12 Q14 13 15 15" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.3"
      />
      
      {/* Tail - upward curved duck tail */}
      <path 
        d="M20 14 Q21.5 12 22 15" 
        stroke={color} 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round"
      />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
