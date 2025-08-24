import React from "react";
import { BRAND } from "@/branding";

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
  ariaLabel = BRAND.name,
  imgSrc = BRAND.logoSrc,
  imgAlt = BRAND.alt 
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
            onError={() => {
              console.error('BrandLogo image failed to load:', imgSrc);
            }}
          />
        ) : null}
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
          onError={() => {
            console.error('BrandLogo image failed to load:', imgSrc);
          }}
        />
      ) : null}
    </div>
  );
};

export default BrandLogo;
