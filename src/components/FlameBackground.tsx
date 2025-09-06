import React from 'react';

interface FlameBackgroundProps {
  className?: string;
}

const FlameBackground: React.FC<FlameBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Soft glow background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white rounded-full opacity-[0.06] blur-[80px]" />
      </div>
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.09]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Flame pattern - scattered white flame shapes */}
        <g fill="white">
          {/* Small flames */}
          <path
            d="M100 200c-5-20 5-35 15-30 8 4 12 15 10 25-2 8-10 12-18 8-6-3-8-8-7-3z"
            className="animate-pulse"
            style={{ animationDelay: '0s', animationDuration: '4s' }}
          />
          <path
            d="M300 150c-4-18 6-32 14-28 7 3 10 13 8 22-1 7-8 10-15 7-5-2-7-7-7-3z"
            className="animate-pulse"
            style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
          />
          <path
            d="M500 300c-6-22 4-38 16-33 9 4 13 16 11 27-2 9-11 13-19 9-7-3-9-9-8-3z"
            className="animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '4.5s' }}
          />
          <path
            d="M700 120c-3-16 7-28 12-25 6 2 9 12 7 20-1 6-7 9-13 6-4-2-6-6-6-1z"
            className="animate-pulse"
            style={{ animationDelay: '1.5s', animationDuration: '3s' }}
          />
          <path
            d="M900 250c-5-19 5-34 15-29 8 3 11 14 9 24-2 8-9 11-17 8-6-2-8-7-7-3z"
            className="animate-pulse"
            style={{ animationDelay: '2s', animationDuration: '4.2s' }}
          />
          
          {/* Medium flames */}
          <path
            d="M200 400c-7-25 6-42 18-36 10 5 15 18 12 30-3 10-13 15-22 10-8-4-10-10-8-4z"
            className="animate-pulse"
            style={{ animationDelay: '0.2s', animationDuration: '5s' }}
          />
          <path
            d="M600 500c-8-28 7-45 20-38 11 6 16 20 13 33-3 11-14 16-24 11-9-4-11-11-9-6z"
            className="animate-pulse"
            style={{ animationDelay: '2.5s', animationDuration: '4.8s' }}
          />
          <path
            d="M1000 350c-6-23 8-39 17-34 9 4 14 17 11 28-3 9-12 14-20 9-7-3-9-9-8-3z"
            className="animate-pulse"
            style={{ animationDelay: '3s', animationDuration: '3.8s' }}
          />
          
          {/* Large flames */}
          <path
            d="M150 600c-10-32 8-52 23-44 13 7 19 23 16 38-4 13-16 19-28 13-11-5-13-14-11-7z"
            className="animate-pulse"
            style={{ animationDelay: '1.2s', animationDuration: '6s' }}
          />
          <path
            d="M800 600c-9-30 9-48 21-42 12 6 18 22 15 36-3 12-15 18-26 12-10-4-12-13-10-6z"
            className="animate-pulse"
            style={{ animationDelay: '3.5s', animationDuration: '5.5s' }}
          />
          
          {/* Tiny accent flames */}
          <path
            d="M250 100c-2-12 4-20 8-18 4 2 6 8 5 14-1 4-5 6-9 4-3-1-4-4-4-0z"
            className="animate-pulse"
            style={{ animationDelay: '4s', animationDuration: '2.5s' }}
          />
          <path
            d="M450 80c-2-10 3-18 7-16 3 1 5 7 4 12-1 3-4 5-7 3-2-1-3-3-4-1z"
            className="animate-pulse"
            style={{ animationDelay: '4.5s', animationDuration: '3.2s' }}
          />
          <path
            d="M650 50c-3-14 5-24 9-21 5 2 7 10 6 16-1 5-6 8-10 5-4-2-5-5-5-0z"
            className="animate-pulse"
            style={{ animationDelay: '5s', animationDuration: '2.8s' }}
          />
        </g>
      </svg>
    </div>
  );
};

export default FlameBackground;