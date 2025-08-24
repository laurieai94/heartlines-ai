import React from "react";
import { BRAND } from "@/branding";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const BrandMark: React.FC<BrandMarkProps> = ({ 
  className = "", 
  size = "md",
  onClick 
}) => {
  const sizeConfig = {
    sm: {
      iconSize: "w-6 h-6",
      textSize: "text-lg",
      gap: "gap-2"
    },
    md: {
      iconSize: "w-8 h-8", 
      textSize: "text-xl",
      gap: "gap-3"
    },
    lg: {
      iconSize: "w-10 h-10",
      textSize: "text-2xl", 
      gap: "gap-3"
    }
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`flex items-center ${config.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <img
        src={BRAND.iconSrc}
        alt={BRAND.alt}
        className={`${config.iconSize} object-contain`}
        width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
        onError={(e) => {
          const fallback = '/lovable-uploads/heart-logo.png';
          if (e.currentTarget.src.endsWith(fallback)) return;
          e.currentTarget.src = fallback;
        }}
      />
      <span className={`${config.textSize} font-brand text-white font-bold tracking-wide`}>
        {BRAND.name}
      </span>
    </div>
  );
};

export default BrandMark;