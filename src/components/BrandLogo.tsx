import React from "react";
import { BRAND } from "@/branding";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "", 
  variant = "bare",
  ariaLabel,
  size = 32
}) => {
  const variantStyles = {
    rounded: "rounded-lg",
    circle: "rounded-full",
    bare: ""
  };

  return (
    <img
      src={BRAND.logoSrc}
      alt={ariaLabel || BRAND.alt}
      className={`${variantStyles[variant]} ${className}`}
      width={size}
      height={size}
    />
  );
};

export default BrandLogo;
