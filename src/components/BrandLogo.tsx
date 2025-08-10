import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  imgSrc?: string;
  imgAlt?: string;
}

// RealTalk Brand Logo (Glassmorphism Heart)
// Variants:
// - rounded: glass card with rounded corners (default)
// - circle: glass circle badge
// - bare: only the heart SVG (use when you already have a background)
const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "w-20 h-20", 
  variant = "rounded", 
  ariaLabel = "RealTalk",
  imgSrc,
  imgAlt 
}) => {
  // For bare variant
  if (variant === "bare") {
    return (
      <div className={`relative flex items-center justify-center ${className}`} aria-label={ariaLabel} role="img">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={imgAlt || ariaLabel}
            className="w-full h-full object-contain drop-shadow-lg"
            onError={(e) => {
              // Fallback to heart icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <svg 
          className={`relative z-10 w-3/4 h-3/4 text-white ${imgSrc ? 'hidden' : ''}`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  const roundedClass = variant === "circle" ? "rounded-full" : "rounded-[1.5rem]";

  // For rounded and circle variants
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-label={ariaLabel} role="img">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-orange-400 via-coral-400 to-pink-500 backdrop-filter backdrop-blur-xl bg-opacity-30 ${roundedClass} border-2 border-white border-opacity-60`}
      />
      {imgSrc ? (
        <img 
          src={imgSrc} 
          alt={imgAlt || ariaLabel}
          className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-lg"
          onError={(e) => {
            // Fallback to heart icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <svg 
        className={`relative z-10 w-3/4 h-3/4 text-white ${imgSrc ? 'hidden' : ''}`} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

export default BrandLogo;
