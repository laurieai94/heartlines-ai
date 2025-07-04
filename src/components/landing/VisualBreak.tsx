
import { Heart } from "lucide-react";

const VisualBreak = () => {
  return (
    <section className="px-6 py-8 relative bg-gradient-to-r from-graphite/40 via-electric-blue/8 to-graphite/40 backdrop-blur-sm border-y border-electric-blue/15">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center justify-center">
          {/* Enhanced gradient line with electric colors */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent"></div>
          {/* Electric accent dots */}
          <div className="absolute left-1/4 w-2 h-2 bg-electric-blue/80 rounded-full animate-electric-pulse neon-glow-blue"></div>
          <div className="absolute right-1/4 w-2 h-2 bg-neon-cyan/80 rounded-full animate-electric-pulse" style={{ animationDelay: '0.5s' }}></div>
          {/* Enhanced center icon */}
          <div className="absolute bg-gradient-to-r from-rich-black/50 to-graphite/50 px-6 backdrop-blur-sm rounded-full">
            <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-4 mx-auto border border-electric-blue/40 neon-glow-blue">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualBreak;
