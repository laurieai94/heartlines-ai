
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
    <section className="relative px-6 py-20 lg:py-28 bg-gradient-to-br from-rich-black/60 via-graphite/40 to-dark-gray/60 backdrop-blur-sm">
      {/* Enhanced accent decoration with electric colors */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-electric-blue/15 to-electric-purple/20 rounded-full blur-xl animate-electric-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-neon-cyan/12 to-electric-blue/15 rounded-full blur-xl animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/5 via-electric-blue/2 to-graphite/5"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-warm-white/5 to-electric-blue/12 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-electric-blue/25 shadow-elegant transition-transform duration-300 hover:neon-glow-blue"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full animate-electric-pulse"></div>
              <span className="text-sm font-light text-warm-white/90 tracking-wide">Finally, an app that gets your relationship</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-thin text-warm-white mb-8 leading-tight">
              Your relationship isn't a rom-com.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan">
                Real growth needs real tools.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-medium-gray mb-12 leading-relaxed font-light">
              We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
            </p>
            
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-10 py-7 text-lg rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-electric-blue/40 font-light backdrop-blur-sm hover:neon-glow-blue">
                Get Started - It's Free
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
