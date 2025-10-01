import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import elderlyCoupleImage from '@/assets/elderly-couple-living-room.png';
import elderlyCoupleRetroImage from '@/assets/elderly-couple-retro-room.png';
import elderlyCoupleNycImage from '@/assets/elderly-couple-nyc-apartment.png';
import HeartlinesWordmark from '@/components/Brand/HeartlinesWordmark';

interface CarouselSlide {
  year: string;
  image: string;
  alt: string;
}

const slides: CarouselSlide[] = [
  {
    year: '2063',
    image: elderlyCoupleRetroImage,
    alt: 'Elderly couple in their retro 1970s living room with peace signs and lava lamps'
  },
  {
    year: '2071',
    image: elderlyCoupleImage,
    alt: 'Elderly couple in their living room, still together after decades'
  },
  {
    year: '2067',
    image: elderlyCoupleNycImage,
    alt: 'Elderly couple in their cozy NYC apartment with their cats'
  }
];

export const YearCarousel = () => {
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
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
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
          {slides.map((slide, index) => (
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                
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
