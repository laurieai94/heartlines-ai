import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  imgSrc?: string;
  imgAlt?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = () => {
  // Logo removed from navigation per user request
  return null;
};

export default BrandLogo;
