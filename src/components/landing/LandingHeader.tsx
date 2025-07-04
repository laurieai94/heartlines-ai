
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <nav className="px-6 py-4 relative z-10 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-xl flex items-center justify-center shadow-lg border border-electric-blue/30">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-sans">RealTalk</span>
        </div>
        <div className="flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-electric-blue/50 hover:text-electric-blue rounded-full font-light transition-all duration-300">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
