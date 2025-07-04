
import { Heart } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="px-6 py-16 bg-black relative border-t border-white/15">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-electric-blue/40">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-light text-white">RealTalk</span>
        </div>
        <p className="text-gray-100 font-light text-lg">Finally, an app that gets your relationship.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
