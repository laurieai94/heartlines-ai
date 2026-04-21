import React from "react";
import { BRAND } from "@/branding";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  kind?: "wordmark" | "icon";
  size?: number;
  width?: number;
  height?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "", 
  variant = "bare",
  ariaLabel,
  kind = "wordmark",
  size,
  width,
  height
}) => {
  const variantStyles = {
    rounded: "rounded-lg",
    circle: "rounded-full",
    bare: ""
  };

  const src = kind === "wordmark" ? BRAND.wordmarkSrc : BRAND.iconSrc;
  const imgWidth = width || size || (kind === "wordmark" ? 120 : 32);
  const imgHeight = height || size || (kind === "wordmark" ? 40 : 32);

  return (
    <img
      src={src}
      alt={ariaLabel || BRAND.alt}
      className={`${variantStyles[variant]} ${className}`}
      width={imgWidth}
      height={imgHeight}
    />
  );
};

export default BrandLogo;
