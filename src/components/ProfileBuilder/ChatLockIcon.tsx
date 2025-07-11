
import React from 'react';

const ChatLockIcon = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-300/10 to-emerald-300/5 rounded-full blur-xl animate-pulse"></div>
      
      {/* Main icon container */}
      <div className="relative animate-float">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Chat bubble base */}
          <path
            d="M20 24C20 19.5817 23.5817 16 28 16H60C64.4183 16 68 19.5817 68 24V48C68 52.4183 64.4183 56 60 56H36L24 64V24Z"
            fill="url(#chatGradient)"
            stroke="rgba(134, 239, 172, 0.6)"
            strokeWidth="1.5"
          />
          
          {/* Chat message lines */}
          <line
            x1="32"
            y1="28"
            x2="56"
            y2="28"
            stroke="rgba(134, 239, 172, 0.8)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="36"
            x2="48"
            y2="36"
            stroke="rgba(134, 239, 172, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="44"
            x2="52"
            y2="44"
            stroke="rgba(134, 239, 172, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Lock background circle */}
          <circle
            cx="58"
            cy="30"
            r="14"
            fill="url(#lockBg)"
            stroke="rgba(134, 239, 172, 0.8)"
            strokeWidth="1.5"
          />
          
          {/* Lock body */}
          <rect
            x="52"
            y="32"
            width="12"
            height="8"
            rx="2"
            fill="rgba(134, 239, 172, 1)"
          />
          
          {/* Lock shackle */}
          <path
            d="M55 32V28C55 26.3431 56.3431 25 58 25C59.6569 25 61 26.3431 61 28V32"
            stroke="rgba(134, 239, 172, 1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Lock keyhole dot */}
          <circle
            cx="58"
            cy="35"
            r="1.5"
            fill="rgba(16, 54, 41, 0.8)"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(134, 239, 172, 0.15)" />
              <stop offset="100%" stopColor="rgba(134, 239, 172, 0.08)" />
            </linearGradient>
            <linearGradient id="lockBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(134, 239, 172, 0.25)" />
              <stop offset="100%" stopColor="rgba(134, 239, 172, 0.15)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ChatLockIcon;
