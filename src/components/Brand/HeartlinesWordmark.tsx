import React from "react";
interface HeartlinesWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  showTagline?: boolean;
}
const HeartlinesWordmark: React.FC<HeartlinesWordmarkProps> = ({
  className = "",
  size = "lg",
  onClick,
  showTagline = false
}) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };
  
  const taglineSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm md:text-base",
    xl: "text-base md:text-lg"
  };
  
  return (
    <div 
      className={`flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick} 
      role={onClick ? "button" : undefined} 
      tabIndex={onClick ? 0 : undefined} 
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={`font-brand ${sizeClasses[size]}`}>
        heartlines
      </div>
      {showTagline && (
        <div 
          className={`font-glacial ${taglineSizeClasses[size]} text-white/90 font-semibold tracking-wide mt-1`}
          style={{
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
          }}
        >
          powered by laurie ai
        </div>
      )}
    </div>
  );
};
export default HeartlinesWordmark;