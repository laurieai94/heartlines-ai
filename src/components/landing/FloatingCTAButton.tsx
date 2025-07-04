
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingCTAButton = () => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showFloatingButton) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
      <Link to="/dashboard">
        <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-6 py-4 rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm border border-electric-blue/40 neon-glow-blue">
          Try It Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default FloatingCTAButton;
