import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, User, Home, CreditCard, Settings, UserPlus, MessageCircleHeart, CircleSlash, Bolt, Shield, Lock, LogOut } from "lucide-react";
import FlipPhoneIcon from "./icons/FlipPhoneIcon";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND } from "@/branding";
import BrandMark from "./BrandMark";
import HeartlinesWordmark from "./brand/HeartlinesWordmark";
import ProductPhoneDemo from "./ProductPhoneDemo";
import HeroPhoneScroll from "./HeroPhoneScroll";
import FlameDivider from "./FlameDivider";
import { useGlobalResize } from '@/hooks/useGlobalResize';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import SiteFooter from "./SiteFooter";
import HowItWorksSwipe from "./HowItWorksSwipe";

import HeroCarousel from "./HeroCarousel";
import { Timeline, PersonalIcon, InclusiveIcon, ShieldIcon, HeartSupportIcon, ClockIcon, ConversationIcon, CommunityIcon } from "./ui/timeline";
import elderlyCoupleCouch from "@/assets/elderly-couple-couch.jpg";
import SimpleHeader from "./SimpleHeader";
import heartlinesLogo from "@/assets/heartlines-logo-white.svg";
import PremiumBackground from "./PremiumBackground";
import ScrollReveal from "./ScrollReveal";

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
        bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70
        border border-pink-400/30
        hover:-translate-y-2 hover:scale-105 hover:rotate-1
        hover:bg-gradient-to-br hover:from-burgundy-800/95 hover:via-burgundy-700/85 hover:to-pink-900/75
        hover:shadow-2xl hover:shadow-pink-500/20
        transition-all duration-500 ease-out
      ">
        
        {/* Simple Step Indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full 
            bg-gradient-to-br from-pink-500 via-coral-500 to-rose-600
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
          <div className="inline-flex h-8 group-hover:scale-110 transition-all duration-300">
            <div className="w-8 h-8 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-orange-300 to-pink-400">
              {icon}
            </div>
          </div>
          
          {/* Clean Title */}
          <h3 className="text-xl md:text-2xl font-playfair text-white leading-tight font-light tracking-wide
            min-h-[3.5rem] md:min-h-[4rem] flex items-end
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
            group-hover:text-pink-100 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <div className="relative z-10 flex flex-col flex-1">
          <p className="text-pink-50/95 text-base md:text-lg leading-relaxed mt-4 font-light tracking-wide flex-1
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]
            group-hover:text-white transition-colors duration-300">
            {description}
          </p>
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
    user,
    signOut
  } = useAuth();
  const [isSplashActive, setIsSplashActive] = useState(() => {
    return !sessionStorage.getItem('homepage_visited');
  });
  const navigate = useNavigate();
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleTalkToKai = () => {
    if (user) {
      navigate('/coach');
    } else {
      navigate('/signup');
    }
  };
  const [currentProfile, setCurrentProfile] = useState(0);
  const {
    scrollY
  } = useScrollDirection();

  const isEmbedded = !showMarketingTopBar;

  // Glass card styling helper
  const glassCard = "rounded-2xl border border-burgundy-500/15 glass-burgundy shadow-md";
  const navItems = [{
    to: '/',
    label: 'home',
    icon: Home
  }, {
    to: '/profile',
    label: 'profile',
    icon: User
  }, {
    to: '/coach',
    label: 'coach',
    icon: MessageSquare
  }, {
    to: '/account',
    label: 'my account',
    icon: Settings
  }, {
    to: '/plans',
    label: 'plans',
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
      <Helmet>
        <title>heartlines — ai relationship coaching for modern love</title>
        <meta name="description" content="heartlines uses ai-powered coaching to help you navigate relationships, improve communication, and build deeper connections. talk to kai, your personal relationship coach." />
        <meta name="keywords" content="ai relationship coach, couples coaching, communication skills, relationship help, heartlines" />
        <meta property="og:title" content="heartlines — ai relationship coaching for modern love" />
        <meta property="og:description" content="talk to kai, your ai relationship coach. improve communication, navigate conflict, and build deeper connections." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heartlines-ai.lovable.app" />
        <link rel="canonical" href="https://heartlines-ai.lovable.app" />
      </Helmet>
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
              {/* Mobile Navigation Drawer */}
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button 
                    variant="ghost" 
                    className="h-auto text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                  >
                    <FlipPhoneIcon className="h-10 w-10 sm:h-11 sm:w-11" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  hideClose={true}
                  className="w-20 bg-burgundy-800/95 backdrop-blur-xl border-r border-coral-400/20 rounded-r-3xl p-0"
                >
                  <nav className="flex flex-col items-center gap-2 py-6 h-full">
                    {/* Flip Phone Icon at Top */}
                    <div className="mb-4">
                      <FlipPhoneIcon className="h-10 w-10 text-white" />
                    </div>
                    
                    <div className="h-px w-12 bg-white/10 mb-2" />
                    
                    {/* Navigation Icons */}
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center w-12 h-12 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                      >
                        <item.icon className="w-6 h-6" strokeWidth={2} />
                      </Link>
                    ))}
                    
                    {user && (
                      <>
                        <div className="h-px w-12 bg-white/10 my-2 mt-auto" />
                        <button
                          onClick={async () => {
                            setIsDrawerOpen(false);
                            await signOut();
                          }}
                          className="flex items-center justify-center w-12 h-12 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all duration-200"
                        >
                          <LogOut className="w-6 h-6" strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Desktop Navigation Popover */}
              <Popover>
                <PopoverTrigger asChild className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    className="h-auto text-white hover:text-white bg-transparent hover:bg-transparent border-0 hover:border-0 p-0 transition-all duration-200 [&_svg]:text-white [&_svg]:hover:text-white [&_svg]:drop-shadow-lg [&_svg]:hover:drop-shadow-xl"
                  >
                    <FlipPhoneIcon className="h-12 w-12 lg:h-14 lg:w-14 xl:h-14 xl:w-14" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-2 bg-burgundy-800/95 backdrop-blur-xl border-coral-400/20"
                  align="start"
                  side="bottom"
                  sideOffset={8}
                  collisionPadding={16}
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <nav className="flex flex-col gap-0.5">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center justify-center w-12 h-12 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                        style={{
                          minWidth: '48px',
                          minHeight: '48px'
                        }}
                      >
                        <item.icon className="w-6 h-6" strokeWidth={2} />
                      </Link>
                    ))}
                    
                    {user && (
                      <>
                        <div className="h-px bg-white/10 my-0.5" />
                        <button
                          onClick={async () => {
                            await signOut();
                          }}
                          className="flex items-center justify-center w-12 h-12 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all duration-200"
                          style={{
                            minWidth: '48px',
                            minHeight: '48px'
                          }}
                        >
                          <LogOut className="w-6 h-6" strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </nav>
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
                    <div className="absolute -inset-1 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" style={{
                      background: 'linear-gradient(to right, #FF8A50, #EC4899)'
                    }} />
                    
                    <Button className="relative text-white px-4 md:px-5 lg:px-6 py-2.5 md:py-3 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300" style={{
                      background: 'linear-gradient(to right, #FF8A50, #EC4899)',
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
                    <div className="absolute -inset-1 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" style={{
                      background: 'linear-gradient(to right, #FF8A50, #EC4899)'
                    }} />
                    
                    <Button className="relative text-white px-4 md:px-5 lg:px-6 py-2.5 md:py-3 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300" style={{
                      background: 'linear-gradient(to right, #FF8A50, #EC4899)',
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
              <div className="absolute -inset-0.5 rounded-full opacity-90 blur-md md:group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(to right, #FF8A50, #EC4899)'
              }} />
              
              <Button className="relative text-white font-medium text-xs px-3 py-1.5 rounded-full border border-white/40 backdrop-blur-sm overflow-hidden transition-all duration-200" style={{
                background: 'linear-gradient(to right, #FF8A50, #EC4899)',
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
                  <div className="text-left w-full max-w-xl md:max-w-2xl lg:max-w-3xl self-center md:pt-0 px-4 sm:px-6 lg:px-8 xl:px-0 mt-8 md:mt-0">
                    <div className="space-y-2 mb-1 md:mb-6">
<h1 className="font-playfair font-normal leading-[1.15] tracking-tight animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-coral-300 via-pink-400 to-coral-400 pr-20 md:pr-24 lg:pr-28 xl:pr-32 pb-1 will-change-transform" style={{
  fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(251, 207, 232, 0.15)'
}}>
  relationships <span className="whitespace-nowrap">aren't rom-coms.</span>
</h1>
                      
                      <h3 className="font-playfair font-light leading-[1.25] tracking-wide animate-fade-in text-white/95 whitespace-nowrap max-w-full pr-16 md:pr-20 lg:pr-24 xl:pr-28 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" style={{
                      fontSize: 'clamp(1.125rem, 3vw, 2.5rem)',
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
          <ScrollReveal>
            <div className="text-center mb-3 md:mb-8">
              <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-brand mb-4 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider md:whitespace-nowrap" style={{
                textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
              }}>how it works</h2>
              
            </div>
          </ScrollReveal>
          
          {/* 4-Step Cards */}
          <div className="relative max-w-6xl mx-auto">
            <ScrollReveal delay={150}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {[{
                  step: "01",
                  title: "build your profile",
                  description: "no fake bios, come as you are",
                  icon: <UserPlus className="w-5 h-5" />,
                  iconName: "user-plus"
                }, {
                  step: "02",
                  title: "add your person",
                  description: "every story has two (+) main characters",
                  icon: <Heart className="w-5 h-5" />,
                  iconName: "heart"
                }, {
                  step: "03",
                  title: "chat with kai",
                  description: "less textbook therapy, more real talk",
                  icon: <MessageCircleHeart className="w-5 h-5" />,
                  iconName: "message-heart"
                }, {
                  step: "04",
                  title: "try it irl",
                  description: "because the magic happens offline",
                  icon: <Sparkles className="w-5 h-5" />,
                  iconName: "sparkles"
                }].map((item, index) => <StepCard key={index} step={item.step} title={item.title} description={item.description} icon={item.icon} iconName={item.iconName} index={index} />)}
              </div>
            </ScrollReveal>

            {/* Get Started CTA */}
            <ScrollReveal delay={300}>
              <div className="mt-12 md:mt-16 mb-8 md:mb-16 text-center">
                <div className="relative group inline-block cursor-pointer" onClick={handleTalkToKai}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-coral-400 via-pink-500 to-coral-500 rounded-full opacity-90 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                  <Button className="relative bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-coral-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-lg md:text-xl" style={{
                    boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), 0 8px 32px rgba(255, 107, 157, 0.6), 0 4px 16px rgba(255, 138, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                  }}>
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
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* Meet Kai Section */}
      <section className="py-10 md:py-16 relative overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-start">
              
              <ScrollReveal>
                <div className="relative flex flex-col items-center justify-start order-1">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-brand mb-4 md:mb-6 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider text-center" style={{
                    textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
                  }}>
                    meet kai
                  </h2>
                  
                  <h3 className="text-xl md:text-2xl text-white/95 font-light mb-8 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] text-center">
                    your ai relationship coach
                  </h3>
                  
                  <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-to-r from-pink-500/25 via-coral-400/15 to-orange-400/25 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute -inset-4 bg-gradient-to-br from-pink-400/40 to-coral-500/40 rounded-full blur-2xl"></div>
                    <div className="relative w-[200px] h-[200px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden ring-4 ring-white/20">
                      <img src={BRAND.coach.avatarSrc} alt="Kai, your AI relationship coach" className="w-full h-full object-cover scale-125 object-[center_20%]" loading="eager" fetchPriority="high" decoding="async" />
                    </div>
                    
                    <div className="hidden md:flex md:justify-center md:mt-6">
                      <div className="relative group inline-block cursor-pointer" onClick={handleTalkToKai}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 rounded-full opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                        <Button className="relative bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 hover:from-pink-400 hover:via-coral-400 hover:to-orange-400 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm overflow-hidden font-light text-base" style={{
                          boxShadow: '0 0 40px rgba(236, 72, 153, 0.4), 0 8px 32px rgba(251, 146, 60, 0.5)'
                        }}>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0" style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 2s infinite'
                            }} />
                          </div>
                          <span className="relative z-10 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            chat now
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>



              <ScrollReveal delay={200}>
                <div className="order-2 text-center md:text-left flex flex-col">
                  <div className="space-y-6 mb-10 max-w-xl mx-auto md:mx-0">
                    <p className="text-base md:text-lg lg:text-xl text-pink-50/95 leading-relaxed tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                      built for the way we love:<br />
                      voice notes, time zones,<br />
                      shared playlists, hard truths,<br />
                      screenshots sent for advice,<br />
                      and the quiet bravery to keep trying.
                    </p>
                    <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                      rooted in research. powered by empathy.<br />
                      made for the real.
                    </p>
                    <p className="text-base md:text-lg lg:text-xl text-pink-50/95 leading-relaxed tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                      kai helps you understand yourself<br />
                      and show up with heart<br />
                      for the people who matter<br />
                      and the moments that can't wait.
                    </p>
                    <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                      love is work.<br />
                      kai helps you do it well.<br />
                      one honest chat at a time.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2.5 md:gap-3 mb-8">
                    <div className="px-5 py-2.5 rounded-full bg-orange-400/20 border-2 border-orange-400/30 backdrop-blur-sm transition-all duration-300 hover:bg-orange-400/30 hover:shadow-lg hover:-translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                      <span className="text-sm font-medium tracking-wide text-white">🌈 inclusive for all</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-coral-400/20 border-2 border-coral-400/30 backdrop-blur-sm transition-all duration-300 hover:bg-coral-400/30 hover:shadow-lg hover:-translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                      <span className="text-sm font-medium tracking-wide text-white">🧠 evidence-based care</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-pink-400/20 border-2 border-pink-400/30 backdrop-blur-sm transition-all duration-300 hover:bg-pink-400/30 hover:shadow-lg hover:-translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                      <span className="text-sm font-medium tracking-wide text-white">🔒 private, always</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-pink-400/20 border-2 border-pink-400/30 backdrop-blur-sm transition-all duration-300 hover:bg-pink-400/30 hover:shadow-lg hover:-translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                      <span className="text-sm font-medium tracking-wide text-white">💗 trauma-aware</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-coral-400/20 border-2 border-coral-400/30 backdrop-blur-sm transition-all duration-300 hover:bg-coral-400/30 hover:shadow-lg hover:-translate-y-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                      <span className="text-sm font-medium tracking-wide text-white">⏱ instant support</span>
                    </div>
                  </div>
                  
                  <div className="flex md:hidden justify-center">
                    <div className="relative group inline-block cursor-pointer" onClick={handleTalkToKai}>
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 rounded-full opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300" />
                      <Button className="relative bg-gradient-to-r from-pink-500 via-coral-500 to-orange-500 hover:from-pink-400 hover:via-coral-400 hover:to-orange-400 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-white/40 backdrop-blur-sm font-light text-base">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        chat now
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Different Section - Vertical Timeline */}
      <section className="py-3 md:py-5 relative overflow-hidden">
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-brand mb-4 bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent tracking-wider" style={{
                textShadow: '0 2px 10px rgba(236, 72, 153, 0.4), 0 4px 16px rgba(251, 146, 60, 0.3)'
              }}>
                why we're different
              </h2>
              <p className="text-lg md:text-xl text-white/95 font-light tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={150}>
            <Timeline stops={[{
              title: "conflict-ready",
              subtitle: "healthy tension > silent scrolling.",
              icon: <ConversationIcon />
            }, {
              title: "for actual humans",
              subtitle: "every identity, every story, no binaries.",
              icon: <InclusiveIcon />
            }, {
              title: "private, always",
              subtitle: "encrypted, never sold—your heartbreak isn't a dataset.",
              icon: <ShieldIcon />
            }, {
              title: "made for right now",
              subtitle: "your relationship won't wait for your calendar to clear.",
              icon: <ClockIcon />
            }, {
              title: "no fake positivity",
              subtitle: "\"good vibes only\" never fixed a fight.",
              icon: <HeartSupportIcon />
            }, {
              title: "context-aware",
              subtitle: "advice that knows the lore, no recaps needed.",
              icon: <PersonalIcon />
            }, {
              title: "built to give back",
              subtitle: "revenue funds community tools, not investor decks.",
              icon: <CommunityIcon />
            }]} />
          </ScrollReveal>

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
          <ScrollReveal>
            <HowItWorksSwipe />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
      
    </div>
  </>;
};
export default LandingPage;