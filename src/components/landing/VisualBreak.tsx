
import { Heart } from "lucide-react";

const VisualBreak = () => {
  return (
    <section className="px-6 py-8 relative bg-black border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center justify-center">
          {/* Clean gradient line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent"></div>
          {/* Electric accent dots */}
          <div className="absolute left-1/4 w-2 h-2 bg-electric-blue/80 rounded-full animate-subtle-pulse"></div>
          <div className="absolute right-1/4 w-2 h-2 bg-electric-purple/80 rounded-full animate-subtle-pulse" style={{ animationDelay: '0.5s' }}></div>
          {/* Center icon */}
          <div className="absolute bg-black px-6 backdrop-blur-sm rounded-full">
            <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-4 mx-auto electric-border electric-glow">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualBreak;
