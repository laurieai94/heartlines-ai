import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigation } from '@/contexts/NavigationContext';
import { BRAND } from '@/branding';

interface UnlockCoachingButtonProps {
  size?: 'default' | 'compact';
  className?: string;
  profileType?: 'personal' | 'partner';
}

export const UnlockCoachingButton = ({ size = 'default', className = '', profileType = 'personal' }: UnlockCoachingButtonProps) => {
  const { goToCoach } = useNavigation();

  const isCompact = size === 'compact';

  return (
    <Button
      variant="glass"
      onClick={goToCoach}
      className={`${isCompact ? 'w-full h-10 px-4' : 'w-auto h-12 px-6'} rounded-full font-semibold text-white transition-all duration-300 glass-cta bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20 ${className}`}
    >
      <Avatar className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} ring-2 ring-white/30 animate-optional-glow`}>
        <AvatarImage 
          src={BRAND.coach.avatarSrc} 
          alt={BRAND.coach.name}
          className="object-cover" 
        />
        <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white font-bold text-sm">
          {BRAND.coach.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="flex items-center gap-1">
        {isCompact 
          ? `Chat with ${BRAND.coach.name}${profileType === 'partner' ? ' about Partner' : ''}` 
          : `Unlock ${profileType === 'partner' ? 'Partner ' : ''}Coaching with ${BRAND.coach.name}`
        }
        <MessageSquare className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </span>
    </Button>
  );
};