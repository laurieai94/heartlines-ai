import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPageFallback() {
  return (
    <div className="min-h-screen bg-burgundy-800 relative overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-coral-900/20 via-pink-900/15 to-coral-900/20"></div>
      
      <div className="relative z-10 px-6 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <BrandMark size="lg" className="mx-auto mb-8" />
          
          <h1 className="text-4xl lg:text-6xl font-thin text-white mb-6 leading-tight">
            your relationship isn't a rom-com.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
              real growth needs real tools.
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            modern love is complicated, you're both busy, and sometimes you need help figuring out how to show up for each other.
          </p>
          
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light">
              get started - it's free
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}