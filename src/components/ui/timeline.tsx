import React, { useEffect, useRef, useState } from 'react';

interface TimelineStop {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface TimelineProps {
  stops: TimelineStop[];
}

// Custom Heartlines-style icons with minimal line art and gradients
export const PersonalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="personal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="10" r="5" stroke="url(#personal-gradient)" strokeWidth="1.5" fill="none"/>
    <path d="M8 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="url(#personal-gradient)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M12 22l2 2 4-4" stroke="url(#personal-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InclusiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="inclusive-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="16" r="6" stroke="url(#inclusive-gradient)" strokeWidth="1.5" fill="none"/>
    <circle cx="20" cy="16" r="6" stroke="url(#inclusive-gradient)" strokeWidth="1.5" fill="none"/>
    <path d="M16 13l-2 2 2 2 2-2-2-2z" stroke="url(#inclusive-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <path d="M16 4l-8 3v7c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-3z" stroke="url(#shield-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M11 15l3 3 6-6" stroke="url(#shield-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartSupportIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <path d="M16 26s-8-5-8-12c0-3 2-5 5-5 2 0 3 1 3 3 0-2 1-3 3-3 3 0 5 2 5 5 0 7-8 12-8 12z" stroke="url(#heart-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 16h4M16 14v4" stroke="url(#heart-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="clock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="10" stroke="url(#clock-gradient)" strokeWidth="1.5" fill="none"/>
    <path d="M16 8v8l4 4" stroke="url(#clock-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6l2 2M8 6L6 8" stroke="url(#clock-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ConversationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="conversation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <path d="M6 10c0-2 1.5-4 4-4h12c2.5 0 4 2 4 4v8c0 2-1.5 4-4 4h-8l-4 4v-4h-4v-12z" stroke="url(#conversation-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M12 14h8M12 18h5" stroke="url(#conversation-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CommunityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="community-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8450" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    {/* Globe outline */}
    <circle cx="16" cy="16" r="10" stroke="url(#community-gradient)" strokeWidth="1.5" fill="none"/>
    {/* Vertical meridian */}
    <ellipse cx="16" cy="16" rx="4" ry="10" stroke="url(#community-gradient)" strokeWidth="1.5" fill="none"/>
    {/* Horizontal latitude lines */}
    <path d="M6 12h20" stroke="url(#community-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 20h20" stroke="url(#community-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Equator */}
    <path d="M6 16h20" stroke="url(#community-gradient)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// Grid placement config for the bento layout
const gridPlacements = [
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
];

// Per-card gradient variations — accent cards at indices 2, 4
const cardGradients = [
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/85 to-pink-900/70',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-coral-600/10',
  'bg-gradient-to-r from-coral-600/30 via-pink-600/25 to-rose-700/35 border-coral-400/50',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70',
  'bg-gradient-to-br from-rose-700/35 via-pink-600/30 to-coral-600/25 border-pink-400/50',
  'bg-gradient-to-r from-coral-600/25 via-burgundy-700/80 to-pink-600/30 border-coral-400/45',
];

export const Timeline: React.FC<TimelineProps> = ({ stops }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting && !isNaN(index)) {
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [stops.length]);

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stops.map((stop, index) => {
          const isVisible = visibleItems.has(index);
          const isAccent = index === stops.length - 1;
          const isLarge = index === 1 || index === 2 || index === 5;
          const isAccentCard = index === 2 || index === 4 || index === 6;

          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              data-index={index}
              className={`
                ${gridPlacements[index] || ''}
                ${cardGradients[index] || cardGradients[2]}
                backdrop-blur-xl rounded-2xl
                border border-pink-400/30
                hover:border-orange-400/50
                group hover:-translate-y-1
                transition-all duration-700 ease-out
                hover:shadow-[0_8px_32px_rgba(255,132,80,0.2),0_0_60px_rgba(236,72,153,0.15)]
                ${isAccent ? 'p-5 md:p-7' : isLarge ? 'p-5 md:p-6' : 'p-4 md:p-5'}
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
                ${isVisible ? 'md:animate-float' : ''}
                relative overflow-hidden
              `}
              style={{
                transitionDelay: `${index * 150}ms`,
                animationDelay: isVisible ? `${index * 1.2}s` : undefined,
              }}
            >
              {/* Inner glow / light sweep */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,132,80,0.15)_0%,_transparent_60%)] rounded-2xl pointer-events-none" />

              {/* Subtle pattern overlay for the full-width bottom card */}
              {isAccent && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-2xl"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,132,80,0.5) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />
              )}

              {/* Content layer */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                  <div className={`
                    ${isLarge ? 'p-3.5 scale-125' : 'p-2.5'}
                    ${isAccentCard 
                      ? 'border border-coral-400/40 bg-transparent rounded-2xl' 
                      : 'bg-gradient-to-br from-pink-400/25 via-coral-400/20 to-orange-400/25 rounded-2xl backdrop-blur-sm'}
                    group-hover:shadow-lg group-hover:shadow-pink-400/20 transition-shadow duration-300
                  `}>
                    {stop.icon}
                  </div>
                </div>

                {/* Accent line */}
                <div className="mx-auto w-10 h-0.5 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full mb-3 opacity-60 group-hover:opacity-100 group-hover:w-14 transition-all duration-300" />

                {/* Title */}
                <h3 className={`
                  text-white font-light tracking-wide leading-tight mb-1.5 font-playfair drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-center
                  ${isAccent || isLarge ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}
                `}>
                  {stop.title}
                </h3>

                {/* Subtitle */}
                <div className="text-center">
                  <p className={`text-pink-50/95 font-light tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] group-hover:text-white transition-colors duration-300 ${isAccent ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                    {stop.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
