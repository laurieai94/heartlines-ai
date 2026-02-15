import React, { useEffect, useRef, useState } from 'react';

interface TimelineStop {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface TimelineProps {
  stops: TimelineStop[];
}

// Custom Heartlines-style icons — 48x48, stroke-width 2, per-icon gradient hues

// Card 1: "no fake positivity" — broken speech bubble with crossed-out smiley
export const HeartSupportIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7b6b" />
        <stop offset="100%" stopColor="#e84393" />
      </linearGradient>
    </defs>
    {/* Speech bubble outline with gap/break */}
    <path d="M10 14c0-3 2.5-5 6-5h16c3.5 0 6 2 6 5v12c0 3-2.5 5-6 5H22l-6 5v-5h-6V14z" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="4 2"/>
    {/* Smiley face */}
    <circle cx="20" cy="19" r="1.5" fill="url(#heart-gradient)"/>
    <circle cx="28" cy="19" r="1.5" fill="url(#heart-gradient)"/>
    <path d="M19 24c1.5 2 5.5 2 7 0" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round"/>
    {/* Cross-out slash */}
    <path d="M14 10l20 22" stroke="url(#heart-gradient)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
  </svg>
);

// Card 2: "for actual humans" — rainbow arc with abstract diverse figures
export const InclusiveIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="inclusive-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    {/* Rainbow arc */}
    <path d="M8 34c0-8.837 7.163-16 16-16s16 7.163 16 34" stroke="url(#inclusive-gradient)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
    <path d="M12 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="url(#inclusive-gradient)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 34" stroke="url(#inclusive-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Three diverse abstract figures */}
    <circle cx="16" cy="38" r="2.5" stroke="url(#inclusive-gradient)" strokeWidth="2" fill="none"/>
    <circle cx="24" cy="36" r="2.5" stroke="url(#inclusive-gradient)" strokeWidth="2" fill="none"/>
    <circle cx="32" cy="38" r="2.5" stroke="url(#inclusive-gradient)" strokeWidth="2" fill="none"/>
    <path d="M16 41v3M24 39v5M32 41v3" stroke="url(#inclusive-gradient)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Card 3: "made for right now" — lightning bolt through a clock
export const ClockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="clock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ff6b35" />
      </linearGradient>
    </defs>
    {/* Clock circle */}
    <circle cx="24" cy="24" r="14" stroke="url(#clock-gradient)" strokeWidth="2" fill="none"/>
    {/* Clock hands */}
    <path d="M24 14v10l5 5" stroke="url(#clock-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Lightning bolt overlay */}
    <path d="M26 6l-6 16h8l-6 18" stroke="url(#clock-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
  </svg>
);

// Card 4: "conflict-ready" — two speech bubbles colliding with a spark
export const ConversationIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="conversation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7b6b" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Left speech bubble */}
    <path d="M6 12c0-2.5 2-4 4.5-4h10c2.5 0 4.5 1.5 4.5 4v7c0 2.5-2 4-4.5 4h-4l-4 4v-4H10.5c-2.5 0-4.5-1.5-4.5-4v-7z" stroke="url(#conversation-gradient)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    {/* Right speech bubble */}
    <path d="M23 20c0-2.5 2-4 4.5-4h10c2.5 0 4.5 1.5 4.5 4v7c0 2.5-2 4-4.5 4H34l-4 4v-4h-2.5c-2.5 0-4.5-1.5-4.5-4v-7z" stroke="url(#conversation-gradient)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    {/* Spark / collision */}
    <path d="M22 18l2-3M24 22l3-1M22 24l1 3" stroke="url(#conversation-gradient)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Card 5: "private, always" — lock with heart-shaped keyhole
