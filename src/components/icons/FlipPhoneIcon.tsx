import { memo } from 'react';
import flipPhone from '@/assets/flip-phone-new.png';

interface FlipPhoneIconProps {
  className?: string;
  size?: number;
}

const FlipPhoneIcon = memo(({ className = "", size }: FlipPhoneIconProps) => {
  return (
    <img 
      src={flipPhone} 
      alt="Menu" 
      className={`${className} transition-all duration-200 hover:rotate-6 active:scale-95`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
});

FlipPhoneIcon.displayName = 'FlipPhoneIcon';

export default FlipPhoneIcon;
