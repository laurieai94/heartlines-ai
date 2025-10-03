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
              className="relative"
            >
              {/* Connection line with gradient */}
              {index < stops.length - 1 && (
                <div 
                  className="absolute left-8 top-24 w-0.5 h-32 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 112, 147, 0.3)'
                  }}
                />
              )}

              {/* Timeline Stop Card */}
              <div className="flex items-start gap-6 group">
                {/* Icon container with glow effect */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 
                               flex items-center justify-center backdrop-blur-sm border border-primary/30
                               transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50
                               group-hover:shadow-[0_0_30px_rgba(255,112,147,0.4)]"
                  >
                    <div className="w-8 h-8 text-primary transition-transform duration-500 group-hover:scale-110">
                      {stop.icon}
                    </div>
                  </div>
                </div>

                {/* Content card with enhanced hover effects */}
                <div 
                  className="flex-1 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50
                             transition-all duration-500 
                             group-hover:bg-card/80 group-hover:border-primary/30
                             group-hover:shadow-[0_20px_60px_-15px_rgba(255,112,147,0.3)]
                             group-hover:scale-[1.02] group-hover:-translate-y-1
                             relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-2 text-foreground transition-colors duration-300 group-hover:text-primary">
                      {stop.title}
                    </h3>
                    <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
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
