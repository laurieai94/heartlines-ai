import React, { useState, useEffect, useRef } from "react";
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import image2016 from "@/assets/hero-carousel/elderly-native-american-women.webp";
import image2018 from "@/assets/hero-carousel/joyful-heritage-living-room.webp";
import image2020 from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import image2022 from "@/assets/hero-carousel/warm-gathering-diverse-souls.webp";

import image2025 from "@/assets/hero-carousel/warm-embrace-pride.webp";
import image2027 from "@/assets/hero-carousel/couple-on-couch.webp";
import imageAsianCouple from "@/assets/hero-carousel/asian-couple-serene-moment.webp";
import imageFramedMemory from "@/assets/hero-carousel/man-with-treasured-memory.webp";
import imageFriendsCats from "@/assets/hero-carousel/friends-cats-city-view.webp";
import imageRetroPeace from "@/assets/hero-carousel/retro-peace-living-room.webp";


interface Slide {
  year: string;
  image: string;
  tagline: string;
  imageStyle?: React.CSSProperties;
}

const slides: Slide[] = [
  { year: "2057", image: image2016, tagline: "what it's all for" },
  { year: "2063", image: image2018, tagline: "what it's all for" },
  { year: "2067", image: image2020, tagline: "what it's all for" },
  { year: "2071", image: imageAsianCouple, tagline: "what it's all for", imageStyle: { transform: 'scale(0.85)' } },
  { year: "2073", image: image2022, tagline: "what it's all for" },
  { year: "2077", image: imageFramedMemory, tagline: "what it's all for" },
  { year: "2083", image: imageFriendsCats, tagline: "what it's all for" },
  { year: "2085", image: image2025, tagline: "what it's all for" },
  { year: "2088", image: imageRetroPeace, tagline: "what it's all for" },
  { year: "2091", image: image2027, tagline: "what it's all for" },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all carousel images on mount
  useEffect(() => {
    const allImages = slides.map(slide => slide.image);
    preloadCriticalImages(allImages);
  }, []);

  useEffect(() => {
    // Check if splash screen has already completed
    const splashComplete = sessionStorage.getItem('homepage_visited') === 'true' ||
                           sessionStorage.getItem('resources_loaded') === 'true';
    
    // Delay timer start if splash is still showing
    const startDelay = splashComplete ? 0 : 3500;
    
    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden -mt-20">
      {/* SVG filter for film grain noise */}
      <svg className="hidden">
        <filter id="film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {slides.map((slide, index) => (
        <div
          key={slide.year}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
          }`}
        >
          {/* Background Image with vintage color grading */}
          <img
            src={slide.image}
            alt={`Year ${slide.year}`}
            className="absolute inset-0 w-full h-full object-cover object-[center_70%] md:object-cover md:object-center bg-burgundy-800"
            style={{ filter: 'sepia(0.3) saturate(0.75) contrast(1.05) brightness(0.95)', ...slide.imageStyle }}
            loading={index < 8 ? "eager" : "lazy"}
            fetchPriority={index < 4 ? "high" : undefined}
          />

          {/* Film grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: 'url(#film-grain)',
              mixBlendMode: 'soft-light',
              opacity: 0.75,
            }}
          />

          {/* Secondary grain layer for dust/scratches in shadows */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: 'url(#film-grain)',
              mixBlendMode: 'multiply',
              opacity: 0.25,
            }}
          />

          {/* Third grain layer - screen blend to wash out digital sharpness */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: 'url(#film-grain)',
              mixBlendMode: 'screen',
              opacity: 0.15,
            }}
          />

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
            }}
          />

          {/* Year Number - Bottom Left */}
          <div className="absolute bottom-6 md:bottom-10 left-8 md:left-16 right-8 md:right-16 z-10">
            <h2 
                className="text-4xl md:text-6xl font-brand leading-none mb-2"
              style={{
                background: 'linear-gradient(135deg, #ff8a50 0%, #ff7a70 50%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {slide.year}
            </h2>
            
            {/* Tagline */}
            <p className="text-white text-lg md:text-2xl font-sans tracking-wide drop-shadow-lg">
              {slide.tagline}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
