import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HeroPhoneScroll from "./HeroPhoneScroll";

// Lightweight hero section component
export const OptimizedLandingPageHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 font-mono text-xs text-pink-200">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-coral-200">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-pink-200">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>

      {/* Static accent decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-burgundy-400/10 to-coral-400/10 rounded-full blur-xl backdrop-blur-sm"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-coral-400/15 to-burgundy-400/15 rounded-full blur-xl backdrop-blur-sm"></div>
      
      <div className="px-4 sm:px-6 xl:px-8 py-2 sm:py-4 xl:py-6">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-12 2xl:gap-16 items-start min-h-screen">
            {/* Left Column - Hero Copy */}
            <div className="text-left max-w-2xl self-center">
              <div className="space-y-3 mb-4 md:mb-6">
                <h1 className="text-3xl sm:text-4xl md:whitespace-normal md:leading-[1.3] md:overflow-visible md:pb-[0.15em] lg:text-[48px] xl:text-[60px] 2xl:text-[72px] font-playfair font-normal leading-tight animate-fade-in">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                    Modern love is messy.
                  </span>
                </h1>
                
                <h3 className="text-xl sm:text-2xl md:whitespace-normal md:leading-[1.25] md:pb-[0.1em] lg:text-[30px] xl:text-[36px] 2xl:text-[48px] font-playfair font-normal leading-tight animate-fade-in text-white/90">
                  <span className="font-brand">heartlines</span> helps you connect.
                </h3>
              </div>

              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <Link to="/profile">
                    <Button size="lg" variant="glass" className="px-6 py-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                      <User className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" variant="glass" className="px-6 py-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column - Phone Demo */}
            <div className="relative flex justify-center md:justify-end items-start self-start md:-mt-2 -mt-4">
              <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl md:scale-100 xl:scale-110 2xl:scale-125 scale-100 origin-top relative z-10">
                <HeroPhoneScroll className="animate-fade-in w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};