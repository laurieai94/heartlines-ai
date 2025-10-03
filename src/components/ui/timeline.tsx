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
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* Timeline Stops */}
      <div className="space-y-8 md:space-y-10">
        {stops.map((stop, index) => (
          <div 
            key={index}
            className="relative"
          >
            {/* Timeline Stop Card with Glass Morphism */}
            <div className="flex items-start gap-6 group">
              {/* Icon container with enhanced glow */}
              <div className="relative flex-shrink-0">
                <div 
                  className="w-20 h-20 rounded-3xl bg-burgundy-900/60 backdrop-blur-md
                             flex items-center justify-center
                             border-2 border-transparent bg-clip-padding
                             relative overflow-hidden
                             transition-all duration-500 
                             group-hover:scale-110 
                             group-hover:shadow-[0_0_40px_rgba(255,132,80,0.6),0_0_60px_rgba(255,107,157,0.4)]
                             before:absolute before:inset-0 before:rounded-3xl before:p-[2px] 
                             before:bg-gradient-to-br before:from-pink-400 before:via-coral-400 before:to-orange-400
                             before:-z-10 before:transition-opacity before:duration-500
                             after:absolute after:inset-[2px] after:rounded-3xl after:bg-burgundy-900/60 after:backdrop-blur-md after:-z-10"
                >
                  <div className="w-10 h-10 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    {stop.icon}
                  </div>
                </div>
              </div>

              {/* Content card with glass morphism and animated gradient border */}
              <div 
                className="flex-1 p-8 rounded-3xl bg-burgundy-900/40 backdrop-blur-xl
                           border-2 border-transparent bg-clip-padding
                           relative overflow-hidden
                           transition-all duration-500 
                           group-hover:scale-[1.02] group-hover:-translate-y-2
                           group-hover:shadow-[0_25px_80px_-20px_rgba(255,132,80,0.5),0_25px_80px_-20px_rgba(255,107,157,0.4)]
                           before:absolute before:inset-0 before:rounded-3xl before:p-[2px] 
                           before:bg-gradient-to-br before:from-pink-400 before:via-coral-400 before:to-orange-400
                           before:-z-10 before:opacity-60 before:transition-opacity before:duration-500
                           before:group-hover:opacity-100
                           after:absolute after:inset-[2px] after:rounded-3xl after:bg-burgundy-900/40 after:backdrop-blur-xl after:-z-10"
              >
                {/* Animated gradient overlay on hover */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-coral-400/10 to-orange-400/10 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                             animate-gradient"
                />
                
                {/* Inner glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(255, 132, 80, 0.15), transparent 70%)'
                  }}
                />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-3 text-white transition-all duration-300 
                                 group-hover:drop-shadow-[0_0_12px_rgba(255,132,80,0.6)]">
                    {stop.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-colors duration-300 
                                group-hover:text-white">
                    {stop.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