export const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    {/* Lock body */}
    <rect x="12" y="20" width="24" height="18" rx="4" stroke="url(#shield-gradient)" strokeWidth="2" fill="none"/>
    {/* Lock shackle */}
    <path d="M16 20v-5c0-4.418 3.582-8 8-8s8 3.582 8 8v5" stroke="url(#shield-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Heart keyhole */}
    <path d="M24 27c-1-1-3-1-3 1s2 3 3 4c1-1 3-2 3-4s-2-2-3-1z" stroke="url(#shield-gradient)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    <path d="M24 32v3" stroke="url(#shield-gradient)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Card 6: "context-aware" — brain with connecting threads
export const PersonalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="personal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="100%" stopColor="#ff7b6b" />
      </linearGradient>
    </defs>
    {/* Brain outline — left hemisphere */}
    <path d="M24 8c-5 0-10 3-10 9 0 3 1 5 3 7s2 5 2 8h5" stroke="url(#personal-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Brain outline — right hemisphere */}
    <path d="M24 8c5 0 10 3 10 9 0 3-1 5-3 7s-2 5-2 8h-5" stroke="url(#personal-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Brain center line */}
    <path d="M24 8v24" stroke="url(#personal-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    {/* Brain folds */}
    <path d="M18 16c2 1 4 0 6-1M24 15c2 1 4 2 6 1" stroke="url(#personal-gradient)" strokeWidth="2" strokeLinecap="round"/>
    {/* Connecting threads / nodes */}
    <circle cx="10" cy="14" r="2" stroke="url(#personal-gradient)" strokeWidth="2" fill="none"/>
    <circle cx="38" cy="14" r="2" stroke="url(#personal-gradient)" strokeWidth="2" fill="none"/>
    <circle cx="10" cy="28" r="2" stroke="url(#personal-gradient)" strokeWidth="2" fill="none"/>
    <circle cx="38" cy="28" r="2" stroke="url(#personal-gradient)" strokeWidth="2" fill="none"/>
    <path d="M12 14l2 2M36 14l-2 2M12 28l3-2M36 28l-3-2" stroke="url(#personal-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

// Card 7: "built to give back" — hands cupping a seedling
export const CommunityIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="community-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#d4a574" />
      </linearGradient>
    </defs>
    {/* Seedling stem */}
    <path d="M24 22v14" stroke="url(#community-gradient)" strokeWidth="2" strokeLinecap="round"/>
    {/* Left leaf */}
    <path d="M24 22c-6-2-8-8-6-12 4 0 7 4 6 12z" stroke="url(#community-gradient)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    {/* Right leaf */}
    <path d="M24 26c6-1 9-6 8-10-4 0-8 3-8 10z" stroke="url(#community-gradient)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    {/* Left cupping hand */}
    <path d="M8 34c0-3 3-5 7-6l3-1c2 0 3 1 3 3" stroke="url(#community-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M8 34c-1 2-1 4 0 6l4 2" stroke="url(#community-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Right cupping hand */}
    <path d="M40 34c0-3-3-5-7-6l-3-1c-2 0-3 1-3 3" stroke="url(#community-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M40 34c1 2 1 4 0 6l-4 2" stroke="url(#community-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

// Grid placement config for the bento layout
const gridPlacements = [
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-3 md:row-span-1',
];

// Per-card gradient variations
const cardGradients = [
  'bg-gradient-to-br from-burgundy-800/95 via-burgundy-700/85 to-pink-900/75',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-coral-600/10',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/85 to-pink-900/70',
  'bg-gradient-to-r from-burgundy-800/90 via-burgundy-700/80 to-orange-900/30',
  'bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/85 to-coral-600/15',
  'bg-gradient-to-r from-burgundy-800/95 via-burgundy-700/85 to-pink-900/60',
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
      { threshold: 0.15 }
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
          const isLarge = index === 0 || index === 3;
          const isTall = index === 1;

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
                ${isAccent ? 'p-4 md:p-5' : isLarge ? 'p-5 md:p-6' : 'p-4 md:p-5'}
                ${isTall ? 'flex flex-col justify-center' : ''}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                ${isVisible ? 'md:animate-float' : ''}
                relative overflow-hidden
              `}
              style={{
                transitionDelay: `${index * 100}ms`,
                animationDelay: isVisible ? `${index * 1.2}s` : undefined,
              }}
            >
              {/* Inner glow / light sweep */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,132,80,0.15)_0%,_transparent_60%)] rounded-2xl pointer-events-none" />

              {/* Content layer */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`flex ${isAccent ? 'justify-start' : 'justify-center'} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                  <div className={`
                    ${isLarge ? 'p-4 scale-110' : 'p-3'}
                    bg-gradient-to-br from-pink-400/25 via-coral-400/20 to-orange-400/25
                    rounded-2xl backdrop-blur-sm
                    group-hover:shadow-lg group-hover:shadow-pink-400/20 transition-shadow duration-300
                  `}>
                    {stop.icon}
                  </div>
                </div>

                {/* Accent line */}
                <div className={`${isAccent ? '' : 'mx-auto'} w-10 h-0.5 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full mb-3 opacity-60 group-hover:opacity-100 group-hover:w-14 transition-all duration-300`} />

                {/* Title */}
                <h3 className={`
                  text-white font-light tracking-wide leading-tight mb-1.5 font-playfair drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                  ${isAccent ? 'text-lg md:text-xl text-left' : isLarge ? 'text-xl md:text-2xl text-center' : 'text-lg md:text-xl text-center'}
                `}>
                  {stop.title}
                </h3>

                {/* Subtitle */}
                <div className={isAccent ? 'text-left' : 'text-center'}>
                  <p className="text-pink-50/95 text-sm md:text-base font-light tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] group-hover:text-white transition-colors duration-300">
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
