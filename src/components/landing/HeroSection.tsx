
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
      <div className="absolute top-20 left-20 w-24 h-24 bg-electric-blue/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-electric-purple/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div 
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-electric-blue/30 transition-transform duration-300"
              style={{
                transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
              }}
            >
              <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
              <span className="text-sm font-light text-white tracking-wide">Finally, an app that gets your relationship</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-thin text-white mb-8 leading-tight">
              Dating apps taught us 
              <br />
              how to swipe.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple">
                Now what?
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed font-light">
              We're tired of relationship advice that sounds like it came from 1995. RealTalk gets it—modern love is complicated, you're both busy humans, and generic tips don't cut it anymore.
            </p>
            
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/90 hover:to-electric-purple/90 text-white px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-light">
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
