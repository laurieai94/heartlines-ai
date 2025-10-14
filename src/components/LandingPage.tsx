import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, User, Home, CreditCard, Settings, UserPlus, MessageCircleHeart, CircleSlash, Bolt, Shield } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND } from "@/branding";
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
          <h3 className="text-xl md:text-2xl font-playfair text-white leading-tight font-light
            group-hover:text-pink-100 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <div className="relative z-10">
          <p className="text-pink-200/95 sm:text-pink-200/90 text-base md:text-lg leading-relaxed mt-4 font-light
            group-hover:text-white transition-colors duration-300">
            {description}
          </p>
          {secondaryText && (
            <p className="text-pink-200/70 sm:text-pink-200/60 text-sm md:text-base leading-relaxed mt-2 font-light italic
              group-hover:text-white/70 transition-colors duration-300">
              {secondaryText}
            </p>
          )}
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
  const { scrollY } = useScrollDirection();

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
      <div className="heartlines-logo-fixed fixed top-12 right-6 md:right-12 xl:right-14 z-[60] pointer-events-none isolate">
        <img 
          src={heartlinesLogo} 
          alt="heartlines" 
          className="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 drop-shadow-lg"
        />
      </div>

      {/* Navigation - Outside main container for proper fixed positioning */}
      {showMarketingTopBar ? <nav className={`pl-4 pr-2 sm:px-6 xl:px-8 py-3 fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 border-b border-coral-400/20 transition-all duration-300 ${scrollY > 50 ? 'backdrop-blur-2xl shadow-2xl shadow-burgundy-950/50' : 'backdrop-blur-xl shadow-lg'}`}>
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="text-white/50 hover:text-white/80 bg-transparent hover:bg-transparent border-0 p-0 transition-all duration-200" aria-label="Open menu">
                    <FlipPhoneIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 xl:h-14 xl:w-14" />
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
                      <User className="h-5 w-5" style={{ color: '#ffc0cb' }} />
                    </Button>
                  </Link>
                  <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button 
                      className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white p-3 md:p-4 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300"
                      style={{
                        boxShadow: '0 0 40px rgba(255, 107, 157, 0.45), 0 6px 24px rgba(255, 107, 157, 0.55), 0 3px 12px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                      }}
                    >
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                          className="absolute inset-0 animate-shimmer"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            backgroundSize: '200% 100%'
                          }}
                        />
                      </div>
                      
                      <MessageSquare className="relative z-10 w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                  </div>
                </> : <>
                  <Link to="/signin">
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-burgundy-400/10 transition-all duration-200">
                      <User className="h-5 w-5" style={{ color: '#ffc0cb' }} />
                    </Button>
                  </Link>
                  <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button 
                      className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white p-3 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300"
                      style={{
                        boxShadow: '0 0 40px rgba(255, 107, 157, 0.45), 0 6px 24px rgba(255, 107, 157, 0.55), 0 3px 12px rgba(255, 138, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                      }}
                    >
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                          className="absolute inset-0 animate-shimmer"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            backgroundSize: '200% 100%'
                          }}
                        />
                      </div>
                      
                      <MessageSquare className="relative z-10 w-5 h-5" />
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-md group-hover:opacity-100 transition-opacity duration-300" />
              
              <Button 
                className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white font-medium text-xs px-3 py-1.5 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: '0 0 30px rgba(255, 107, 157, 0.4), 0 4px 16px rgba(255, 107, 157, 0.5), 0 2px 8px rgba(255, 138, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div 
                    className="absolute inset-0 animate-shimmer"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                </div>
                
                <span className="relative z-10 flex items-center gap-2">
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
              </div>
            </div>
          </div>
        </nav> : <SimpleHeader user={user} activeTab="home" onSignInClick={() => navigate('/signin')} />}

      {/* Main container */}
      <div className="min-h-screen relative overflow-x-hidden landing-page-scroll bg-burgundy-900">
      {/* Static background preserved */}

      {/* Code-like Background Elements */}
      {!isEmbedded && <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 left-10 font-mono text-xs text-pink-200">
            {`const love = { understanding: true, growth: infinite }`}
          </div>
          <div className="absolute top-1/3 right-20 font-mono text-xs text-coral-200">
            {`if (relationship.status === 'complicated') { ai.help() }`}
          </div>
          <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-pink-200">
            {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>}

      {/* Full-Bleed Hero Carousel */}
      <HeroCarousel />

      {/* Hero Section - Locked layout with flame background */}
      <section className="relative overflow-hidden" style={{
      minHeight: 'clamp(50vh, 65vh, 85vh)'
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
                  <div className="text-left w-full self-center md:pt-0 px-4 sm:px-6 lg:px-8 xl:px-0 mt-8 md:mt-0 md:max-w-[90%] lg:max-w-[85%] xl:max-w-[85%] 2xl:max-w-[90%] md:pr-4 lg:pr-6 xl:pr-8">
                    <div className="space-y-2 mb-1 md:mb-6">
                      <h1 className="font-playfair font-normal leading-tight animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm overflow-visible" style={{
                        fontSize: 'clamp(2.25rem, 4vw, 3.75rem)'
                      }}>
                        Relationships <span className="whitespace-nowrap">aren't rom-coms.</span>
                      </h1>
                      
                      <h3 className="font-playfair font-normal leading-tight animate-fade-in text-white/90 md:whitespace-nowrap max-w-full" style={{
                        fontSize: 'clamp(1rem, 3.5vw, 2.25rem)',
                        animationDelay: '0.2s'
                      }}>
                        <span className="font-brand">heartlines</span> helps you connect.
                      </h3>
                    </div>

                    
                    <div className="hidden md:flex items-center gap-4">
                      {user ? <>
                <div onClick={handleTalkToKai} className="relative group inline-block cursor-pointer">
                  <div className="relative group inline-block">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Button 
                      size="lg"
                      className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-4 text-base lg:text-lg xl:text-xl rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-500 transform hover:scale-105 font-light animate-fade-in"
                      style={{
                        boxShadow: '0 0 50px rgba(255, 107, 157, 0.5), 0 8px 28px rgba(255, 107, 157, 0.55), 0 4px 14px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                      }}
                    >
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                          className="absolute inset-0 animate-shimmer"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            backgroundSize: '200% 100%'
                          }}
                        />
                      </div>
                      
                      <span className="relative z-10 flex items-center">
                        Let's get real
                        <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
                        </> : <>
                          <div onClick={handleTalkToKai} className="cursor-pointer">
                            <Button size="lg" variant="glass" className="p-4 md:p-5 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                              <MessageSquare className="w-5 h-5 md:w-7 md:h-7" />
                            </Button>
                          </div>
                        </>}
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
                        Modern love is messy.
                      </span>
                    </h1>
                    
                    <h3 className="md:leading-[1.25] md:pb-[0.1em] font-playfair font-normal leading-tight animate-fade-in text-white/90 whitespace-nowrap" style={{
                  fontSize: 'clamp(0.65rem, 4vw, 2.75rem)',
                  animationDelay: '0.8s'
                }}>
                      <span className="font-brand">heartlines</span> helps you connect.
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? <>
                        <Button onClick={handleTalkToKai} variant="outline" className="border-burgundy-400/30 text-white hover:bg-burgundy-400/10 px-8 py-4 text-base rounded-full transition-all duration-300 animate-fade-in cursor-pointer">
                          <User className="w-5 h-5 mr-2" />
                          View Profile
                        </Button>
                        <Button onClick={handleTalkToKai} className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 py-4 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm animate-fade-in cursor-pointer">
                          Open Dashboard
                          <ArrowRight className="w-5 h-5 ml-3" />
                        </Button>
                      </> : <>
                        <Button onClick={handleTalkToKai} size="lg" variant="glass" className="p-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in cursor-pointer">
                          <MessageSquare className="w-5 h-5" />
                        </Button>
                      </>}
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
      <section id="how-it-works" className="pt-12 pb-8 md:pt-16 md:pb-16 relative overflow-hidden bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900">
        {/* Background Ambient Orbs with Vibrant Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/15 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/15 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
          <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-400/10 to-orange-400/15 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '2s'
        }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-4 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-6xl font-brand mb-4 bg-gradient-to-r from-pink-400 via-coral-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">How It Works</h2>
            
          </div>
          
          {/* 4-Step Cards */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {[{
              step: "01",
              title: "Build Your Profile",
              description: "Show how you really vibe—calm, stressed, or full chaos.",
              secondaryText: "(No fake bios here.)",
              icon: <UserPlus className="w-5 h-5" />,
              iconName: "user-plus"
            }, {
              step: "02",
              title: "Add Your Person",
              description: "Bring them in too, so Kai sees the full picture.",
              secondaryText: "(Every story has two (+) main characters)",
              icon: <Heart className="w-5 h-5" />,
              iconName: "heart"
            }, {
              step: "03",
              title: "Chat with Kai",
              description: "Spill it, vent it, practice it—then get advice that actually slaps.",
              secondaryText: "(Less textbook therapy, more real talk)",
              icon: <MessageCircleHeart className="w-5 h-5" />,
              iconName: "message-heart"
            }, {
              step: "04",
              title: "Try It IRL",
              description: "Test it out in the wild—less fights, more feels.",
              secondaryText: "(Because the magic happens offline)",
              icon: <Sparkles className="w-5 h-5" />,
              iconName: "sparkles"
            }].map((item, index) => <StepCard key={index} step={item.step} title={item.title} description={item.description} secondaryText={item.secondaryText} icon={item.icon} iconName={item.iconName} index={index} />)}
            </div>

            {/* Get Started CTA */}
            <div className="mt-12 md:mt-16 text-center">
              <div className="relative group inline-block cursor-pointer" onClick={handleTalkToKai}>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                
                <Button 
                  className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl"
                  style={{
                    boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div 
                      className="absolute inset-0 animate-shimmer"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  </div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 md:w-6 md:w-6" />
                    Talk it out with Kai
                  </span>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why It's Different Section - Vertical Timeline */}
      <section className="py-6 md:py-8 relative overflow-hidden bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900">
        {/* Enhanced Background Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main center glow with pink-to-orange gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 via-orange-400/15 to-coral-400/20 rounded-full blur-3xl" />
          
          {/* Top left accent */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{
          animationDuration: '4s'
        }} />
          
          {/* Bottom right accent */}
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-400/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{
          animationDuration: '5s',
          animationDelay: '1s'
        }} />
          
          {/* Floating accent orbs */}
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-coral-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse" style={{
          animationDuration: '3s',
          animationDelay: '2s'
        }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Headline with Gradient */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-6xl font-brand mb-4 bg-gradient-to-r from-pink-400 via-coral-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
              Why We're Different
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-light">
              
            </p>
          </div>
          
          {/* Timeline */}
          <Timeline stops={[
            {
              title: "Real talk only",
              subtitle: "Real talk for real struggles—support without the sugarcoat. (Because \"good vibes only\" is a lie)",
              icon: <HeartSupportIcon />
            },
            {
              title: "Queer- and trauma-informed",
              subtitle: "For every identity and story—no binaries, no filters. (Built for how real people love)",
              icon: <InclusiveIcon />
            },
            {
              title: "Built for busy",
              subtitle: "Quick moves that actually shift your relationship, even on a slammed day. (Zero fluff, just action)",
              icon: <ClockIcon />
            },
            {
              title: "Tough talks welcome",
              subtitle: "We don't erase conflict—we show you how to use it to grow stronger. (Healthy fights > silent scrolling)",
              icon: <ConversationIcon />
            },
            {
              title: "Private by design",
              subtitle: "Your convos stay yours—always encrypted, never sold. (Kai listens, Big Tech doesn't)",
              icon: <ShieldIcon />
            }
          ]} />

          {/* Closer Starts Here CTA */}
          <div className="mt-12 md:mt-16 text-center">
            <Link to="/signup">
              <div className="relative group inline-block">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                
                <Button 
                  className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl"
                  style={{
                    boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div 
                      className="absolute inset-0 animate-shimmer"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  </div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                    Find clarity, not chaos
                  </span>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HowItWorksSwipe Section - Standalone */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900">
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