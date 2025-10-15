import React from 'react';

interface GlobeProps {
  size?: 'sm' | 'md' | 'lg';
  glowIntensity?: 'low' | 'medium' | 'high';
  rotationSpeed?: number;
}

const Globe: React.FC<GlobeProps> = ({ 
  size = 'md', 
  glowIntensity = 'medium',
  rotationSpeed = 40 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const glowClasses = {
    low: 'opacity-40',
    medium: 'opacity-60',
    high: 'opacity-80'
  };

  return (
    <div 
      className="relative group"
      role="img"
      aria-label="Spinning globe representing our global moment"
    >
      {/* Outer glow */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/40 to-coral-500/40 blur-xl ${glowClasses[glowIntensity]} group-hover:opacity-80 transition-opacity duration-500`} />
      
      {/* Globe sphere */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
        {/* Animated earth texture */}
        <div 
          className="w-full h-full animate-globe-rotate"
          style={{
            background: `repeating-linear-gradient(90deg, 
              #1a4d8f 0%, #2563eb 4%, #0ea5e9 8%, 
              #14532d 9%, #15803d 12%, #92400e 13%,
              #0ea5e9 14%, #1a4d8f 18%, #2563eb 22%,
              #0ea5e9 26%, #14532d 27%, #15803d 30%,
              #0ea5e9 31%, #1a4d8f 35%, #2563eb 39%,
              #a16207 40%, #92400e 42%, #0ea5e9 43%,
              #1a4d8f 47%, #2563eb 51%, #0ea5e9 55%,
              #14532d 56%, #15803d 59%, #0ea5e9 60%,
              #1a4d8f 64%, #2563eb 68%, #0ea5e9 72%,
              #92400e 73%, #a16207 75%, #0ea5e9 76%,
              #1a4d8f 80%, #2563eb 84%, #0ea5e9 88%,
              #14532d 89%, #15803d 92%, #0ea5e9 93%,
              #1a4d8f 97%, #2563eb 100%
            )`,
            backgroundSize: '400% 100%',
            animationDuration: `${rotationSpeed}s`,
            willChange: 'background-position',
            transform: 'translateZ(0)'
          }}
        />
        
        {/* 3D shadow overlay for depth */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.4), inset 10px 0 20px rgba(255,255,255,0.1)'
          }}
        />
      </div>
    </div>
  );
};

export default Globe;
