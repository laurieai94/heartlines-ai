import React, { useMemo, useState } from "react";
import { BRAND } from "@/branding";
import HeartAppIcon from "./HeartAppIcon";

interface BrandLogoProps {
  className?: string;
  variant?: "rounded" | "circle" | "bare";
  ariaLabel?: string;
  imgSrc?: string;
  imgAlt?: string;
}

const getSizeFromClassName = (className: string): number | null => {
  const match = className?.match(/w-(\d+)/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (!isNaN(n)) return n * 4; // Tailwind spacing scale: 1 = 4px
  }
  return null;
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "w-8 h-8",
  ariaLabel = BRAND.name,
  imgSrc = BRAND.logoSrc,
  imgAlt = BRAND.alt,
}) => {
  const [failed, setFailed] = useState(false);
  const size = useMemo(() => getSizeFromClassName(className) ?? 32, [className]);
  const alt = imgAlt || ariaLabel;

  if (!imgSrc || failed) {
    return (
      <span role="img" aria-label={alt}>
        <HeartAppIcon size={size} className={className} />
      </span>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`object-contain ${className}`}
      loading="lazy"
      onError={() => {
        console.warn("[BrandLogo] Failed to load logo:", imgSrc);
        setFailed(true);
      }}
    />
  );
};

export default BrandLogo;
