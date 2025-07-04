
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <nav className="px-6 py-4 relative z-10 bg-gradient-to-r from-rich-black/40 via-graphite/20 to-rich-black/40 backdrop-blur-sm border-b border-electric-blue/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-xl flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/30 neon-glow-blue">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-warm-white font-sans">RealTalk</span>
        </div>
        <div className="flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-electric-blue/50 text-warm-white hover:bg-electric-blue/15 hover:border-electric-blue/70 hover:text-electric-blue rounded-full font-thin backdrop-blur-sm transition-all duration-300">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
