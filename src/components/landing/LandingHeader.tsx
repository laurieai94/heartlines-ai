
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <nav className="px-6 py-6 relative z-10 bg-gradient-to-r from-rich-black/60 via-graphite/30 to-rich-black/60 backdrop-blur-lg border-b border-electric-blue/15">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-xl flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/40 animate-subtle-glow">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-white font-sans text-shadow-electric">RealTalk</span>
        </div>
        <div className="flex items-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-electric-blue/60 text-white hover:bg-electric-blue/20 hover:border-electric-blue hover:text-white rounded-full font-semibold backdrop-blur-sm transition-all duration-300 px-8 py-3 text-lg">
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
