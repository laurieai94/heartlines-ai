import React from 'react';

interface FlameBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'duotone-outline' | 'ethereal';
  density?: 'sparse' | 'normal' | 'dense';
}

const FlameBackground: React.FC<FlameBackgroundProps> = ({ 
  className = '', 
  variant = 'subtle',
  density = 'normal'
}) => {
  const getDensityCount = () => {
    switch (density) {
      case 'sparse': return { small: 3, medium: 2, large: 1, tiny: 2 };
      case 'dense': return { small: 8, medium: 5, large: 4, tiny: 6 };
      default: return { small: 5, medium: 3, large: 2, tiny: 4 };
    }
  };

  const counts = getDensityCount();

  const generateFlameShapes = () => {
    const shapes = [];
    
    // Generate flame shapes based on density
    for (let i = 0; i < counts.small; i++) {
      shapes.push({
        id: `small-${i}`,
        size: 'small',
        x: Math.random() * 1000 + 100,
        y: Math.random() * 600 + 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 2
      });
    }
    
    for (let i = 0; i < counts.medium; i++) {
      shapes.push({
        id: `medium-${i}`,
        size: 'medium',
        x: Math.random() * 800 + 200,
        y: Math.random() * 500 + 150,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 2
      });
    }
    
    for (let i = 0; i < counts.large; i++) {
      shapes.push({
        id: `large-${i}`,
        size: 'large',
        x: Math.random() * 600 + 300,
        y: Math.random() * 400 + 200,
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 2
      });
    }
    
    for (let i = 0; i < counts.tiny; i++) {
      shapes.push({
        id: `tiny-${i}`,
        size: 'tiny',
        x: Math.random() * 1100 + 50,
        y: Math.random() * 700 + 50,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 2
      });
    }
    
    return shapes;
  };

  const flameShapes = generateFlameShapes();

  const getFlameOpacity = () => {
    switch (variant) {
      case 'duotone-outline': return 'opacity-[0.15]';
      case 'ethereal': return 'opacity-[0.12]';
      default: return 'opacity-[0.09]';
    }
  };

  const getFlameStroke = () => {
    switch (variant) {
      case 'duotone-outline': return { stroke: 'white', strokeWidth: 0.5, fill: 'none' };
      case 'ethereal': return { fill: 'white' };
      default: return { fill: 'white' };
    }
  };

  const getGlowIntensity = () => {
    switch (variant) {
      case 'duotone-outline': return 'flame-glow-strong';
      case 'ethereal': return 'flame-glow';
      default: return '';
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Ambient background orbs */}
      {variant !== 'subtle' && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-[0.04] blur-[120px] animate-flame-drift" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white rounded-full opacity-[0.04] blur-[100px] animate-flame-drift" style={{ animationDelay: '2s' }} />
          <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-white rounded-full opacity-[0.03] blur-[80px] animate-flame-drift" style={{ animationDelay: '4s' }} />
        </div>
      )}
      
      {/* Soft glow background for subtle variant */}
      {variant === 'subtle' && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-[0.06] blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white rounded-full opacity-[0.06] blur-[80px]" />
        </div>
      )}

      <svg
        className={`absolute inset-0 w-full h-full ${getFlameOpacity()} ${getGlowIntensity()}`}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {variant === 'duotone-outline' && (
            <filter id="flame-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        
        <g {...getFlameStroke()} filter={variant === 'duotone-outline' ? 'url(#flame-glow)' : undefined}>
          {flameShapes.map((shape) => {
            const baseFlame = getBaseFlameShape(shape.size);
            return (
              <path
                key={shape.id}
                d={baseFlame}
                transform={`translate(${shape.x}, ${shape.y})`}
                className={`animate-flame-flicker ${variant === 'ethereal' ? 'animate-flame-drift' : ''}`}
                style={{ 
                  animationDelay: `${shape.delay}s`, 
                  animationDuration: `${shape.duration}s`,
                  transformOrigin: 'center'
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Sheen effect for duotone variant */}
      {variant === 'duotone-outline' && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-flame-sheen"
            style={{ animationDelay: '2s' }}
          />
        </div>
      )}
    </div>
  );

  function getBaseFlameShape(size: string): string {
    const shapes = {
      tiny: "M0 12c-2-8 3-14 6-12 3 1 4 6 3 10-1 3-4 5-7 3-2-1-2-2-2 1z",
      small: "M0 20c-5-15 5-25 12-22 6 3 8 12 7 18-1 6-7 9-13 6-4-2-6-6-6 0z",
      medium: "M0 30c-7-20 6-35 16-30 8 4 12 16 10 25-2 8-10 13-18 8-6-3-8-8-8 2z",
      large: "M0 40c-10-25 8-42 20-36 10 5 15 20 12 32-3 10-13 16-22 10-8-4-10-10-10 4z"
    };
    return shapes[size as keyof typeof shapes] || shapes.small;
  }
};

export default FlameBackground;