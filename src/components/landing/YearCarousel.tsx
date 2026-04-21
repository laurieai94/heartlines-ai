import { useEffect, useState, useMemo, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import elderlyNativeAmericanWomenImage from '@/assets/elderly-native-american-women.webp';
import elderlyHeritageImage from '@/assets/elderly-couple-heritage-living-room.webp';
import elderlyCowboysSouthwesternImage from '@/assets/elderly-cowboys-southwestern-living-room.webp';
import warmGatheringImage from '@/assets/warm-gathering-diverse-souls.webp';
import elderlyCowboysHandsImage from '@/assets/elderly-cowboys-hands-together.webp';
import elderlyCouplePrideImage from '@/assets/elderly-couple-pride-living-room.webp';
import elderlyCoupleVintageImage from '@/assets/elderly-couple-vintage-living-room.webp';
import elderlyAsianCoupleImage from '@/assets/elderly-asian-couple-modern-apartment.webp';
import elderlyManPortraitImage from '@/assets/elderly-man-portrait.webp';
import elderlyFriendsCatsImage from '@/assets/elderly-friends-cats-city-apartment.webp';
import elderlyWomenPeaceRetroImage from '@/assets/elderly-women-peace-retro-living-room.webp';
import elderlyCoupleWarmVintageImage from '@/assets/elderly-couple-warm-vintage-living-room.webp';
import HeartlinesWordmark from '@/components/brand/HeartlinesWordmark';

interface CarouselSlide {
  year: string;
  image: string;
  alt: string;
}

const slides: CarouselSlide[] = [
  {
    year: '2056',
    image: elderlyNativeAmericanWomenImage,
    alt: 'Two elderly Native American women sharing a warm moment together on their couch, surrounded by traditional art and cultural treasures'
  },
  {
    year: '2061',
    image: elderlyHeritageImage,
    alt: 'Joyful moment in a heritage-inspired living room with cultural art and warm memories'
  },
  {
    year: '2063',
    image: elderlyCowboysSouthwesternImage,
    alt: 'Two elderly cowboys in their southwestern-style living room with desert art and memories'
  },
  {
    year: '2067',
    image: warmGatheringImage,
    alt: 'Warm gathering of diverse souls in a cozy living room adorned with cultural art and symbols of unity'
  },
  {
    year: '2075',
    image: elderlyCowboysHandsImage,
    alt: 'Manos unidas en el hogar - hands joined together in a warm home filled with memories'
  },
  {
    year: '2078',
    image: elderlyCouplePrideImage,
    alt: 'Warm embrace in nostalgic space with Progress Pride flag and vintage furniture'
  },
  {
    year: '2092',
    image: elderlyCoupleVintageImage,
    alt: 'Elderly couple in their vintage wood-paneled living room with family photos and warm memories'
  },
  {
    year: '2087',
    image: elderlyAsianCoupleImage,
    alt: 'Elderly Asian couple in their modern apartment, still together after decades'
  },
  {
    year: '2093',
    image: elderlyManPortraitImage,
    alt: 'Elderly man holding a framed memory in his living room'
  },
  {
    year: '2054',
    image: elderlyFriendsCatsImage,
    alt: 'Elderly friends sharing warmth with their beloved cats in a cozy city apartment'
  },
  {
    year: '2069',
    image: elderlyWomenPeaceRetroImage,
    alt: 'Two elderly women in their vibrant retro living room decorated with peace symbols and colorful memories'
  },
  {
    year: '2082',
    image: elderlyCoupleWarmVintageImage,
    alt: 'Elderly couple sharing warm smiles in their vintage living room filled with decades of love'
  }
];

export const YearCarousel = () => {
  // Randomize slides order on component mount
  const shuffledSlides = useMemo(() => {
    const shuffled = [...slides];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Preload all carousel images on mount
  useEffect(() => {
    const imageUrls = shuffledSlides.map(slide => slide.image);
    preloadCriticalImages(imageUrls);
  }, [shuffledSlides]);

  const autoplay = useMemo(() => 
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: false
    }), 
  []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
          watchDrag: false,
          skipSnaps: false,
          duration: 800,
          containScroll: 'trimSnaps',
          slidesToScroll: 1
        }}
        plugins={[autoplay as any]}
        className="w-full [&_.overflow-hidden]:pointer-events-none [&_.overflow-hidden]:touch-none"
      >
        <CarouselContent className="!ml-0">
          {shuffledSlides.map((slide, index) => (
            <CarouselItem key={index} className="!pl-0 basis-full">
              <div className="relative h-[70vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] w-full">
                {/* Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-contain object-[center_20%]"
                  loading={index === 0 || index === 1 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                
                {/* Year Text */}
                <div className="absolute inset-0 flex items-end justify-start pl-8 md:pl-16 lg:pl-24 pr-4 md:pr-24 lg:pr-32 pb-8 md:pb-20 lg:pb-24 xl:pb-32 2xl:pb-40">
                  <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-10 lg:mb-14 xl:mb-20 2xl:mb-24">
                    <p className="text-white font-glacial text-lg md:text-xl lg:text-2xl font-normal drop-shadow-lg">
                      Love, but make it last.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Fixed Heartlines Watermark - Outside Carousel */}
      <div className="fixed top-8 right-8 md:top-12 md:right-16 lg:top-16 lg:right-24 z-20 pointer-events-none">
        <HeartlinesWordmark className="text-white drop-shadow-lg" size="lg" showTagline={true} />
      </div>
    </section>
  );
};
