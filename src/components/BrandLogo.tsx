import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  imgSrc?: string;
  imgAlt?: string;
}

// BrandLogo component - returns null to remove all logo instances
const BrandLogo: React.FC<BrandLogoProps> = () => {
  return null;
};

export default BrandLogo;
