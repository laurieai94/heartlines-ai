import React from "react";

interface MiniFlamesOverlayProps {
  className?: string;
  density?: "light" | "normal" | "dense";
}

const MiniFlamesOverlay: React.FC<MiniFlamesOverlayProps> = ({ 
  className = "", 
  density = "light" 
}) => {
  const getFlameCount = () => {
    switch (density) {
      case "dense": return 25;
      case "normal": return 15;
      case "light": return 8;
      default: return 8;
    }
  };

  const generateFlames = () => {
    const flameCount = getFlameCount();
    return Array.from({ length: flameCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 16 + 8, // 8-24px
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2 opacity
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 4, // 4-6s
    }));
  };

  const flames = generateFlames();

  const getFlameShape = (size: number) => {
    const scale = size / 20;
    return `M${10 * scale},${18 * scale} C${6 * scale},${16 * scale} ${4 * scale},${12 * scale} ${4 * scale},${8 * scale} C${4 * scale},${4 * scale} ${7 * scale},${2 * scale} ${10 * scale},${2 * scale} C${13 * scale},${2 * scale} ${16 * scale},${4 * scale} ${16 * scale},${8 * scale} C${16 * scale},${12 * scale} ${14 * scale},${16 * scale} ${10 * scale},${18 * scale}Z`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {flames.map((flame) => (
          <path
            key={flame.id}
            d={getFlameShape(flame.size)}
            fill="none"
            stroke="hsl(var(--coral-400))"
            strokeWidth="0.05"
            opacity={flame.opacity}
            transform={`translate(${flame.left}%, ${flame.top}%) rotate(${flame.rotation}deg)`}
            style={{
              transformOrigin: "center",
              animation: `pulse ${flame.animationDuration}s ease-in-out infinite`,
              animationDelay: `${flame.animationDelay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default MiniFlamesOverlay;