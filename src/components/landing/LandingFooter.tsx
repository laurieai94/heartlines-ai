
import { Heart } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="px-6 py-16 bg-rich-black/70 backdrop-blur-sm relative border-t border-electric-blue/15">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/40 neon-glow-blue">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-light text-warm-white">RealTalk</span>
        </div>
        <p className="text-medium-gray font-light text-lg">Finally, an app that gets your relationship.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
