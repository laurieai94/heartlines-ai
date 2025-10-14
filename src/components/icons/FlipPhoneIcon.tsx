import { memo } from 'react';
import flipPhone from '@/assets/flip-phone.svg';

interface FlipPhoneIconProps {
  className?: string;
  size?: number;
}

const FlipPhoneIcon = memo(({ className = "", size }: FlipPhoneIconProps) => {
  const sizeClass = className || `h-6 w-6`;
  
  return (
    <img 
      src={flipPhone} 
      alt="Menu" 
      className={`${sizeClass} transition-all duration-200 hover:rotate-6 active:scale-95`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
});

FlipPhoneIcon.displayName = 'FlipPhoneIcon';

export default FlipPhoneIcon;
