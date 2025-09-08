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
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* You Card */}
        <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg">💙</span>
            </div>
            <h3 className="text-xl font-semibold text-white">You</h3>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {youPrompts.map((prompt, index) => (
                <CarouselItem key={index}>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/90 font-medium">{prompt}</p>
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
                <div key={index} className="w-2 h-2 rounded-full bg-blue-400/40"></div>
              ))}
            </div>
          </div>
        </Card>

        {/* Your Person Card */}
        <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg">💜</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Your Person</h3>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {partnerPrompts.map((prompt, index) => (
                <CarouselItem key={index}>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/90 font-medium">{prompt}</p>
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
                <div key={index} className="w-2 h-2 rounded-full bg-purple-400/40"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Inline CTA */}
      <div className="text-center">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Join Free
        </Button>
      </div>
    </div>
  );
};

export default HowItWorksSwipe;