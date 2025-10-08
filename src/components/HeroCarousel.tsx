import { useState, useEffect } from 'react';
import HeartlinesWordmark from './Brand/HeartlinesWordmark';

interface Slide {
  year: string;
  gradient: string;
}

const slides: Slide[] = [
  { year: "2016", gradient: "from-burgundy-600 via-burgundy-500 to-coral-500" },
  { year: "2017", gradient: "from-coral-600 via-coral-500 to-peach-400" },
  { year: "2018", gradient: "from-peach-500 via-coral-400 to-burgundy-400" },
  { year: "2019", gradient: "from-burgundy-500 via-coral-500 to-peach-500" },
  { year: "2020", gradient: "from-coral-500 via-peach-400 to-burgundy-400" },
  { year: "2021", gradient: "from-peach-600 via-coral-500 to-burgundy-500" },
  { year: "2022", gradient: "from-burgundy-600 via-peach-500 to-coral-400" },
  { year: "2023", gradient: "from-coral-600 via-burgundy-500 to-peach-400" },
  { year: "2024", gradient: "from-peach-500 via-burgundy-400 to-coral-500" },
  { year: "2025", gradient: "from-burgundy-500 via-coral-600 to-peach-500" },
  { year: "2026", gradient: "from-coral-500 via-peach-500 to-burgundy-600" },
  { year: "2027", gradient: "from-peach-600 via-burgundy-500 to-coral-600" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] overflow-hidden pointer-events-none">
      {slides.map((slide, index) => (
        <div
          key={slide.year}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: current === index ? 1 : 0,
            zIndex: current === index ? 2 : 1,
          }}
        >
          <div className={`relative h-full w-full bg-gradient-to-br ${slide.gradient}`}>
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20" />
            
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
