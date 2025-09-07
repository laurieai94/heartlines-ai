import React, { useMemo } from "react";

interface MiniFlamesOverlayProps {
  className?: string;
  density?: "light" | "normal" | "dense";
  size?: "sm" | "md" | "lg";
  color?: string;
  blend?: "normal" | "soft-light" | "screen";
}

const MiniFlamesOverlay: React.FC<MiniFlamesOverlayProps> = ({ 
  className = "", 
  density = "light",
  size = "md",
  color = "#fff",
  blend = "normal"
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
      opacity: Math.random() * 0.25 + 0.35, // 0.35-0.6 opacity
      variant: Math.floor(Math.random() * 3), // flame shape variant
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 4, // 4-6s
    }));
  }, [density, size]);

  const getFlamePaths = (size: number, variant: number) => {
    const s = size / 20; // scale
    const lean = (Math.random() - 0.5) * 4 * s;
    const heightJitter = Math.random() * 2 * s;

    return [
      // center tongue
      `M ${10*s} ${18*s} C ${(10+2)*s} ${(14+heightJitter)*s}, ${(11+1)*s} ${(10+heightJitter)*s}, ${(10+lean)*s} ${(7+heightJitter)*s} C ${(9+lean/2)*s} ${(5+heightJitter)*s}, ${(10+lean)*s} ${(3+heightJitter)*s}, ${12*s} ${2*s}`,
      // left tongue
      `M ${6*s} ${18*s} C ${4*s} ${(16+heightJitter)*s}, ${4.2*s} ${(14+heightJitter)*s}, ${5.2*s} ${(12+heightJitter)*s} C ${6.2*s} ${(10+heightJitter)*s}, ${7*s} ${(8+heightJitter)*s}, ${(6.5+lean/4)*s} ${(6+heightJitter)*s}`,
      // right tongue  
      `M ${14*s} ${18*s} C ${16*s} ${(16+heightJitter)*s}, ${15.8*s} ${(14+heightJitter)*s}, ${15*s} ${(12+heightJitter)*s} C ${14*s} ${(10+heightJitter)*s}, ${13*s} ${(8+heightJitter)*s}, ${(13.5+lean/4)*s} ${(6+heightJitter)*s}`
    ];
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-[5] ${className}`}>
      <svg 
        className={`absolute inset-0 w-full h-full ${blend !== "normal" ? `mix-blend-${blend}` : ""}`}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {flames.map((flame) => (
          <g 
            key={flame.id}
            transform={`translate(${flame.left * 10}, ${flame.top * 10}) rotate(${flame.rotation}) translate(-10, -10)`}
            style={{
              transformOrigin: "10px 10px",
              animation: `flame-flicker ${flame.animationDuration}s ease-in-out infinite`,
              animationDelay: `${flame.animationDelay}s`,
            }}
          >
            {getFlamePaths(flame.size, flame.variant).map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={getStrokeWidth()}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={flame.opacity}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MiniFlamesOverlay;