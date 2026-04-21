import React from "react";

interface BrandLoadingTextProps {
  text?: string;
  color?: "light" | "dark";
  className?: string;
}

const BrandLoadingText: React.FC<BrandLoadingTextProps> = ({ 
  text = "profile loading...", 
  color = "light",
  className = ""
}) => {
  const textColorClass = color === "light" ? "text-white/80" : "text-gray-600";
  const spinnerColorClass = color === "light" ? "border-white/30 border-t-white/80" : "border-gray-300 border-t-gray-600";

  return (
    <div className={`text-center ${className}`}>
      <div className={`w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4 ${spinnerColorClass}`}></div>
      <p className={`font-brand text-base ${textColorClass}`}>{text}</p>
    </div>
  );
};

export default BrandLoadingText;