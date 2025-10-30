import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, User, Home, CreditCard, Settings, UserPlus, MessageCircleHeart, CircleSlash, Bolt, Shield, Lock } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND } from "@/branding";
import kaiPremiumPortrait from "@/assets/kai-premium-portrait.png";
import BrandMark from "./BrandMark";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import ProductPhoneDemo from "./ProductPhoneDemo";
import HeroPhoneScroll from "./HeroPhoneScroll";
import FlameDivider from "./FlameDivider";
import { useGlobalResize } from '@/hooks/useGlobalResize';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import SiteFooter from "./SiteFooter";
import HowItWorksSwipe from "./HowItWorksSwipe";
import FrostedHeartShowcase from "./FrostedHeartShowcase";
import HeroCarousel from "./HeroCarousel";
import { Timeline, PersonalIcon, InclusiveIcon, ShieldIcon, HeartSupportIcon, ClockIcon, ConversationIcon } from "./ui/timeline";
import elderlyCoupleCouch from "@/assets/elderly-couple-couch.jpg";
import SimpleHeader from "./SimpleHeader";
import heartlinesLogo from "@/assets/heartlines-logo-white.svg";
import PremiumBackground from "./PremiumBackground";

// Clean StepCard Component - Mobile Style
const StepCard = ({
  step,
  title,
  description,
  secondaryText,
  icon,
  iconName,
  index
}: {
  step: string;
  title: string;
  description: string;
  secondaryText?: string;
  icon: React.ReactNode;
  iconName: string;
  index: number;
}) => {
  return <article className="relative group h-full animate-fade-in" style={{
    animationDelay: `${index * 0.15}s`
  }} tabIndex={0} role="article" aria-label={title}>
      {/* Clean Card with Enhanced Glassmorphism */}
      <div className="relative z-10 backdrop-blur-xl rounded-3xl p-6 md:p-7 h-full flex flex-col justify-between 
        bg-gradient-to-br from-white/20 via-white/15 to-white/10
        border border-pink-400/15
        hover:-translate-y-2 hover:scale-105 hover:rotate-1
        hover:bg-gradient-to-br hover:from-white/25 hover:via-white/20 hover:to-white/15
        hover:shadow-2xl hover:shadow-pink-500/20
        transition-all duration-500 ease-out
      ">
        
        {/* Simple Step Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full 
            bg-gradient-to-br from-pink-500 via-orange-500 to-pink-600
            shadow-lg shadow-pink-500/40
            group-hover:scale-110 group-hover:rotate-12
            transition-all duration-300
          ">
            <span className="text-white text-sm font-medium">{step}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Simple Icon */}
          <div className="inline-flex group-hover:scale-110 transition-all duration-300">
            <div className="w-8 h-8 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-orange-300 to-pink-400">
              {icon}
            </div>
          </div>
          
          {/* Clean Title */}
          <h3 className="text-xl md:text-2xl font-playfair text-white leading-tight font-light tracking-wide
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
            group-hover:text-pink-100 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <div className="relative z-10">
          <p className="text-pink-50/95 text-base md:text-lg leading-loose mt-4 font-light tracking-wide
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]
            group-hover:text-white transition-colors duration-300">
            {description}
          </p>
          {secondaryText && <p className="text-pink-100/70 text-sm md:text-base leading-loose mt-2 font-light italic tracking-wide
              drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]
              group-hover:text-white/80 transition-colors duration-300">
              {secondaryText}
            </p>}
        </div>
      </div>
    </article>;
};
const LandingPage = ({
  showMarketingTopBar = true
}: {
  showMarketingTopBar?: boolean;
}) => {
  const {
    user
  } = useAuth();
  const [isSplashActive, setIsSplashActive] = useState(() => {
    return !sessionStorage.getItem('homepage_visited');
  });
  const navigate = useNavigate();
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const handleTalkToKai = () => {
    if (user) {
      navigate('/coach');
    } else {
      navigate('/signup');
    }
  };
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    scrollY
  } = useScrollDirection();

  // Ensure menu closes when user navigates away or clicks outside
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);

    // Close menu on route changes
    window.addEventListener('popstate', closeMenu);
    return () => {
      window.removeEventListener('popstate', closeMenu);
    };
  }, []);

  // Use global resize manager to close menu on resize
  useGlobalResize(() => {
    setIsMenuOpen(false);
  }, []);
  const isEmbedded = !showMarketingTopBar;

  // Glass card styling helper
  const glassCard = "rounded-2xl border border-burgundy-500/15 glass-burgundy shadow-md";
  const navItems = [{
    to: '/',
    label: 'Home',
    icon: Home
  }, {
    to: '/profile',
    label: 'Profile',
    icon: User
  }, {
    to: '/coach',
    label: 'Coach',
    icon: MessageSquare
  }, {
    to: '/account',
    label: 'My Account',
    icon: Settings
  }, {
    to: '/plans',
    label: 'Plans',
    icon: CreditCard
  }];
  const datingProfiles = [{
    name: "Emma",
    age: 28,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Photographer & dog mom"
  }, {
    name: "Jake",
    age: 31,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Chef & weekend surfer"
  }, {
    name: "Zoe",
    age: 24,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "Designer & music lover"
  }, {
    name: "Chris",
    age: 33,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Teacher & rock climber"
  }, {
    name: "Lily",
    age: 27,
    photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
    bio: "Writer & coffee enthusiast"
  }, {
    name: "Alex",
    age: 30,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    bio: "Engineer & marathon runner"
  }, {
    name: "Maya",
    age: 25,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    bio: "Artist & yoga instructor"
  }];
  useEffect(() => {
    // Only run minimal timers for full marketing page
    if (!isEmbedded) {
      // Defer non-critical timers to idle time
      const deferredSetup = () => {
        // Show floating button after page is stable
        const timer = setTimeout(() => {
          setShowFloatingButton(true);
        }, 2000);

        // Start profile rotation after initial render - slower updates
        const profileTimer = setInterval(() => {
          setCurrentProfile(prev => (prev + 1) % datingProfiles.length);
        }, 4000); // Slower rotation to reduce repaints

        return () => {
          clearTimeout(timer);
          clearInterval(profileTimer);
        };
      };
      let cleanup: (() => void) | undefined;

      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          cleanup = deferredSetup();
        }, {
          timeout: 2000
        });
      } else {
        setTimeout(() => {
          cleanup = deferredSetup();
        }, 1000);
      }
      return () => {
        cleanup?.();
      };
    }
  }, [isEmbedded]);

  // Ensure navigation is visible on mobile page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Force immediate scroll to top on mount
        window.scrollTo(0, 0);

        // Prevent browser from restoring previous scroll position
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
      }
    }
  }, []);

  // Add fallback class for mobile CSS override
  useEffect(() => {
    document.documentElement.classList.add('landing-page-active');
    document.body.classList.add('landing-page-active');
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('landing-page-active');
    }
    return () => {
      document.documentElement.classList.remove('landing-page-active');
      document.body.classList.remove('landing-page-active');
      if (root) {
        root.classList.remove('landing-page-active');
      }
    };
  }, []);

  return <>
      {/* Persistent Heartlines Logo - Top Right */}
      <div className="heartlines-logo-fixed fixed top-12 right-6 md:right-12 xl:right-14 z-[60] pointer-events-none will-change-auto">
          <div className="relative">
            <img 
              src={heartlinesLogo} 
              alt="heartlines" 
              className="h-48 sm:h-52 md:h-56 lg:h-64 xl:h-72 drop-shadow-lg pointer-events-none"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

      {/* Navigation - Outside main container for proper fixed positioning */}
      {showMarketingTopBar ? <nav className={`pl-4 pr-2 sm:px-6 xl:px-8 py-3 fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-800 via-burgundy-800 to-burgundy-800 border-b border-coral-400/20 transition-all duration-300 ${scrollY > 50 ? 'backdrop-blur-2xl shadow-2xl shadow-burgundy-950/50' : 'backdrop-blur-xl shadow-lg'}`}>
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-white/50 hover:text-white/80 bg-transparent hover:bg-transparent border-0 p-0 transition-all duration-200" aria-label="Open menu">
                    <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-16 p-2 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl z-50" onInteractOutside={() => setIsMenuOpen(false)} onEscapeKeyDown={() => setIsMenuOpen(false)}>
                  <div className="flex flex-col">
                    {navItems.map(item => <Link key={item.to} to={item.to} title={item.label} className="text-white/70 hover:text-coral-200 hover:bg-burgundy-400/10 transition-all duration-200 p-2.5 font-light rounded-lg backdrop-blur-sm border border-transparent hover:border-coral-400/30 flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                        <item.icon className="w-5 h-5" />
                      </Link>)}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Desktop Navigation CTAs */}
            <div className="hidden md:flex items-center gap-3 mr-6">
              {user ? <>
                  <Link to="/profile">
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-burgundy-400/10 transition-all duration-200">
                      <User className="h-5 w-5" style={{
                  color: '#ffc0cb'
                }} />
                    </Button>
                  </Link>
                  <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 md:px-5 lg:px-6 py-2.5 md:py-3 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300" style={{
                boxShadow: '0 0 40px rgba(255, 107, 157, 0.45), 0 6px 24px rgba(255, 107, 157, 0.55), 0 3px 12px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
              }}>
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 animate-shimmer" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }} />
                      </div>
                      
                      <span className="relative z-10 text-sm md:text-base font-medium">get started</span>
                    </Button>
                  </div>
                </> : <>
                  <Link to="/signin">
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-burgundy-400/10 transition-all duration-200">
                      <User className="h-5 w-5" style={{
                  color: '#ffc0cb'
                }} />
                    </Button>
                  </Link>
                  <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 md:px-5 lg:px-6 py-2.5 md:py-3 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300" style={{
                boxShadow: '0 0 40px rgba(255, 107, 157, 0.45), 0 6px 24px rgba(255, 107, 157, 0.55), 0 3px 12px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
              }}>
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 animate-shimmer" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }} />
                      </div>
                      
                      <span className="relative z-10 text-sm md:text-base font-medium">chat with kai</span>
                    </Button>
                  </div>
                </>}
            </div>
            
            {/* Mobile CTA */}
            <div className="md:hidden mr-2">
              <div className="flex items-center gap-2">
                <Link to="/signin">
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0 hover:bg-burgundy-400/10 transition-all duration-200">
                    <User className="h-5 w-5" style={{
                  color: '#ffc0cb'
                }} />
                  </Button>
                </Link>
            <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-md md:group-hover:opacity-100 transition-opacity duration-300" />
              
              <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white font-medium text-xs px-3 py-1.5 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-200" style={{
                boxShadow: '0 0 30px rgba(255, 107, 157, 0.4), 0 4px 16px rgba(255, 107, 157, 0.5), 0 2px 8px rgba(255, 138, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              }}>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 animate-shimmer" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }} />
                </div>
                
                <span className="relative z-10">
                  get started
                </span>
              </Button>
            </div>
              </div>
            </div>
          </div>
        </nav> : <SimpleHeader user={user} activeTab="home" onSignInClick={() => navigate('/signin')} />}

      {/* Main container */}
      <div className="min-h-screen relative overflow-x-hidden landing-page-scroll bg-burgundy-800">
      <PremiumBackground />


      {/* Full-Bleed Hero Carousel */}
      <HeroCarousel />

      {/* Spacer between carousel and hero section - proportional across all screens */}
      <div className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28" aria-hidden="true" />

      {/* Hero Section - Locked layout with flame background */}
      <section className="relative overflow-hidden" style={{
        minHeight: 'clamp(40vh, 50vh, 65vh)'
      }}>
        {/* Static background preserved */}
        
        {/* Glassmorphic background layers */}
        {!isEmbedded && <>
            {/* Primary hero section with locked two-column layout */}
            <div className="px-4 sm:px-6 xl:px-8 py-6 sm:py-4 xl:py-6">
              {/* Static accent decoration */}
              <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-burgundy-400/10 to-coral-400/10 rounded-full blur-xl backdrop-blur-sm"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-coral-400/15 to-burgundy-400/15 rounded-full blur-xl backdrop-blur-sm"></div>
              
              <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 xl:gap-16 items-center min-h-[50vh] md:min-h-[90vh]">
                  {/* Left Column - Hero Copy (Always Left) */}
                  <div className="text-left w-full self-center md:pt-0 px-4 sm:px-6 lg:px-8 xl:px-0 mt-8 md:mt-0">
                    <div className="space-y-2 mb-1 md:mb-6">
<h1 className="font-playfair font-normal leading-[1.15] tracking-tight animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-coral-300 via-pink-400 to-coral-400 pr-16 pb-1 will-change-transform" style={{
  fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(251, 207, 232, 0.15)'
}}>
  relationships <span className="whitespace-nowrap">aren't rom-coms.</span>
</h1>
                      
                      <h3 className="font-playfair font-light leading-[1.25] tracking-wide animate-fade-in text-white/95 md:whitespace-nowrap max-w-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" style={{
                      fontSize: 'clamp(1.25rem, 3.75vw, 2.75rem)',
                      animationDelay: '0.2s'
                    }}>
                        <span className="font-brand">heartlines</span> helps you connect.
                      </h3>
                    </div>

                    
                    <div className="hidden md:flex items-center gap-4">
                      <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                        <div className="relative group inline-block">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <Button size="lg" className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-4 text-base lg:text-lg xl:text-xl rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-500 transform hover:scale-105 font-light animate-fade-in" style={{
                          boxShadow: '0 0 50px rgba(255, 107, 157, 0.5), 0 8px 28px rgba(255, 107, 157, 0.55), 0 4px 14px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                        }}>
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 animate-shimmer" style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                              backgroundSize: '200% 100%'
                            }} />
                            </div>
                            
                            <span className="relative z-10 flex items-center">
                              let's get real
                              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 ml-2" />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Mobile Chat Interface (Always Right, Always Visible Above Fold) */}
                  <div className="relative flex justify-center md:justify-end items-center self-center">
                    <div className="relative z-10 max-w-[320px] md:ml-auto md:mr-8 lg:mr-16 xl:mr-24 2xl:mr-32">
                      <HeroPhoneScroll className="animate-fade-in" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
        
        {/* Embedded version - horizontal layout with static background */}
        {isEmbedded && <div className="px-6 py-8 lg:py-12">
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)]">
                {/* Left - Text Content */}
                <div className="max-w-[580px]">
                  <div className="space-y-4 mb-6">
                    <h1 className="text-3xl md:leading-[1.3] md:pb-[0.15em] lg:text-[48px] xl:text-[64px] 2xl:text-[80px] font-playfair font-normal leading-tight animate-fade-in">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                        modern love is messy.
                      </span>
                    </h1>
                    
                    <h3 className="md:leading-[1.25] md:pb-[0.1em] font-playfair font-normal leading-tight animate-fade-in text-white/90 whitespace-nowrap" style={{
                    fontSize: 'clamp(1.1rem, 4vw, 2.75rem)',
                    animationDelay: '0.8s'
                  }}>
                      <span className="font-brand">heartlines</span> helps you connect.
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <Button size="lg" className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-4 text-base rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-500 transform hover:scale-105 font-light animate-fade-in" style={{
                      boxShadow: '0 0 50px rgba(255, 107, 157, 0.5), 0 8px 28px rgba(255, 107, 157, 0.55), 0 4px 14px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                    }}>
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 animate-shimmer" style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                          backgroundSize: '200% 100%'
                        }} />
                        </div>
                        
                        <span className="relative z-10 flex items-center">
                          let's get real
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right - Chat Animation */}
                <div className="relative flex justify-center">
                  <div className="w-full max-w-md" style={{
                  height: 'min(min(56svh, 56dvh), 550px)'
                }}>
                    <HeroPhoneScroll className="animate-fade-in w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </section>

      {/* How It Works Section - Playful 4-Step Flow */}
      <section id="how-it-works" className="pt-6 pb-4 md:pt-6 md:pb-8 relative overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-3 md:mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-brand mb-4 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider md:whitespace-nowrap" style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
            }}>how it works</h2>
            
          </div>
          
          {/* 4-Step Cards */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {[{
                step: "01",
                title: "build your profile",
                description: "show how you really vibe—calm, stressed, or full chaos.",
                secondaryText: "(no fake bios here.)",
                icon: <UserPlus className="w-5 h-5" />,
                iconName: "user-plus"
              }, {
                step: "02",
                title: "add your person",
                description: "bring them in too, so kai sees the full picture.",
                secondaryText: "(every story has two (+) main characters)",
                icon: <Heart className="w-5 h-5" />,
                iconName: "heart"
              }, {
                step: "03",
                title: "chat with kai",
                description: "spill it, vent it, practice it—then get advice that actually slaps.",
                secondaryText: "(less textbook therapy, more real talk)",
                icon: <MessageCircleHeart className="w-5 h-5" />,
                iconName: "message-heart"
              }, {
                step: "04",
                title: "try it irl",
                description: "test it out in the wild—less fights, more feels.",
                secondaryText: "(because the magic happens offline)",
                icon: <Sparkles className="w-5 h-5" />,
                iconName: "sparkles"
              }].map((item, index) => <StepCard key={index} step={item.step} title={item.title} description={item.description} secondaryText={item.secondaryText} icon={item.icon} iconName={item.iconName} index={index} />)}
            </div>

            {/* Get Started CTA */}
            <div className="mt-12 md:mt-16 mb-8 md:mb-16 text-center">
              <div className="relative group inline-block cursor-pointer" onClick={handleTalkToKai}>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                
                <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl" style={{
                  boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}>
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 animate-shimmer" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }} />
                  </div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 md:w-6 md:w-6" />
                    get started
                  </span>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Meet Kai Section - Ultra Premium Redesign */}
      <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Enhanced Background with Multi-layer Gradient Mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-pink-500/8 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-coral-500/6 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-orange-500/6 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Hero Typography - Centered */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="font-space text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold mb-4 md:mb-6
              tracking-[-0.05em] leading-none animate-fade-in"
              style={{
                animationDelay: '0.2s',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '2px transparent',
                backgroundClip: 'text',
                textShadow: '0 0 80px rgba(236, 72, 153, 0.4)',
                filter: 'drop-shadow(0 4px 20px rgba(236,72,153,0.3))',
                position: 'relative',
              }}>
              <span style={{
                background: 'linear-gradient(135deg, #fef5f7 0%, #ffd4b8 50%, #fef5f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>meet kai</span>
            </h2>
            
            <h3 className="font-inter text-2xl md:text-3xl lg:text-4xl font-light text-white/90 
              tracking-[0.15em] uppercase animate-fade-in" 
              style={{
                animationDelay: '0.4s',
                textShadow: '0 2px 20px rgba(236, 72, 153, 0.3)'
              }}>
              your ai relationship coach
            </h3>
          </div>

          {/* Asymmetric Layout Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Premium Avatar + CTA (4 columns) */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start animate-fade-in" style={{
                animationDelay: '0.6s'
              }}>
                <div className="relative group w-full max-w-md">
                  {/* Multi-layer Glow System */}
                  <div className="absolute -inset-16 bg-gradient-to-r from-pink-500/20 via-coral-400/15 to-orange-400/20 rounded-full blur-[120px] animate-pulse" style={{
                    animationDuration: '4s'
                  }}></div>
                  
                  <div className="absolute -inset-12 bg-gradient-to-br from-pink-400/25 via-coral-500/15 to-orange-500/25 rounded-full blur-[80px]"></div>
                  
                  {/* Frosted Glass Frame System */}
                  <div className="absolute -inset-8 rounded-full backdrop-blur-3xl bg-gradient-to-br from-white/8 via-white/4 to-white/8 
                    border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]"></div>
                  
                  <div className="absolute -inset-3 rounded-full border-2 border-white/20 
                    shadow-[0_0_30px_rgba(236,72,153,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)]"></div>
                  
                  {/* Premium Portrait Container with 3D Effect */}
                  <div className="relative aspect-square rounded-full overflow-hidden 
                    ring-[4px] ring-white/30 shadow-[0_20px_60px_rgba(236,72,153,0.4)]
                    transition-all duration-700 ease-out
                    group-hover:scale-[1.03] group-hover:shadow-[0_30px_80px_rgba(236,72,153,0.5)]
                    animate-scale-in"
                    style={{
                      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                      filter: 'brightness(1.05) contrast(1.02) saturate(1.1)',
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / 25;
                      const rotateY = (centerX - x) / 25;
                      e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                    }}>
                    <img 
                      src={kaiPremiumPortrait} 
                      alt="Kai, your AI relationship coach" 
                      className="w-full h-full object-cover object-center" 
                    />
                    
                    {/* Premium Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-70 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* Floating Premium CTA */}
                  <div className="mt-10 flex justify-center animate-fade-in" style={{
                    animationDelay: '1.2s'
                  }}>
                    <div className="relative group/btn inline-block cursor-pointer" onClick={handleTalkToKai}>
                      {/* Multi-layer Glow */}
                      <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 rounded-full opacity-50 blur-3xl group-hover/btn:opacity-80 transition-all duration-500" />
                      <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-coral-400 to-orange-400 rounded-full opacity-40 blur-xl group-hover/btn:blur-2xl transition-all duration-500" />
                      
                      <Button className="relative h-auto px-10 py-5 rounded-full overflow-hidden
                        bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 
                        hover:from-pink-400 hover:via-coral-400 hover:to-orange-400 
                        text-white font-space font-semibold text-lg tracking-wide
                        border-2 border-white/40 backdrop-blur-md
                        shadow-[0_0_50px_rgba(236,72,153,0.5),0_10px_40px_rgba(251,146,60,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]
                        transition-all duration-500 transform hover:scale-110 group-hover/btn:shadow-[0_0_70px_rgba(236,72,153,0.7),0_15px_60px_rgba(251,146,60,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)]">
                        {/* Ripple Effect */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700">
                          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                        </div>
                        
                        {/* Shimmer Sweep */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 animate-shimmer" style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                            backgroundSize: '200% 100%'
                          }} />
                        </div>
                        
                        <span className="relative z-10 flex items-center gap-3">
                          <Sparkles className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-500" />
                          Begin Your Journey
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bento Grid Content (8 columns) */}
              <div className="lg:col-span-8 animate-fade-in" style={{
                animationDelay: '0.8s'
              }}>
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                  
                  {/* Large Card - Spans 2 columns on desktop */}
                  <div className="md:col-span-2 p-6 md:p-8 lg:p-10 rounded-3xl 
                    backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/8
                    border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]
                    hover:bg-gradient-to-br hover:from-white/15 hover:via-white/8 hover:to-white/12 hover:border-white/30
                    transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.25)]
                    group/card">
                    <p className="font-inter text-lg md:text-xl lg:text-2xl text-white leading-relaxed tracking-wide">
                      <span className="font-medium">built for the way we love:</span><br />
                      voice notes, time zones, shared playlists, hard truths,<br />
                      screenshots sent for advice, and the quiet bravery to keep trying.
                    </p>
                  </div>
                  
                  {/* Medium Card 1 */}
                  <div className="p-6 md:p-7 lg:p-8 rounded-3xl text-center
                    backdrop-blur-xl bg-gradient-to-br from-pink-500/12 via-coral-500/8 to-orange-500/12
                    border border-pink-300/25 shadow-[0_8px_32px_rgba(236,72,153,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]
                    hover:from-pink-500/18 hover:via-coral-500/12 hover:to-orange-500/18 hover:border-pink-300/35
                    transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.3)]
                    group/card">
                    <p className="font-space text-lg md:text-xl lg:text-2xl text-white font-semibold leading-relaxed tracking-wide">
                      rooted in research.<br />
                      powered by empathy.<br />
                      <span className="bg-gradient-to-r from-pink-200 to-orange-200 bg-clip-text text-transparent">made for the real.</span>
                    </p>
                  </div>
                  
                  {/* Medium Card 2 - Feature Pills */}
                  <div className="p-6 md:p-7 lg:p-8 rounded-3xl
                    backdrop-blur-xl bg-gradient-to-br from-white/8 via-white/4 to-white/8
                    border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]
                    hover:bg-gradient-to-br hover:from-white/12 hover:via-white/6 hover:to-white/12 hover:border-white/25
                    transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.2)]">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {/* Premium Feature Badges with Lucide Icons */}
                      <div className="group/pill px-4 py-2.5 rounded-full backdrop-blur-lg
                        bg-gradient-to-r from-orange-400/20 to-orange-400/10
                        border border-orange-300/40 hover:border-orange-300/60
                        shadow-[0_4px_20px_rgba(251,146,60,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                        hover:shadow-[0_6px_28px_rgba(251,146,60,0.3)]
                        transition-all duration-500 hover:-translate-y-1 hover:scale-105">
                        <span className="flex items-center gap-2 text-sm font-inter font-medium text-white tracking-wide">
                          <Heart className="w-4 h-4" />
                          inclusive for all
                        </span>
                      </div>
                      
                      <div className="group/pill px-4 py-2.5 rounded-full backdrop-blur-lg
                        bg-gradient-to-r from-coral-400/20 to-coral-400/10
                        border border-coral-300/40 hover:border-coral-300/60
                        shadow-[0_4px_20px_rgba(251,113,133,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                        hover:shadow-[0_6px_28px_rgba(251,113,133,0.3)]
                        transition-all duration-500 hover:-translate-y-1 hover:scale-105">
                        <span className="flex items-center gap-2 text-sm font-inter font-medium text-white tracking-wide">
                          <Brain className="w-4 h-4" />
                          evidence-based
                        </span>
                      </div>
                      
                      <div className="group/pill px-4 py-2.5 rounded-full backdrop-blur-lg
                        bg-gradient-to-r from-pink-400/20 to-pink-400/10
                        border border-pink-300/40 hover:border-pink-300/60
                        shadow-[0_4px_20px_rgba(236,72,153,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                        hover:shadow-[0_6px_28px_rgba(236,72,153,0.3)]
                        transition-all duration-500 hover:-translate-y-1 hover:scale-105">
                        <span className="flex items-center gap-2 text-sm font-inter font-medium text-white tracking-wide">
                          <Lock className="w-4 h-4" />
                          private by design
                        </span>
                      </div>
                      
                      <div className="group/pill px-4 py-2.5 rounded-full backdrop-blur-lg
                        bg-gradient-to-r from-pink-400/20 to-pink-400/10
                        border border-pink-300/40 hover:border-pink-300/60
                        shadow-[0_4px_20px_rgba(236,72,153,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                        hover:shadow-[0_6px_28px_rgba(236,72,153,0.3)]
                        transition-all duration-500 hover:-translate-y-1 hover:scale-105">
                        <span className="flex items-center gap-2 text-sm font-inter font-medium text-white tracking-wide">
                          <MessageCircle className="w-4 h-4" />
                          available 24/7
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medium Card 3 */}
                  <div className="p-6 md:p-7 lg:p-8 rounded-3xl
                    backdrop-blur-xl bg-gradient-to-br from-white/8 via-white/4 to-white/8
                    border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]
                    hover:bg-gradient-to-br hover:from-white/12 hover:via-white/6 hover:to-white/12 hover:border-white/25
                    transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.2)]">
                    <p className="font-inter text-base md:text-lg text-white leading-relaxed tracking-wide">
                      kai helps you understand yourself and show up with heart for the people who matter and the moments that can't wait.
                    </p>
                  </div>
                  
                  {/* Medium Card 4 - Emphasized */}
                  <div className="p-6 md:p-7 lg:p-8 rounded-3xl text-center
                    backdrop-blur-xl bg-gradient-to-br from-pink-500/12 via-coral-500/8 to-orange-500/12
                    border border-pink-300/25 shadow-[0_8px_32px_rgba(236,72,153,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]
                    hover:from-pink-500/18 hover:via-coral-500/12 hover:to-orange-500/18 hover:border-pink-300/35
                    transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(236,72,153,0.3)]">
                    <p className="font-space text-lg md:text-xl text-white font-semibold leading-relaxed tracking-wide">
                      love is work.<br />
                      <span className="bg-gradient-to-r from-pink-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
                        kai helps you do it well.
                      </span><br />
                      one honest chat at a time.
                    </p>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Mobile CTA - Shows only on mobile */}
          <div className="lg:hidden mt-12 flex justify-center animate-fade-in" style={{
            animationDelay: '1.4s'
          }}>
            <div className="relative group/btn inline-block cursor-pointer" onClick={handleTalkToKai}>
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 rounded-full opacity-50 blur-3xl group-hover/btn:opacity-80 transition-all duration-500" />
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-coral-400 to-orange-400 rounded-full opacity-40 blur-xl group-hover/btn:blur-2xl transition-all duration-500" />
              
              <Button className="relative h-auto px-10 py-5 rounded-full overflow-hidden
                bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 
                hover:from-pink-400 hover:via-coral-400 hover:to-orange-400 
                text-white font-space font-semibold text-lg tracking-wide
                border-2 border-white/40 backdrop-blur-md
                shadow-[0_0_50px_rgba(236,72,153,0.5),0_10px_40px_rgba(251,146,60,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]
                transition-all duration-500 transform active:scale-95 group-hover/btn:shadow-[0_0_70px_rgba(236,72,153,0.7),0_15px_60px_rgba(251,146,60,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)]">
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Begin Your Journey
                </span>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Why It's Different Section - Vertical Timeline */}
      <section className="py-3 md:py-5 relative overflow-hidden">
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Headline with Gradient */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-brand mb-4 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider" style={{
              textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
            }}>
              why we're different
            </h2>
            <p className="text-lg md:text-xl text-white/95 font-light tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              
            </p>
          </div>
          
          {/* Timeline */}
          <Timeline stops={[{
            title: "real talk only",
            subtitle: "real talk for real struggles—support without the sugarcoat. (because \"good vibes only\" is a lie)",
            icon: <HeartSupportIcon />
          }, {
            title: "queer- and trauma-informed",
            subtitle: "for every identity and story—no binaries, no filters. (built for how real people love)",
            icon: <InclusiveIcon />
          }, {
            title: "built for busy",
            subtitle: "quick moves that actually shift your relationship, even on a slammed day. (zero fluff, just action)",
            icon: <ClockIcon />
          }, {
            title: "tough talks welcome",
            subtitle: "we don't erase conflict—we show you how to use it to grow stronger. (healthy fights > silent scrolling)",
            icon: <ConversationIcon />
          }, {
            title: "private by design",
            subtitle: "your convos stay yours—always encrypted, never sold. (kai listens, big tech doesn't)",
            icon: <ShieldIcon />
          }]} />

          {/* Closer Starts Here CTA */}
          <div className="mt-12 md:mt-16 text-center">
            <Link to="/signup">
              <div className="relative group inline-block">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                
                <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl" style={{
                  boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}>
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 animate-shimmer" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }} />
                  </div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                    find clarity, not chaos
                  </span>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HowItWorksSwipe Section - Standalone */}
      <section className="pt-4 pb-3 md:pt-8 md:pb-6 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <HowItWorksSwipe />
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
      
    </div>
  </>;
};
export default LandingPage;