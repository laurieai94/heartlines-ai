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
      {/* Duck outline - continuous path forming classic rubber duck silhouette */}
      <path 
        d="M 2.5 9 
           L 4 8.5
           C 4.5 8 5 7 6 6
           C 7.5 4.5 9.5 4 11 5
           C 12 5.5 12.5 6.5 13 8
           C 13.5 9 14 10 15 11
           C 16.5 12.5 18 13 19.5 13.5
           C 20.5 13.8 21 13.5 21.5 12.5
           C 22 11.5 22 10 21 9.5
           L 20.5 13
           C 20 15 18.5 16.5 16.5 17.5
           C 14 18.5 11 18.5 8.5 17.5
           C 6.5 16.8 5 15.5 4 14
           C 3 12.5 2.5 11 2.5 9.5
           Z"
        fill="none"
      />
    </svg>
  );
});

DuckIcon.displayName = 'DuckIcon';

export default DuckIcon;
