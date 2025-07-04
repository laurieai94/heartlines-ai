
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
    <section className="relative px-6 py-20 lg:py-28 bg-black">
      {/* Clean accent decoration with electric colors */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-electric-blue/10 rounded-full blur-xl animate-subtle-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-electric-purple/10 rounded-full blur-xl animate-subtle-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div 
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg transition-transform duration-300"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full animate-subtle-pulse"></div>
              <span className="text-sm font-light text-white/90 tracking-wide">Finally, an app that gets your relationship</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-thin text-white mb-8 leading-tight">
              Stop getting relationship advice from 1995.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-electric-blue">
                Your love life deserves an upgrade.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-100 mb-12 leading-relaxed font-light">
              We're building the relationship app we wish we'd had—one that actually gets how modern love works (or doesn't work) and gives you tools that don't make you cringe.
            </p>
            
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/80 hover:to-electric-purple/80 text-white px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 border border-electric-blue/40 font-light electric-glow">
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
