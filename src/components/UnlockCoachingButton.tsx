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
      className={`
        group/cta relative overflow-hidden
        ${isCompact ? 'w-full h-10 px-4' : 'w-auto h-12 px-6'} 
        rounded-full font-semibold text-white 
        transition-all duration-500 ease-out
        bg-burgundy-700/30 backdrop-blur-2xl 
        hover:bg-burgundy-600/40 
        border-2 border-white/20 hover:border-white/30
        shadow-[0_2px_12px_rgba(0,0,0,0.2),0_0_20px_rgba(251,146,140,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.25),0_0_30px_rgba(251,146,140,0.25),0_0_50px_rgba(251,146,140,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]
        hover:scale-[1.03] active:scale-[1.02]
        ${className}
      `}
    >
      <Avatar className={`
        ${isCompact ? 'w-6 h-6' : 'w-8 h-8'} 
        ring-[3px] ring-coral-300/40 group-hover/cta:ring-coral-200/60 
        shadow-[0_0_15px_rgba(251,146,140,0.3),0_0_30px_rgba(255,182,193,0.2),0_0_50px_rgba(255,255,255,0.1)]
        group-hover/cta:shadow-[0_0_20px_rgba(251,146,140,0.4),0_0_40px_rgba(255,182,193,0.3),0_0_60px_rgba(255,255,255,0.15)]
        transition-all duration-500
        animate-breathe
      `}>
        <AvatarImage 
          src={BRAND.coach.avatarSrc} 
          alt={BRAND.coach.name}
          className="object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <AvatarFallback className="bg-gradient-to-br from-coral-400 to-pink-500 text-white font-bold text-sm">
          {BRAND.coach.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="flex items-center gap-1 relative z-10">
        {isCompact 
          ? `chat with ${BRAND.coach.name}${profileType === 'partner' ? ' about partner' : ''}` 
          : `unlock ${profileType === 'partner' ? 'partner ' : ''}coaching with ${BRAND.coach.name}`
        }
        <MessageSquare className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </span>
    </Button>
  );
};