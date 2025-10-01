import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, Menu, User, Home, CreditCard, Settings, UserPlus, MessageCircleHeart, CircleSlash, Bolt, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND } from "@/branding";
import BrandMark from "./BrandMark";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import ProductPhoneDemo from "./ProductPhoneDemo";
import HeroPhoneScroll from "./HeroPhoneScroll";
import FlameDivider from "./FlameDivider";
import { useGlobalResize } from '@/hooks/useGlobalResize';
import SiteFooter from "./SiteFooter";

import HowItWorksSwipe from "./HowItWorksSwipe";
import FrostedHeartShowcase from "./FrostedHeartShowcase";
import PhotoSplitBanner from "./PhotoSplitBanner";
import coupleConnection from "@/assets/couple-connection.jpg";
import elderlyCoupleCouch from "@/assets/elderly-couple-couch.jpg";

// Premium StepCard Component with Glass Effects and Micro-animations
  const StepCard = ({
    step,
    title,
    description,
    icon,
    iconName,
    index
  }: {
    step: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconName: string;
    index: number;
  }) => {
    const [displayStep, setDisplayStep] = useState(step); // Start with final value to avoid animation delay
    return <article className={`
          relative group cursor-pointer
          w-full max-w-md mx-auto md:max-w-none
          mb-3 md:mb-0 h-full
          motion-safe:animate-fade-in
          focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none
          ${index === 0 ? 'motion-safe:animation-delay-0' : ''}
          ${index === 1 ? 'motion-safe:animation-delay-100' : ''}
          ${index === 2 ? 'motion-safe:animation-delay-200' : ''}
        `} style={{
      animationDelay: '0ms', // Remove staggered delays
      animationFillMode: 'both'
    }} tabIndex={0} role="article" aria-label={title}>
        {/* Premium Glass Card with Enhanced Effects */}
        <div className="
          relative overflow-hidden h-full flex flex-col
          rounded-2xl glass-burgundy shadow-xl
          p-4 md:p-6 min-h-[200px]
          motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out
          motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-2xl
          motion-safe:hover:shadow-coral-400/20
          motion-reduce:transform-none motion-reduce:transition-none
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
          before:from-coral-400/5 before:via-transparent before:to-pink-400/5
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
        ">
        {/* Inner Highlight Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 via-white/3 to-transparent opacity-60"></div>
        
        {/* Edge Light - Inner Border */}
        <div className="absolute inset-px rounded-2xl border border-white/8"></div>

        {/* Ghosted Artsy Background Number - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="
            absolute -top-4 -right-6
            text-[180px] md:text-[200px] font-black 
            text-white/5 leading-none select-none
            num-ghost animate-float-slow
          ">
            {displayStep}
          </div>
        </div>


        {/* Content Container */}
        <div className="relative z-10 text-center pt-3 md:pt-8 flex-1 flex flex-col justify-between">
          <div>
            {/* Icon */}
            <div className="mb-2 md:mb-4 flex justify-center">
              <div className="
                relative w-8 h-8 md:w-12 md:h-12 
                glass-burgundy border-2 border-burgundy-400/40 
                rounded-full flex items-center justify-center
                text-coral-300
                motion-safe:transition-all motion-safe:duration-200
                group-hover:scale-105 group-hover:-translate-y-0.5
                group-hover:text-pink-300 group-hover:bg-burgundy-300/35
                group-hover:border-coral-400/60
              " aria-label={`${iconName} icon`}>
                <div className="scale-75 md:scale-100">
                  {icon}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <h3 className="text-base md:text-lg font-semibold text-white/95 mb-1 md:mb-2 leading-tight md:leading-7">
              {title}
            </h3>
          </div>
          
          <p className="text-sm md:text-base text-white/75 leading-relaxed mt-1.5">
            {description}
          </p>
        </div>

        {/* Subtle Sheen Effect on Hover */}
        <div className="
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-transparent via-white/5 to-transparent
          motion-safe:transition-opacity motion-safe:duration-500
          pointer-events-none
        "></div>
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
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        }, { timeout: 2000 });
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
  return <div className="min-h-screen relative overflow-x-hidden bg-burgundy-900">
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

      {/* Navigation */}
      {showMarketingTopBar && <nav className="pl-4 pr-2 sm:px-6 xl:px-8 py-3 sticky top-0 z-50 bg-gradient-to-r from-burgundy-900/95 via-burgundy-800/90 to-burgundy-900/95 backdrop-blur-md border-b border-coral-400/15">
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto flex justify-between items-center">
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
                  className="w-16 p-2 bg-burgundy-800/95 backdrop-blur-md border border-coral-400/20 shadow-xl rounded-xl z-50"
                  onInteractOutside={() => setIsMenuOpen(false)}
                  onEscapeKeyDown={() => setIsMenuOpen(false)}
                >
                  <div className="flex flex-col">
                    {navItems.map(item => (
                      <Link 
                        key={item.to} 
                        to={item.to}
                        title={item.label}
                        className="text-white/70 hover:text-coral-200 hover:bg-burgundy-400/10 transition-all duration-200 p-2.5 font-light rounded-lg backdrop-blur-sm border border-transparent hover:border-coral-400/30 flex items-center justify-center" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Desktop Navigation CTAs */}
            <div className="hidden md:flex items-center gap-3 mr-6">
              {user ? <>
                  <Link to="/profile">
                    <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 transition-all duration-200">
                      <User className="w-4 h-4 mr-2" />
                    Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                    </Button>
                  </Link>
                </> : <>
                  <Link to="/signin">
                    <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 transition-all duration-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </>}
            </div>
            
            {/* Mobile CTA */}
            <div className="md:hidden mr-2">
              <div className="flex items-center gap-2">
                <Link to="/signin">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-burgundy-400/10 font-medium text-xs px-3 py-1.5 transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white font-medium text-xs px-3 py-1.5 rounded-full transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>}

      {/* Hero Section - Locked layout with flame background */}
      <section className="relative overflow-hidden" style={{
      minHeight: '100vh'
    }}>
        {/* Static background preserved */}
        
        {/* Glassmorphic background layers */}
        {!isEmbedded && <>
            {/* Primary hero section with locked two-column layout */}
            <div className="px-4 sm:px-6 xl:px-8 py-2 sm:py-4 xl:py-6">
              {/* Static accent decoration */}
              <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-burgundy-400/10 to-coral-400/10 rounded-full blur-xl backdrop-blur-sm"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-coral-400/15 to-burgundy-400/15 rounded-full blur-xl backdrop-blur-sm"></div>
              
              <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-8xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 xl:gap-16 2xl:gap-20 items-center min-h-[90vh]">
                  {/* Left Column - Hero Copy (Always Left) */}
                  <div className="text-left max-w-2xl self-center pt-8 md:pt-0">
                    <div className="space-y-3 mb-4 md:mb-6">
                      <h1 className="text-3xl sm:text-4xl whitespace-nowrap md:leading-[1.3] md:pb-[0.15em] lg:text-[48px] xl:text-[60px] 2xl:text-[72px] font-playfair font-normal leading-tight animate-fade-in">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                          Modern love is messy.
                        </span>
                      </h1>
                      
                      <h3 className="text-xl sm:text-2xl whitespace-nowrap md:leading-[1.25] md:pb-[0.1em] lg:text-[30px] xl:text-[36px] 2xl:text-[48px] font-playfair font-normal leading-tight animate-fade-in text-white/90">
                        <span className="font-brand">heartlines</span> helps you connect.
                      </h3>
                    </div>

                    
                    <div className="hidden md:flex items-center gap-4">
                      {user ? <>
                          <Link to="/signup">
                            <Button size="lg" variant="glass" className="px-6 py-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                              Get Started
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </Link>
                        </> : <>
                          <Link to="/signup">
                            <Button size="lg" variant="glass" className="px-6 py-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                              Get Started
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </Link>
                        </>}
                    </div>
                  </div>

                  {/* Right Column - Mobile Chat Interface (Always Right, Always Visible Above Fold) */}
                  <div className="relative flex justify-center md:justify-end items-center self-center">
                    <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl md:scale-100 xl:scale-110 2xl:scale-125 scale-95 origin-center relative z-10">
                      <HeroPhoneScroll className="animate-fade-in w-full h-full" />
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
                    <h1 className="text-3xl whitespace-nowrap md:leading-[1.3] md:pb-[0.15em] lg:text-[36px] xl:text-[48px] font-playfair font-normal leading-tight animate-fade-in">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                        Modern love is messy.
                      </span>
                    </h1>
                    
                    <h3 className="text-lg whitespace-nowrap md:leading-[1.25] md:pb-[0.1em] lg:text-[20px] xl:text-[24px] font-playfair font-normal leading-tight animate-fade-in text-white/90" style={{
                  animationDelay: '0.8s'
                }}>
                      <span className="font-brand">heartlines</span> helps you connect.
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? <>
                        <Link to="/profile">
                          <Button variant="outline" className="border-burgundy-400/30 text-white hover:bg-burgundy-400/10 px-8 py-4 text-base rounded-full transition-all duration-300 animate-fade-in">
                            <User className="w-5 h-5 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        <Link to="/profile">
                          <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 py-4 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm animate-fade-in">
                            Open Dashboard
                            <ArrowRight className="w-5 h-5 ml-3" />
                          </Button>
                        </Link>
                      </> : <>
                        <Link to="/signup">
                          <Button size="lg" variant="glass" className="px-8 py-4 text-base rounded-full transition-all duration-500 transform hover:scale-105 font-light animate-fade-in">
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-3" />
                          </Button>
                        </Link>
                      </>}
                  </div>
                </div>

                {/* Right - Chat Animation */}
                <div className="relative flex justify-center">
                  <div className="w-full max-w-md" style={{
                height: 'min(min(52svh, 52dvh), 500px)'
              }}>
                    <HeroPhoneScroll className="animate-fade-in w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </section>

      {/* Full-Bleed Elderly Couple Banner */}
      <div className="mt-24 md:mt-32 lg:mt-40">
        <PhotoSplitBanner 
          imageSrc={elderlyCoupleCouch}
          alt="Elderly couple sitting together on couch, showing lasting love and connection"
          heading="2071"
          align="right"
        />
      </div>

      {/* How It Works Section - Playful 4-Step Flow */}
      <section id="how-it-works" className="py-6 md:py-12 relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-coral-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-peach-400/5 to-coral-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-gradient-to-r from-pink-400/5 to-peach-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-4 md:mb-16">
            <h2 className="text-xl md:text-4xl font-semibold text-white/95 mb-2 md:mb-6">How It Works</h2>
            
          </div>
          
          {/* 4-Step Cards */}
          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/20 to-transparent transform -translate-y-1/2">
              <div className="absolute left-1/4 w-2 h-2 bg-coral-400/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-2/4 w-2 h-2 bg-pink-400/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-3/4 w-2 h-2 bg-coral-400/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {[{
              step: "01",
              title: "Make Your Profile",
              description: "Who you are when you're stressed, happy, or low-key annoyed.",
              icon: <UserPlus className="w-5 h-5" />,
              iconName: "user-plus"
            }, {
              step: "02",
              title: "Add Your Person",
              description: "Their vibe too — so Kai knows both sides of the story.",
              icon: <Heart className="w-5 h-5" />,
              iconName: "heart"
            }, {
              step: "03",
              title: "Chat with Kai",
              description: "Spill the tea. Practice convos. Get real advice.",
              icon: <MessageCircleHeart className="w-5 h-5" />,
              iconName: "message-heart"
            }, {
              step: "04",
              title: "Try the Move IRL",
              description: "Tiny actions → big shifts.",
              icon: <Sparkles className="w-5 h-5" />,
              iconName: "sparkles"
            }].map((item, index) => <StepCard key={index} step={item.step} title={item.title} description={item.description} icon={item.icon} iconName={item.iconName} index={index} />)}
            </div>
          </div>

          {/* Swipeable Cards Section */}
          <div className="mt-16">
            <HowItWorksSwipe />
          </div>
        </div>
      </section>

      {/* Why It's Different Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-4xl font-semibold text-white/95 mb-2 md:mb-6">Why It's Different</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 max-w-4xl mx-auto">
            {[{
            title: "No toxic positivity — conflict happens, we help.",
            icon: <CircleSlash className="w-6 h-6" aria-hidden="true" />
          }, {
            title: "Actually personal — not horoscope-generic.",
            icon: <Sparkles className="w-6 h-6" aria-hidden="true" />
          }, {
            title: "Built for busy — tiny, high-impact actions.",
            icon: <Bolt className="w-6 h-6" aria-hidden="true" />
          }, {
            title: "Private by design — your convo stays yours.",
            icon: <Shield className="w-6 h-6" aria-hidden="true" />
          }].map((item, index) => <article key={index} className={`${glassCard} p-4 group motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out hover:shadow-lg hover:shadow-coral-400/10 motion-reduce:transform-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none text-left relative overflow-hidden`} tabIndex={0} role="article" aria-label={item.title}>
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-lg flex items-center justify-center border border-coral-300/30 text-coral-400 group-hover:scale-110 transition-transform shadow-sm flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <p className="font-medium text-white/95 text-sm md:text-base leading-relaxed">{item.title}</p>
                </div>
              </article>)}
          </div>
        </div>
      </section>





      {/* Philosophy Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4 text-xl md:text-2xl font-light text-white/90 leading-relaxed">
              <p>
                Not Instagram-perfect — <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400 font-medium">real-life strong</span>.
              </p>
              <p>
                Not fight-free — <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400 font-medium">fight-smart</span>.
              </p>
              <p>
                Not always easy — <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400 font-medium">always worth it</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${glassCard} p-4 md:p-6 max-w-3xl mx-auto`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-lg flex items-center justify-center border border-coral-300/30">
                <Lock className="w-4 h-4 text-coral-400" aria-label="Privacy & Security" />
              </div>
              <p className="text-white/90 font-medium text-sm md:text-base">
                Locked on your device. Only you can see it. Analytics are optional.
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-white/70 mb-4">
              <p>• Encrypted on your device before anything is sent</p>
              <p>• Only your account can access your data</p>
              <p>• Analytics are opt-in (anonymous, off by default)</p>
            </div>
            
            <Link to="/privacy" className="text-white/70 hover:text-white/90 underline underline-offset-2 text-sm motion-safe:transition-colors motion-safe:duration-150">
              Read more
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Split Banner */}
      <PhotoSplitBanner 
        imageSrc={coupleConnection}
        alt="Couple having a meaningful conversation"
        heading="2071"
        align="left"
      />

      {/* CTA Band */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${glassCard} p-8 md:p-12 text-center`}>
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 mb-8">
              Ready to love smarter?
            </h2>
            
            <div className="flex flex-col gap-3 justify-center max-w-md mx-auto">
              <Link to="/signup">
                <Button className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full px-6 py-3 text-base md:text-lg font-medium motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5">
                  Start free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/mission">
                <Button variant="ghost" className="w-full glass-burgundy border border-burgundy-500/15 rounded-full text-white/90 hover:bg-burgundy-400/15 px-6 py-3 text-base md:text-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5">
                  Watch a 45-sec demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>;
};
export default LandingPage;