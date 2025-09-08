import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const youPrompts = [
  "When I'm overwhelmed I usually...",
  "The way to my heart is...",
  "I feel most loved when...",
  "My biggest relationship fear is...",
  "I need space when...",
];

const partnerPrompts = [
  "A fight we always circle back to is...",
  "They light up when I...",
  "Their stress looks like...",
  "They feel heard when I...",
  "What they never say but I know is...",
];

const HowItWorksSwipe = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Two Card Layout */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* First Card */}
        <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 min-h-[280px] flex flex-col">
          <Carousel className="w-full flex-1">
            <CarouselContent>
              {youPrompts.map((prompt, index) => (
                <CarouselItem key={index}>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 min-h-[200px] flex items-center justify-center
                    transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
                    <p className="text-white/90 font-medium text-center leading-relaxed">{prompt}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
            <CarouselNext className="hidden md:flex -right-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
          </Carousel>
          
          <div className="mt-4 text-center">
            <div className="flex justify-center gap-1">
              {youPrompts.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-coral-400/40"></div>
              ))}
            </div>
          </div>
        </Card>

        {/* Second Card */}
        <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 min-h-[280px] flex flex-col">
          <Carousel className="w-full flex-1">
            <CarouselContent>
              {partnerPrompts.map((prompt, index) => (
                <CarouselItem key={index}>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 min-h-[200px] flex items-center justify-center
                    transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
                    <p className="text-white/90 font-medium text-center leading-relaxed">{prompt}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
            <CarouselNext className="hidden md:flex -right-4 bg-white/10 border-white/20 hover:bg-white/20 text-white" />
          </Carousel>
          
          <div className="mt-4 text-center">
            <div className="flex justify-center gap-1">
              {partnerPrompts.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-pink-400/40"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSwipe;