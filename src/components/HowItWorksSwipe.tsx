import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

const narrativeSlides = [
  {
    id: 1,
    content: "Dating apps taught us how to swipe.\nCool. But… now what?",
    highlight: "Dating apps taught us how to swipe."
  },
  {
    id: 2,
    content: "Nobody prepped us for the real part.\nThe messy, everyday stuff.",
    highlight: "Nobody prepped us for the real part."
  },
  {
    id: 3,
    content: "Like how to argue without it becoming\na full-blown meltdown.",
    highlight: "argue without it becoming a full-blown meltdown"
  },
  {
    id: 4,
    content: "Or how to stop expecting people\nto read your mind.",
    highlight: "stop expecting people to read your mind"
  },
  {
    id: 5,
    content: "That's where Heartlines shows up.\nHelping you talk it out, spot your patterns,\nand build connections that actually stick.",
    highlight: "build connections that actually stick"
  }
];

const HowItWorksSwipe = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Single Interactive Card */}
      <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 min-h-[320px]">
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {narrativeSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="flex items-center justify-center min-h-[240px] p-6">
                  <div className="text-center max-w-3xl">
                    <p className="text-white text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed whitespace-pre-line">
                      {slide.content.split('\n').map((line, lineIndex) => {
                        const isHighlighted = slide.highlight && line.includes(slide.highlight);
                        if (isHighlighted) {
                          const parts = line.split(slide.highlight);
                          return (
                            <span key={lineIndex}>
                              {parts[0]}
                              <span className="text-coral-400 font-medium">{slide.highlight}</span>
                              {parts[1]}
                              {lineIndex < slide.content.split('\n').length - 1 && <br />}
                            </span>
                          );
                        }
                        return (
                          <span key={lineIndex}>
                            {line}
                            {lineIndex < slide.content.split('\n').length - 1 && <br />}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:text-coral-400 transition-colors" />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:text-coral-400 transition-colors" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {narrativeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current 
                  ? 'bg-coral-400 scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hint Text */}
        <div className="absolute top-6 right-6 hidden md:block">
          <p className="text-white/50 text-sm font-light">Tap or swipe →</p>
        </div>
      </Card>
    </div>
  );
};

export default HowItWorksSwipe;