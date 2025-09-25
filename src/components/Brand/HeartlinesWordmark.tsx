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
    <span className={`font-brand ${sizeClasses[size]} ${className}`} onClick={onClick}>
      heartlines
    </span>
  );
};
export default HeartlinesWordmark;