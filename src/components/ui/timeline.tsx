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
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Vertical Timeline Line with Enhanced Pink-Orange Gradient Glow */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-1.5 -translate-x-1/2 overflow-visible z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-pink-400 via-coral-400 via-orange-400 to-pink-400 rounded-full opacity-60"
          style={{
            boxShadow: '0 0 20px hsl(var(--pink-400) / 0.5), 0 0 40px hsl(var(--coral-400) / 0.3), 0 0 60px hsl(var(--orange-400) / 0.2)'
          }}
        />
        {/* Animated pulse effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-pink-400 via-coral-400 to-orange-400 rounded-full opacity-30 animate-pulse"
        />
      </div>

      {/* Timeline Stops */}
      <div className="space-y-12 md:space-y-16">
        {stops.map((stop, index) => (
          <div 
            key={index}
            className={`
              relative animate-fade-in
              ${index % 2 === 0 
                ? 'md:pr-[calc(50%+4rem)]' 
                : 'md:pl-[calc(50%+4rem)]'
              }
            `}
            style={{
              animationDelay: `${index * 0.15}s`
            }}
          >
            {/* Center Icon on Timeline */}
            <div className="absolute left-1/2 top-0 md:top-6 -translate-x-1/2 z-20">
              <div 
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-pink-400 via-coral-400 to-orange-400 rounded-full border-4 border-burgundy-900 group-hover:scale-110 transition-transform duration-300"
                style={{
                  boxShadow: '0 0 20px hsl(var(--pink-400) / 0.8), 0 0 40px hsl(var(--coral-400) / 0.5), 0 0 60px hsl(var(--orange-400) / 0.3)'
                }}
              >
                <div className="scale-125">
                  {stop.icon}
                </div>
              </div>
            </div>

            {/* Connector Line from Icon to Card */}
            <div className={`
              hidden md:block absolute top-14 w-12 h-0.5 z-10
              bg-gradient-to-${index % 2 === 0 ? 'l' : 'r'} 
              from-pink-400/60 to-transparent
              ${index % 2 === 0 ? 'right-1/2 mr-8' : 'left-1/2 ml-8'}
            `} />

            {/* Card with Enhanced Hover Effects */}
            <div className={`
              relative mx-auto max-w-md md:max-w-lg z-10
              mt-16 md:mt-0
              bg-gradient-to-br from-burgundy-800/80 via-burgundy-700/70 to-pink-900/60
              backdrop-blur-2xl rounded-3xl p-5 md:p-6
              border border-pink-400/20
              hover:border-orange-400/40
              group hover:-translate-y-2
              transition-all duration-500 ease-out
              hover:shadow-2xl hover:shadow-pink-400/40
              before:absolute before:inset-0 before:rounded-3xl 
              before:bg-gradient-to-br before:from-pink-500/0 before:via-coral-400/0 before:to-orange-400/0 
              before:opacity-0 hover:before:opacity-15 before:transition-opacity before:duration-500
              after:absolute after:inset-0 after:rounded-3xl after:shadow-inner after:shadow-white/5
            `}>
              {/* Title */}
              <h3 className={`
                text-white text-2xl md:text-3xl font-bold mb-3 leading-tight
                ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}
                text-center
              `}>
                {stop.title}
              </h3>

              {/* Subtitle */}
              <div className={`
                ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}
                text-center
              `}>
                <p className="text-white/85 text-base md:text-lg leading-relaxed font-light">
                  {stop.subtitle.split('(')[0].trim()}
                </p>
                {stop.subtitle.includes('(') && (
                  <p className="text-pink-100/70 text-sm md:text-base font-light italic group-hover:text-pink-50/80 transition-colors duration-300 mt-2">
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
