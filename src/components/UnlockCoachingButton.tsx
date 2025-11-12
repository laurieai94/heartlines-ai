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
        bg-gradient-to-r from-burgundy-700/60 via-coral-600/50 to-burgundy-700/60 bg-[length:200%_100%]
        hover:from-burgundy-600/70 hover:via-coral-500/60 hover:to-burgundy-600/70
        animate-gradient-x
        backdrop-blur-xl 
        border-[3px] border-white/50 hover:border-white/70
        shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_60px_rgba(251,146,140,0.7),0_0_90px_rgba(251,146,140,0.5),0_0_120px_rgba(251,146,140,0.3),0_0_200px_rgba(251,146,140,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_80px_rgba(251,146,140,0.9),0_0_140px_rgba(251,146,140,0.7),0_0_180px_rgba(255,182,193,0.5),0_0_250px_rgba(251,146,140,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]
        hover:scale-[1.08] active:scale-[1.02]
        animate-pulse-glow animate-float
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:translate-x-[-200%] before:animate-shimmer
        before:transition-opacity before:duration-500
        hover:before:opacity-100 before:opacity-60
        ${className}
      `}
    >
      <Avatar className={`
        ${isCompact ? 'w-6 h-6' : 'w-8 h-8'} 
        ring-[3px] ring-coral-400/60 group-hover/cta:ring-coral-300/80 
        shadow-[0_0_20px_rgba(251,146,140,0.4)] 
        group-hover/cta:shadow-[0_0_40px_rgba(251,146,140,0.8)]
        group-hover/cta:scale-110 group-hover/cta:rotate-2
        transition-all duration-500
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
        <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(251,146,140,0.4)' }}>
          {isCompact 
            ? `chat with ${BRAND.coach.name}${profileType === 'partner' ? ' about partner' : ''}` 
            : `unlock ${profileType === 'partner' ? 'partner ' : ''}coaching with ${BRAND.coach.name}`
          }
        </span>
        <MessageSquare className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      </span>
    </Button>
  );
};