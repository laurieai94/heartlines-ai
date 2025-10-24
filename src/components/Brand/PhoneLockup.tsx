import React from "react";
import { BRAND } from "@/branding";

interface PhoneLockupProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  onClick?: () => void;
}

const PhoneLockup: React.FC<PhoneLockupProps> = ({ 
  className = "", 
  size = "md",
  showTagline = true,
  onClick 
}) => {
  const sizeClasses = {
    sm: "w-32 md:w-[147px]",
    md: "w-48 md:w-[221px]",
    lg: "w-[305px] md:w-[349px]",
    xl: "w-96 md:w-[460px]"
  };

  return (
    <div 
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <img
        src={BRAND.phoneLockupSrc}
        alt={`${BRAND.name} ${showTagline ? 'with phone illustration and tagline' : 'logo'}`}
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default PhoneLockup;
