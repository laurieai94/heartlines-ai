import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, Home, User, MessageSquare, Target, Settings, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { OptimizedLandingPageHero } from "./OptimizedLandingPageHero";
import { OptimizedLandingPageSteps } from "./OptimizedLandingPageSteps";
import FlameDivider from "./FlameDivider";

// Lightweight navigation component
const OptimizedNavigation = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/coach', label: 'Coach', icon: MessageSquare },
    { to: '/mission', label: 'Mission', icon: Target },
    { to: '/account', label: 'My Account', icon: Settings },
    { to: '/pricing', label: 'Plans', icon: CreditCard }
  ];

  return (
    <nav className="pl-4 pr-2 sm:px-6 xl:px-8 py-3 sticky top-0 z-50 bg-gradient-to-r from-burgundy-900/95 via-burgundy-800/90 to-burgundy-900/95 backdrop-blur-md border-b border-coral-400/15">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-white/50 hover:text-white/80 glass-burgundy hover:bg-burgundy-400/10 p-3 rounded-xl transition-all duration-200" aria-label="Open menu">
                <Menu className="w-8 h-8" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom" 
              align="start" 
              className="w-36 p-2 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl z-50"
              onInteractOutside={() => setIsMenuOpen(false)}
              onEscapeKeyDown={() => setIsMenuOpen(false)}
            >
              <div className="flex flex-col">
                {navItems.map(item => (
                  <Link 
                    key={item.to} 
                    to={item.to} 
                    className="text-white/70 hover:text-coral-200 hover:bg-burgundy-400/10 transition-all duration-200 text-sm px-3 py-2.5 font-light rounded-lg backdrop-blur-sm border border-transparent hover:border-coral-400/30" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Desktop Navigation CTAs */}
        <div className="hidden md:flex items-center gap-3 mr-6">
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 transition-all duration-200">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth?mode=signin">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 transition-all duration-200">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile CTA */}
        <div className="md:hidden mr-2">
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 font-medium text-xs px-3 py-1.5 transition-all duration-200">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signin">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 font-medium text-xs px-3 py-1.5 transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white font-medium text-xs px-3 py-1.5 rounded-full transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main optimized landing page component
const OptimizedLandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-burgundy-900">
      <OptimizedNavigation />
      <OptimizedLandingPageHero />
      <FlameDivider />
      <OptimizedLandingPageSteps />
    </div>
  );
};

export default OptimizedLandingPage;