import React from 'react';

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
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-4">
      {/* Vertical Timeline Line with Enhanced Pink-Orange Gradient Glow */}
      <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 overflow-hidden -z-10">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-pink-400 via-coral-400 via-orange-400 to-pink-400 rounded-full opacity-100"
          style={{
            boxShadow: '0 0 30px hsl(var(--pink-400) / 1), 0 0 50px hsl(var(--coral-400) / 0.9), 0 0 80px hsl(var(--orange-400) / 0.7)'
          }}
        />
      </div>

      {/* Timeline Stops */}
      <div className="space-y-6 md:space-y-8">
        {stops.map((stop, index) => (
          <div 
            key={index}
            className="relative animate-fade-in"
            style={{
              animationDelay: `${index * 0.15}s`
            }}
          >
            {/* Center Dot - Hidden */}
            <div className="hidden absolute left-1/2 top-8 w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-400 via-coral-400 to-orange-400 rounded-full border-4 border-burgundy-900 z-10 group-hover:scale-125 transition-transform duration-300"
              style={{
                boxShadow: '0 0 15px hsl(var(--pink-400) / 0.6), 0 0 30px hsl(var(--coral-400) / 0.4), 0 0 45px hsl(var(--orange-400) / 0.2)'
              }}
            />

            {/* Card with Enhanced Hover Effects */}
            <div className={`
              relative mx-auto max-w-md z-10
              glass-burgundy-solid rounded-2xl p-3.5 md:p-4
              border border-coral-400/20
              hover:border-pink-400/40
              group hover:-translate-y-1 hover:translate-x-0.5
              transition-all duration-300 ease-out
              hover:shadow-2xl hover:shadow-pink-400/30
              before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-pink-500/0 before:via-coral-400/0 before:to-orange-400/0 before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-300
            `}>
              {/* Icon with Pink-Orange Gradient Background */}
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
          </div>
        ))}
      </div>
    </div>
  );
};
