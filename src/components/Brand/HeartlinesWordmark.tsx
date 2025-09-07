import React from "react";

interface HeartlinesWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

const HeartlinesWordmark: React.FC<HeartlinesWordmarkProps> = ({ 
  className = "", 
  size = "lg",
  onClick
}) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl", 
    lg: "text-4xl",
    xl: "text-6xl"
  };

  return (
    <h1 
      className={`font-brand font-normal tracking-wide ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      heartlines
    </h1>
  );
};

export default HeartlinesWordmark;