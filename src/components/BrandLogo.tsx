import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
}

// RealTalk Brand Logo (Glassmorphism Heart)
// Variants:
// - rounded: glass card with rounded corners (default)
// - circle: glass circle badge
// - bare: only the heart SVG (use when you already have a background)
const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-20 h-20", variant = "rounded", ariaLabel = "RealTalk" }) => {
  if (variant === "bare") {
    return (
      <div className={`relative flex items-center justify-center ${className}`} aria-label={ariaLabel} role="img">
        <svg className="relative z-10 w-3/4 h-3/4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    );
  }

  const roundedClass = variant === "circle" ? "rounded-full" : "rounded-[1.5rem]";

  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-label={ariaLabel} role="img">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-400 backdrop-filter backdrop-blur-xl bg-opacity-30 ${roundedClass} border-2 border-white border-opacity-60`}
      />
      <svg className="relative z-10 w-3/4 h-3/4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
  );
};

export default BrandLogo;
