import React, { useState, useEffect } from "react";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import { BRAND } from "@/branding";
import heartlinesLogo from "@/assets/heartlines-logo-white.svg";
import image2016 from "@/assets/hero-carousel/elderly-native-american-women.webp";
import image2018 from "@/assets/hero-carousel/joyful-heritage-living-room.webp";
import image2020 from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import image2022 from "@/assets/hero-carousel/warm-gathering-diverse-souls.webp";
import image2024 from "@/assets/hero-carousel/manos-unidas.webp";
import image2025 from "@/assets/hero-carousel/warm-embrace-pride.webp";
import image2027 from "@/assets/hero-carousel/couple-on-couch.webp";
import imageAsianCouple from "@/assets/hero-carousel/asian-couple-serene-moment.webp";
import imageFramedMemory from "@/assets/hero-carousel/man-with-treasured-memory.webp";
import imageFriendsCats from "@/assets/hero-carousel/friends-cats-city-view.webp";
import imageRetroPeace from "@/assets/hero-carousel/retro-peace-living-room.webp";
import imageVintageHome from "@/assets/hero-carousel/warm-smiles-vintage-home.webp";

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
    year: "2071",
    image: imageAsianCouple,
    tagline: "Love, but make it last."
  },
  {
    year: "2073",
    image: image2022,
    tagline: "Love, but make it last."
  },
  {
    year: "2077",
    image: imageFramedMemory,
    tagline: "Love, but make it last."
  },
  {
    year: "2079",
    image: image2024,
    tagline: "Love, but make it last."
  },
  {
    year: "2083",
    image: imageFriendsCats,
    tagline: "Love, but make it last."
  },
  {
    year: "2085",
    image: image2025,
    tagline: "Love, but make it last."
  },
  {
    year: "2088",
    image: imageRetroPeace,
    tagline: "Love, but make it last."
  },
  {
    year: "2091",
    image: image2027,
    tagline: "Love, but make it last."
  },
  {
    year: "2094",
    image: imageVintageHome,
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
    <div className="relative h-screen w-full overflow-hidden -mt-20">
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
            className="absolute inset-0 w-full h-full object-cover"
            loading={index < 2 ? "eager" : "lazy"}
          />

          {/* Year Number - Bottom Left */}
          <div className="absolute bottom-20 md:bottom-32 left-8 md:left-16 right-8 md:right-16 z-10">
            <h2 className="text-7xl md:text-8xl font-brand leading-none mb-2 bg-gradient-to-r from-coral-400 to-pink-500 bg-clip-text text-transparent">
              {slide.year}
            </h2>
            
            {/* Tagline */}
            <p className="text-white text-xl md:text-2xl font-sans tracking-wide drop-shadow-lg">
              {slide.tagline}
            </p>
          </div>

          {/* Heartlines Logo - Bottom Right */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10">
            <img 
              src={heartlinesLogo} 
              alt="heartlines" 
              className="h-8 md:h-10 drop-shadow-2xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
