import React, { useMemo } from "react";

interface MiniFlamesOverlayProps {
  className?: string;
  density?: "light" | "normal" | "dense";
  size?: "sm" | "md" | "lg";
}

const MiniFlamesOverlay: React.FC<MiniFlamesOverlayProps> = ({ 
  className = "", 
  density = "light",
  size = "md"
}) => {
  const getFlameCount = () => {
    switch (density) {
      case "dense": return 25;
      case "normal": return 15;
      case "light": return 8;
      default: return 8;
    }
  };

  const getSizeRange = () => {
    switch (size) {
      case "lg": return { min: 12, max: 28 }; // 12-28px
      case "md": return { min: 8, max: 18 }; // 8-18px  
      case "sm": return { min: 6, max: 12 }; // 6-12px
      default: return { min: 8, max: 18 };
    }
  };

  const getStrokeWidth = () => {
    switch (size) {
      case "lg": return "1.2";
      case "md": return "0.8";
      case "sm": return "0.6";
      default: return "0.8";
    }
  };

  const flames = useMemo(() => {
    const flameCount = getFlameCount();
    const sizeRange = getSizeRange();
    return Array.from({ length: flameCount }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, // 5-95% to avoid edges
      top: Math.random() * 90 + 5, // 5-95% to avoid edges
      size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5 opacity
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 4, // 4-6s
    }));
  }, [density, size]);

  const getFlameShape = (size: number) => {
    const scale = size / 20;
    return `M${10 * scale},${18 * scale} C${6 * scale},${16 * scale} ${4 * scale},${12 * scale} ${4 * scale},${8 * scale} C${4 * scale},${4 * scale} ${7 * scale},${2 * scale} ${10 * scale},${2 * scale} C${13 * scale},${2 * scale} ${16 * scale},${4 * scale} ${16 * scale},${8 * scale} C${16 * scale},${12 * scale} ${14 * scale},${16 * scale} ${10 * scale},${18 * scale}Z`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-[5] ${className}`}>
      <svg 
        className="absolute inset-0 w-full h-full mix-blend-soft-light"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {flames.map((flame) => (
          <g key={flame.id}>
            <path
              d={getFlameShape(flame.size)}
              fill="none"
              stroke="hsl(var(--coral-400))"
              strokeWidth={getStrokeWidth()}
              opacity={flame.opacity}
              transform={`translate(${flame.left * 10}, ${flame.top * 10}) rotate(${flame.rotation}) translate(-10, -10)`}
              style={{
                transformOrigin: "10px 10px",
                animation: `pulse ${flame.animationDuration}s ease-in-out infinite`,
                animationDelay: `${flame.animationDelay}s`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MiniFlamesOverlay;