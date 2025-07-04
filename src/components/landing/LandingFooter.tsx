
import { Heart } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="px-6 py-20 bg-rich-black/80 backdrop-blur-sm relative border-t border-electric-blue/20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-full flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/40 animate-subtle-glow">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-white text-shadow-electric">RealTalk</span>
        </div>
        <p className="text-warm-white/80 font-medium text-xl">Finally, an app that gets your relationship.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
