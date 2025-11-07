import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackAuthFlow } from '@/utils/analytics';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

const narrativeSlides = [
  {
    id: 1,
    content: "dating apps taught us how to swipe.\nbut what happens after the first date?",
    highlight: "dating apps taught us how to swipe."
  },
  {
    id: 2,
    content: "nobody prepped us for the hard part.",
    highlight: "nobody prepped us for the hard part."
  },
  {
    id: 3,
    content: "the 2 a.m. fights about nothing that feel like everything.",
    highlight: "2 a.m. fights about nothing"
  },
  {
    id: 4,
    content: "the weekends ruined by\nthe same argument on repeat.",
    highlight: "same argument on repeat"
  },
  {
    id: 5,
    content: "the love that's real—\nbut sometimes so hard.",
    highlight: "love that's real"
  },
  {
    id: 6,
    content: "that's where heartlines comes in.",
    highlight: "heartlines",
    specialHighlight: "brand"
  },
  {
    id: 7,
    content: "not to \"fix\" your relationship.",
    highlight: "\"fix\""
  },
  {
    id: 8,
    content: "but to help you feel more connected—",
    highlight: "feel more connected"
  },
  {
    id: 9,
    content: "to yourself, and maybe to someone else.",
    highlight: "to yourself"
  },
  {
    id: 10,
    content: "",
    highlight: "",
    isCTA: true
  }
];

const HowItWorksSwipe = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleGetStartedClick = () => {
    trackAuthFlow.signUpStarted();
    navigate('/signup');
  };

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
      <Card className="relative overflow-hidden backdrop-blur-xl border border-white/30 rounded-3xl p-6 md:p-8 lg:p-12 min-h-[320px] shadow-2xl shadow-primary/10 bg-gradient-to-br from-white/20 via-white/15 to-white/10 hover:shadow-primary/20 transition-all duration-500">
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
                <div className="flex items-center justify-center min-h-[240px] md:min-h-[240px] p-3 md:p-6">
                  <div className="text-center max-w-3xl">
                    {slide.isCTA ? (
                      // CTA Slide
                      <div className="space-y-6">
                        <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-light leading-relaxed md:leading-relaxed">
                          messy, real, and
                          <br className="md:hidden" />
                          {' '}
                          <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-medium">
                            totally worth it.
                          </span>
                        </h2>
                        <Button 
                          onClick={handleGetStartedClick}
                          size="lg"
                          className="group relative text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl"
                          style={{
                            background: 'linear-gradient(to right, #FF8A50, #EC4899)',
                            boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {/* Shimmer overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div 
                              className="absolute inset-0 animate-shimmer"
                              style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                                backgroundSize: '200% 100%'
                              }}
                            />
                          </div>
                          
                          <span className="relative z-10">
                            get started
                          </span>
                        </Button>
                      </div>
                    ) : (
                      // Regular Text Slide
                      <p className="text-white text-xl md:text-3xl lg:text-4xl font-light leading-relaxed md:leading-relaxed">
                        {slide.content.split('\n').map((line, lineIndex) => {
                          const lines = slide.content.split('\n');
                          const isHighlighted = slide.highlight && line.includes(slide.highlight);
                          
                          if (isHighlighted) {
                            const parts = line.split(slide.highlight);
                            if (slide.specialHighlight === "brand") {
                              // For brand highlight: heartlines is white, rest has gradient
                              return (
                                <span key={lineIndex}>
                                  <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-medium">{parts[0]}</span>
                                  <span className="text-white font-brand">{slide.highlight}</span>
                                  <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-medium">{parts[1]}</span>
                                  {lineIndex < lines.length - 1 && <br />}
                                </span>
                              );
                            }
                            // Regular gradient highlight
                            return (
                              <span key={lineIndex}>
                                {parts[0]}
                                <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent font-medium">{slide.highlight}</span>
                                {parts[1]}
                                {lineIndex < lines.length - 1 && <br />}
                              </span>
                            );
                          }
                          
                          return (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < lines.length - 1 && <br />}
                            </span>
                          );
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-3 rounded-lg md:rounded-full md:backdrop-blur-md md:bg-white/20 md:border md:border-white/30 md:hover:bg-white/30 hover:scale-110 transition-all duration-300 group md:shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors drop-shadow-sm" />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-3 rounded-lg md:rounded-full md:backdrop-blur-md md:bg-white/20 md:border md:border-white/30 md:hover:bg-white/30 hover:scale-110 transition-all duration-300 group md:shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors drop-shadow-sm" />
        </button>
      </Card>
    </div>
  );
};

export default HowItWorksSwipe;