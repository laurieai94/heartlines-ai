import { memo } from 'react';
import flipPhone from '@/assets/flip-phone.svg';

interface FlipPhoneIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

const FlipPhoneIcon = memo(({ className = "", size, animated = false }: FlipPhoneIconProps) => {
  return (
    <img 
      src={flipPhone} 
      alt="Menu" 
      className={`${className} ${animated ? 'animate-wiggle' : ''} transition-all duration-200 hover:rotate-6 active:scale-95`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
});

FlipPhoneIcon.displayName = 'FlipPhoneIcon';

export default FlipPhoneIcon;
