
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DatingProfileDemo from "./DatingProfileDemo";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative px-6 py-20 lg:py-32 bg-gradient-to-br from-rich-black/80 via-graphite/60 to-dark-gray/80">
      {/* Reduced background effects */}
      <div className="absolute top-20 left-20 w-24 h-24 bg-electric-blue/10 rounded-full blur-2xl animate-float opacity-60"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-electric-purple/8 rounded-full blur-xl animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            {/* Enhanced badge with better contrast */}
            <div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-electric-blue/15 to-electric-purple/15 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-electric-blue/30 shadow-elegant"
              style={{
                transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`
              }}
            >
              <div className="w-2 h-2 bg-electric-blue rounded-full animate-electric-pulse"></div>
              <span className="text-sm font-medium text-white tracking-wide">Stop getting relationship advice from 1995</span>
            </div>
            
            {/* Improved headline with better hierarchy */}
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight text-shadow-strong">
              Your love story
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan text-shadow-electric">
                deserves better.
              </span>
            </h1>
            
            {/* Enhanced body copy with better contrast */}
            <p className="text-xl lg:text-2xl text-warm-white/90 mb-12 leading-relaxed font-normal text-shadow-electric">
              You mastered the swipe. Now master the relationship. Get real tools for real love—no fluff, no outdated advice, just what works.
            </p>
            
            {/* Optimized CTA with strategic glow */}
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/90 hover:to-electric-purple/90 text-white px-12 py-8 text-xl font-semibold rounded-full shadow-elegant hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-electric-blue/40 animate-subtle-glow">
                Start Building Better Love
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          <DatingProfileDemo />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
