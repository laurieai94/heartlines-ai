import React from 'react';

const FlameBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated flame shapes */}
        {[...Array(12)].map((_, i) => (
          <g key={i} className="animate-pulse">
            <path
              d={`M${150 + i * 100},${200 + Math.random() * 400} 
                  C${160 + i * 100},${180 + Math.random() * 400} 
                  ${180 + i * 100},${160 + Math.random() * 400} 
                  ${170 + i * 100},${140 + Math.random() * 400}
                  C${160 + i * 100},${120 + Math.random() * 400} 
                  ${140 + i * 100},${130 + Math.random() * 400} 
                  ${150 + i * 100},${150 + Math.random() * 400}
                  C${140 + i * 100},${170 + Math.random() * 400} 
                  ${145 + i * 100},${190 + Math.random() * 400} 
                  ${150 + i * 100},${200 + Math.random() * 400} Z`}
              fill="white"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          </g>
        ))}
        
        {/* Additional scattered flame dots */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={Math.random() * 1200}
            cy={Math.random() * 800}
            r={1 + Math.random() * 2}
            fill="white"
            className="animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default FlameBackground;