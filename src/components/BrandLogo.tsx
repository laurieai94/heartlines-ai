import React from "react";
import { BRAND } from "@/branding";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  imgSrc?: string;
  imgAlt?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "w-8 h-8", 
  ariaLabel = BRAND.name,
  imgSrc = BRAND.logoSrc,
  imgAlt = BRAND.alt 
}) => {
  if (!imgSrc) return null;

  return (
    <img 
      src={imgSrc} 
      alt={imgAlt || ariaLabel}
      className={`object-contain ${className}`}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default BrandLogo;
