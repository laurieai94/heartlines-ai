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
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Duck icon"
    >
      {/* Head - round duck head */}
      <circle cx="7" cy="10" r="3.5" fill="none" />
      
      {/* Beak - triangular beak pointing left */}
      <path d="M 3.5 10 L 2 9.5 L 2 10.5 Z" fill="white" stroke="white" strokeWidth="2" />
      
      {/* Eye - small dot */}
      <circle cx="7.5" cy="9.5" r="0.8" fill="white" stroke="none" />
      
      {/* Body - large rounded body */}
      <ellipse cx="14" cy="14" rx="6.5" ry="5" fill="none" />
      
      {/* Neck connection - curved line from head to body */}
      <path d="M 9.5 11.5 Q 11 12 12 13" fill="none" strokeWidth="2.5" />
      
      {/* Tail - small upward curve */}
      <path d="M 20 14 Q 21 13 21.5 15" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Bottom line - connecting body bottom */}
      <path d="M 8 17 Q 14 19 20 16.5" fill="none" strokeWidth="2.5" />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
