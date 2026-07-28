import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import PremiumBackground from "@/components/brand/PremiumBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-burgundy-800 relative overflow-hidden">
      <PremiumBackground />
      <div className="text-center relative z-10 px-6">
        <h1 className="text-5xl font-bold mb-3 text-white lowercase tracking-tight">404</h1>
        <p className="text-lg text-white/70 mb-6 lowercase">this page wandered off.</p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link to="/" className="text-coral-400 hover:text-coral-300 underline lowercase">
            back to home
          </Link>
          <span className="text-white/30">·</span>
          <Link to="/coach" className="text-coral-400 hover:text-coral-300 underline lowercase">
            chat with kai
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
