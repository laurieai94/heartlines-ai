import React, { useState, useEffect } from "react";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import image2016 from "@/assets/hero-carousel/elderly-native-american-women.webp";
import image2018 from "@/assets/hero-carousel/joyful-heritage-living-room.webp";
import image2020 from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import image2022 from "@/assets/hero-carousel/warm-gathering-diverse-souls.webp";
import image2024 from "@/assets/hero-carousel/manos-unidas.webp";
import image2025 from "@/assets/hero-carousel/warm-embrace-pride.webp";
import image2027 from "@/assets/hero-carousel/couple-on-couch.webp";

interface Slide {
  year: string;
  image: string;
  tagline: string;
}

const slides: Slide[] = [
  {
    year: "2057",
    image: image2016,
    tagline: "Love, but make it last."
  },
  {
    year: "2063",
    image: image2018,
    tagline: "Love, but make it last."
  },
  {
    year: "2067",
    image: image2020,
    tagline: "Love, but make it last."
  },
  {
    year: "2073",
    image: image2022,
    tagline: "Love, but make it last."
  },
  {
    year: "2079",
    image: image2024,
    tagline: "Love, but make it last."
  },
  {
    year: "2085",
    image: image2025,
    tagline: "Love, but make it last."
  },
  {
    year: "2091",
    image: image2027,
    tagline: "Love, but make it last."
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden pointer-events-none -mt-20">
      {slides.map((slide, index) => (
        <div
          key={slide.year}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={`Year ${slide.year}`}
            className="absolute inset-0 w-full h-full object-contain"
            loading={index < 2 ? "eager" : "lazy"}
          />

          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Heartlines Wordmark - Top Right */}
          <div className="absolute top-4 right-8 md:right-16 z-10">
            <HeartlinesWordmark size="lg" className="text-white italic" />
          </div>

          {/* Year Number with Gradient - Bottom Left */}
          <div className="absolute bottom-6 md:bottom-12 left-8 md:left-16 z-10">
            <h2
              className="text-7xl md:text-8xl font-brand leading-none mb-2"
              style={{
                background: "linear-gradient(90deg, #E94B8C 0%, #F97066 50%, #FFB347 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {slide.year}
            </h2>
            
            {/* Tagline */}
            <p className="text-white text-xl md:text-2xl font-serif tracking-wide drop-shadow-lg">
              {slide.tagline}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
