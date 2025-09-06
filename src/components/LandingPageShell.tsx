import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";
import ProductPhoneDemo from "./ProductPhoneDemo";

const LandingPageShell = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-burgundy-900">
      {/* Navigation */}
      <nav className="px-6 py-4 relative z-10 bg-burgundy-900 border-b border-pink-300/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <BrandMark 
                size="md"
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-and-security">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full font-thin">
                Privacy & Security
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="border-coral-400/50 text-coral-400 hover:bg-coral-400/10 rounded-full font-thin backdrop-blur-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28">
        {/* Subtle accent decoration */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-coral-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/15 to-coral-400/15 rounded-full blur-xl animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="space-y-4 mb-12">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-normal leading-tight text-balance">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                    Modern love is messy.
                  </span>
                </h1>
                
                <h2 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-normal leading-tight text-balance">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                    Ghosting isn't closure.
                  </span>
                </h2>
                
                <h3 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-normal leading-tight text-balance">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                    Kai helps you actually connect.
                  </span>
                </h3>
              </div>
              
              <Link to="/get-started">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm">
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>

            {/* Right Column - Phone Demo */}
            <div className="relative flex justify-center lg:justify-end">
              <ProductPhoneDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Loading indicator for below-fold content */}
      <section className="px-6 py-8 text-center">
        <div className="text-white/60 font-light">Loading more content...</div>
      </section>
    </div>
  );
};

export default LandingPageShell;