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
        bg-burgundy-700/60 backdrop-blur-xl 
        hover:bg-burgundy-600/70 
        border-[3px] border-white/50 hover:border-white/70
        shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_40px_rgba(251,146,140,0.4),0_0_60px_rgba(251,146,140,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(251,146,140,0.6),0_0_100px_rgba(251,146,140,0.4),0_0_120px_rgba(255,182,193,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]
        hover:scale-[1.08] active:scale-[1.02]
        animate-pulse-glow
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
        before:translate-x-[-200%] before:animate-shimmer
        before:transition-opacity before:duration-500
        hover:before:opacity-100 before:opacity-80
        ${className}
      `}
    >
      <Avatar className={`
        ${isCompact ? 'w-6 h-6' : 'w-8 h-8'} 
        ring-[6px] ring-coral-300/95 group-hover/cta:ring-coral-200/100 
        shadow-[0_0_25px_rgba(251,146,140,1),0_0_45px_rgba(251,146,140,0.8),0_0_65px_rgba(255,182,193,0.6),0_0_90px_rgba(255,182,193,0.5),0_0_110px_rgba(255,200,210,0.4),0_0_130px_rgba(255,255,255,0.3)]
        group-hover/cta:shadow-[0_0_30px_rgba(251,146,140,1),0_0_55px_rgba(251,146,140,1),0_0_80px_rgba(255,182,193,0.8),0_0_105px_rgba(255,182,193,0.7),0_0_130px_rgba(255,200,210,0.5),0_0_155px_rgba(255,255,255,0.4)]
        transition-all duration-500
        animate-pulse-subtle
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