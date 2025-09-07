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
  return <h1 className={`font-brand font-normal tracking-wide text-burgundy-600 ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>heartlines helps you connect.</h1>;
};
export default HeartlinesWordmark;