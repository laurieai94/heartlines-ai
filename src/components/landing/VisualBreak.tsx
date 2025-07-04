
import { Heart } from "lucide-react";

const VisualBreak = () => {
  return (
    <section className="px-6 py-12 relative bg-gradient-to-r from-graphite/60 via-electric-blue/12 to-graphite/60 backdrop-blur-sm border-y border-electric-blue/20">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center justify-center">
          {/* Enhanced gradient line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent"></div>
          {/* Electric accent dots */}
          <div className="absolute left-1/4 w-3 h-3 bg-electric-blue/70 rounded-full animate-electric-pulse"></div>
          <div className="absolute right-1/4 w-3 h-3 bg-neon-cyan/70 rounded-full animate-electric-pulse" style={{ animationDelay: '0.5s' }}></div>
          {/* Enhanced center icon */}
          <div className="absolute bg-gradient-to-r from-rich-black/80 to-graphite/80 px-8 backdrop-blur-sm rounded-full">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-full flex items-center justify-center mx-auto border border-electric-blue/40 shadow-elegant animate-subtle-glow">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualBreak;
