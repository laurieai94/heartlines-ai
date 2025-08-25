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
      textSize: "text-lg"
    },
    md: {
      textSize: "text-xl"
    },
    lg: {
      textSize: "text-2xl"
    }
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span className={`${config.textSize} font-brand text-white font-normal tracking-wide`}>
        {BRAND.name}
      </span>
    </div>
  );
};

export default BrandMark;