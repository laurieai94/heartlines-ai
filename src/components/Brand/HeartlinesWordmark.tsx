import React from "react";
import { BRAND } from "@/branding";

interface HeartlinesWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  ariaLabel?: string;
}

const HeartlinesWordmark: React.FC<HeartlinesWordmarkProps> = ({
  className = "",
  size = "lg",
  onClick,
  ariaLabel
}) => {
  const sizeClasses: Record<NonNullable<typeof size>, string> = {
    sm: "h-5 md:h-6",
    md: "h-6 md:h-8",
    lg: "h-8 md:h-10",
    xl: "h-10 md:h-12",
  };

  return (
    <img
      src={BRAND.wordmarkSrc}
      alt={ariaLabel || BRAND.alt}
      className={`${sizeClasses[size]} object-contain align-middle ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    />
  );
};

export default HeartlinesWordmark;