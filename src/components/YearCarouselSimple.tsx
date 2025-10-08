import { useState, useEffect, useMemo } from 'react';
import HeartlinesWordmark from './Brand/HeartlinesWordmark';
import { useManagedTimer } from '@/hooks/useManagedTimer';

// Carousel data
interface CarouselSlide {
  year: string;
  image: string;
  alt: string;
}

const slides: CarouselSlide[] = [
  {
    year: "2016",
    image: "/lovable-uploads/warm-gathering-diverse-souls.webp",
    alt: "Warm gathering of diverse souls sharing life and connection",
  },
  {
    year: "2017",
    image: "/lovable-uploads/elderly-couple-pride-living-room.webp",
    alt: "Elderly couple celebrating pride in their living room with rainbow flag",
  },
  {
    year: "2018",
    image: "/lovable-uploads/diverse-trans-friend-group-vibrant-garden.webp",
    alt: "Diverse transgender friend group in vibrant garden setting",
  },
  {
    year: "2019",
    image: "/lovable-uploads/queer-couple-embrace-modern-space.webp",
    alt: "Queer couple in loving embrace in modern space",
  },
  {
    year: "2020",
    image: "/lovable-uploads/diverse-chosen-family-kitchen-laughter.webp",
    alt: "Diverse chosen family sharing laughter in kitchen",
  },
  {
    year: "2021",
    image: "/lovable-uploads/lgbtq-couple-home-office-support.webp",
    alt: "LGBTQ couple supporting each other in home office",
  },
  {
    year: "2022",
    image: "/lovable-uploads/trans-person-cozy-home-reflection.webp",
    alt: "Trans person in moment of peaceful reflection at home",
  },
  {
    year: "2023",
    image: "/lovable-uploads/queer-friends-city-rooftop-sunset.webp",
    alt: "Queer friends on city rooftop at sunset",
  },
  {
    year: "2024",
    image: "/lovable-uploads/diverse-lgbtq-community-gathering.webp",
    alt: "Diverse LGBTQ community gathering celebrating together",
  },
  {
    year: "2025",
    image: "/lovable-uploads/non-binary-person-artistic-space.webp",
    alt: "Non-binary person in creative artistic space",
  },
  {
    year: "2026",
    image: "/lovable-uploads/queer-elders-sharing-wisdom.webp",
    alt: "Queer elders sharing wisdom with younger generation",
  },
  {
    year: "2027",
    image: "/lovable-uploads/lgbtq-family-celebration-home.webp",
    alt: "LGBTQ family celebrating milestone at home",
  },
];

export function YearCarouselSimple() {
  const [current, setCurrent] = useState(0);
  const { setManagedInterval } = useManagedTimer();

  // Randomize slides on mount
  const shuffledSlides = useMemo(() => {
    const shuffled = [...slides];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Autoplay - advance every 4 seconds
  useEffect(() => {
    const intervalId = setManagedInterval(
      () => {
        setCurrent((prev) => (prev + 1) % shuffledSlides.length);
      },
      4000,
      { id: 'carousel-autoplay' }
    );

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shuffledSlides.length, setManagedInterval]);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] overflow-hidden">
      {shuffledSlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
          style={{
            opacity: current === index ? 1 : 0,
            zIndex: current === index ? 1 : 0,
          }}
        >
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-full w-full object-cover"
              loading={index < 2 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
              <div className="text-center space-y-6 md:space-y-8">
                {/* Wordmark */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <HeartlinesWordmark 
                    size="xl"
                    className="text-white drop-shadow-2xl"
                  />
                </div>
                
                {/* Year */}
                <div 
                  className="animate-fade-in text-white/90 text-lg md:text-xl font-light tracking-wider"
                  style={{ animationDelay: '0.4s' }}
                >
                  your story started in {slide.year}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
