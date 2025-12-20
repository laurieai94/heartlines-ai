import React from "react";

interface BrandColorSwatchProps {
  name: string;
  hex: string;
  hsl: string;
  cssVar?: string;
  className?: string;
}

const BrandColorSwatch: React.FC<BrandColorSwatchProps> = ({ 
  name, 
  hex, 
  hsl, 
  cssVar,
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-4 print:gap-3 ${className}`}>
      <div 
        className="w-16 h-16 rounded-lg shadow-md print:w-12 print:h-12 print:shadow-none print:border print:border-gray-300"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1">
        <p className="font-semibold text-white print:text-gray-900">{name}</p>
        <p className="text-sm text-white/70 font-mono print:text-gray-600">{hex}</p>
        <p className="text-xs text-white/60 font-mono print:text-gray-500">{hsl}</p>
        {cssVar && (
          <p className="text-xs text-white/60 font-mono print:text-gray-500">var({cssVar})</p>
        )}
      </div>
    </div>
  );
};

export default BrandColorSwatch;
