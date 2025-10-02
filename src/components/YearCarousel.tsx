import { useEffect, useState, useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import elderlyCoupleImage from '@/assets/elderly-couple-living-room.png';
import elderlyCoupleRetroImage from '@/assets/elderly-couple-retro-room.png';
import elderlyCoupleNycImage from '@/assets/elderly-couple-nyc-apartment.png';
import elderlyManPortraitImage from '@/assets/elderly-man-portrait.png';
import elderlyCouplCozyLivingRoomImage from '@/assets/elderly-couple-cozy-living-room.png';
import elderlyCoupleVintageLivingRoomImage from '@/assets/elderly-couple-vintage-living-room.png';
import elderlyCouplePrideLivingRoomImage from '@/assets/elderly-couple-pride-living-room.png';
import warmGatheringImage from '@/assets/warm-gathering-diverse-souls.png';
import elderlyNativeAmericanWomenImage from '@/assets/elderly-native-american-women.png';
import HeartlinesWordmark from '@/components/Brand/HeartlinesWordmark';

interface CarouselSlide {
  year: string;
  image: string;
  alt: string;
}

const slides: CarouselSlide[] = [
  {
    year: '2056',
    image: warmGatheringImage,
    alt: 'Warm gathering of three diverse souls in a cozy living room adorned with cultural art, symbols of unity, and shared memories'
  },
  {
    year: '2061',
    image: elderlyCouplePrideLivingRoomImage,
    alt: 'Elderly couple in their wood-paneled living room with Progress Pride flag and vintage furniture'
  },
  {
    year: '2063',
    image: elderlyCoupleRetroImage,
    alt: 'Elderly couple in their retro 1970s living room with peace signs and lava lamps'
  },
  {
    year: '2067',
    image: elderlyCoupleNycImage,
    alt: 'Elderly couple in their cozy NYC apartment with their cats'
  },
  {
    year: '2075',
    image: elderlyCouplCozyLivingRoomImage,
    alt: 'Elderly couple in their cozy living room with warm lighting and plants'
  },
  {
    year: '2078',
    image: elderlyManPortraitImage,
    alt: 'Elderly man holding a portrait photo in his living room'
  },
  {
    year: '2092',
    image: elderlyCoupleImage,
    alt: 'Elderly couple in their living room, still together after decades'
  },
  {
    year: '2087',
    image: elderlyCoupleVintageLivingRoomImage,
    alt: 'Elderly couple in their vintage 1970s wood-paneled living room with family photos and warm memories'
  },
  {
    year: '2093',
    image: elderlyNativeAmericanWomenImage,
    alt: 'Two elderly Native American women sharing a warm moment together on their couch, surrounded by traditional art and cultural treasures'
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

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Auto-play functionality
    const interval = setInterval(() => {
      api.scrollNext(); // Let loop: true handle the infinite wrapping
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {shuffledSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] w-full">
                {/* Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                
                {/* Heartlines Branding */}
                <div className="absolute top-8 right-8 md:top-12 md:right-16 lg:top-16 lg:right-24 z-10">
                  <HeartlinesWordmark className="text-white" size="lg" />
                </div>
                
                {/* Year Text */}
                <div className="absolute inset-0 flex items-end justify-start pl-8 md:pl-16 lg:pl-24 pr-4 md:pr-24 lg:pr-32 pb-16 md:pb-20 lg:pb-24 xl:pb-32 2xl:pb-40">
                  <div className="flex flex-col gap-2 md:gap-3 mb-8 md:mb-10 lg:mb-14 xl:mb-20 2xl:mb-24">
                    <h2 className="font-['Shrikhand'] text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-8xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl leading-none">
                      {slide.year}
                    </h2>
                    <p className="text-white font-playfair text-lg md:text-xl lg:text-2xl font-normal drop-shadow-lg">
                      Love, but make it last.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

    </section>
  );
};
