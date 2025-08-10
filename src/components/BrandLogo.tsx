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
        <svg className="relative z-10 w-3/4 h-3/4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  const roundedClass = variant === "circle" ? "rounded-full" : "rounded-[1.5rem]";

  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-label={ariaLabel} role="img">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-400 to-rose-400 backdrop-filter backdrop-blur-xl bg-opacity-30 ${roundedClass} border-2 border-white border-opacity-60`}
      />
      <svg className="relative z-10 w-3/4 h-3/4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

export default BrandLogo;
