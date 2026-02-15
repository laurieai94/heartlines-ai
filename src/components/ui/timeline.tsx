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

export const Timeline: React.FC<TimelineProps> = ({ stops }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
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
    <div className="relative w-full max-w-5xl mx-auto px-4 py-4">
      {/* Vertical Timeline Line - desktop only */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 -z-10">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-b from-pink-400 via-coral-400 to-orange-400 opacity-40"
          style={{
            boxShadow: '0 0 12px rgba(255,132,80,0.3), 0 0 24px rgba(255,107,157,0.2)',
          }}
        />
      </div>

      {/* Timeline Stops */}
      <div className="space-y-6 md:space-y-0">
        {stops.map((stop, index) => {
          const isLeft = index % 2 === 0;
          const isVisible = visibleItems.has(index);

          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              data-index={index}
              className={`
                relative
                md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 md:items-center md:py-6
              `}
            >
              {/* Left cell */}
              <div className={`hidden md:flex ${isLeft ? 'justify-end' : ''}`}>
                {isLeft && (
                  <TimelineCard
                    stop={stop}
                    isVisible={isVisible}
                    translateFrom="translate-x-8"
                  />
                )}
              </div>

              {/* Center dot - desktop only */}
              <div className="hidden md:flex items-center justify-center">
                <div
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 via-coral-400 to-orange-400 border-[3px] border-burgundy-900 z-10"
                  style={{
                    boxShadow: '0 0 10px rgba(255,132,80,0.5), 0 0 20px rgba(255,107,157,0.3)',
                  }}
                />
              </div>

              {/* Right cell */}
              <div className={`hidden md:flex ${!isLeft ? 'justify-start' : ''}`}>
                {!isLeft && (
                  <TimelineCard
                    stop={stop}
                    isVisible={isVisible}
                    translateFrom="-translate-x-8"
                  />
                )}
              </div>

              {/* Mobile: centered card */}
              <div className="md:hidden">
                <TimelineCard
                  stop={stop}
                  isVisible={isVisible}
                  translateFrom="translate-y-8"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimelineCard: React.FC<{
  stop: { title: string; subtitle: string; icon: React.ReactNode };
  isVisible: boolean;
  translateFrom: string;
}> = ({ stop, isVisible, translateFrom }) => (
  <div
    className={`
      max-w-sm w-full
      bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70
      backdrop-blur-xl rounded-2xl p-3.5 md:p-4
      border border-pink-400/30
      hover:border-orange-400/50
      group hover:-translate-y-1
      transition-all duration-700 ease-out
      hover:shadow-2xl hover:shadow-pink-400/30
      ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateFrom}`}
    `}
  >
    {/* Icon */}
    <div className="flex justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
      <div className="p-3 bg-gradient-to-br from-pink-400/25 via-coral-400/20 to-orange-400/25 rounded-2xl backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-pink-400/20 transition-shadow duration-300">
        {stop.icon}
      </div>
    </div>

    {/* Title */}
    <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-2 leading-tight">
      {stop.title}
    </h3>

    {/* Subtitle */}
    <div className="text-center">
      <p className="text-white/80 text-base md:text-lg leading-relaxed font-light">
        {stop.subtitle.split('(')[0].trim()}
      </p>
      {stop.subtitle.includes('(') && (
        <p className="text-pink-100/60 sm:text-pink-200/50 text-sm md:text-base font-light italic group-hover:text-white/70 transition-colors duration-300 mt-1">
          ({stop.subtitle.split('(')[1]}
        </p>
      )}
    </div>
  </div>
);
