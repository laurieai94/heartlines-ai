import { MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useState, useEffect } from 'react';

export const FloatingCTAButton = () => {
  const location = useLocation();
  const { scrollY } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(false);

  // Only show on landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    // Show button after scrolling past 200px
    setIsVisible(scrollY > 200);
  }, [scrollY]);

  if (!isLandingPage) return null;

  return (
    <Link to="/signup">
      <Button
        className={`fixed right-4 md:right-8 top-4 md:bottom-8 z-50 bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 md:px-6 py-3 md:py-4 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border border-white/20 font-light ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <MessageSquare className="w-5 h-5 md:mr-2" />
        <span className="hidden md:inline text-base">Chat with Kai</span>
      </Button>
    </Link>
  );
};
