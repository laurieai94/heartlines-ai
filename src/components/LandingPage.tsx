import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, Menu, User, Home, CreditCard, Settings, UserPlus, MessageCircleHeart, CircleSlash, Bolt, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BRAND } from "@/branding";
import BrandMark from "./BrandMark";
import HeartlinesWordmark from "./Brand/HeartlinesWordmark";
import ProductPhoneDemo from "./ProductPhoneDemo";
import HeroPhoneScroll from "./HeroPhoneScroll";
import FlameBackground from "./FlameBackground";

const LandingPage = ({ showMarketingTopBar = true }: { showMarketingTopBar?: boolean }) => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isEmbedded = !showMarketingTopBar;

  // Glass card styling helper
  const glassCard = "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-md";

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/coach', label: 'Coach', icon: MessageSquare },
    { to: '/mission', label: 'Mission', icon: Target },
    { to: '/account', label: 'My Account', icon: Settings },
    { to: '/pricing', label: 'Plans', icon: CreditCard },
  ];

  const datingProfiles = [
    { 
      name: "Emma", 
      age: 28, 
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", 
      bio: "Photographer & dog mom" 
    },
    { 
      name: "Jake", 
      age: 31, 
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", 
      bio: "Chef & weekend surfer" 
    },
    { 
      name: "Zoe", 
      age: 24, 
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", 
      bio: "Designer & music lover" 
    },
    { 
      name: "Chris", 
      age: 33, 
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", 
      bio: "Teacher & rock climber" 
    },
    { 
      name: "Lily", 
      age: 27, 
      photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face", 
      bio: "Writer & coffee enthusiast" 
    },
    { 
      name: "Alex", 
      age: 30, 
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face", 
      bio: "Engineer & marathon runner" 
    },
    { 
      name: "Maya", 
      age: 25, 
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face", 
      bio: "Artist & yoga instructor" 
    }
  ];

   useEffect(() => {
     // Only run animations for full marketing page
     if (!isEmbedded) {
       const timer = setTimeout(() => {
         setShowFloatingButton(true);
       }, 3000);

       const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY });
       };

       // Rotate profiles every 2 seconds
       const profileTimer = setInterval(() => {
         setCurrentProfile((prev) => (prev + 1) % datingProfiles.length);
       }, 2000);

       window.addEventListener('mousemove', handleMouseMove);

       return () => {
         clearTimeout(timer);
         clearInterval(profileTimer);
         window.removeEventListener('mousemove', handleMouseMove);
       };
     }
   }, [isEmbedded]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-burgundy-900">
      {/* Animated Holographic Background - Only show for marketing page */}
      {showMarketingTopBar && (
        <>
        </>
      )}

      {/* Floating Particles */}
      {!isEmbedded && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pink-300/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Geometric Shapes */}
      {!isEmbedded && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 border border-pink-300/10 rounded-lg animate-spin"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Code-like Background Elements */}
      {!isEmbedded && (
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 left-10 font-mono text-xs text-pink-200">
            {`const love = { understanding: true, growth: infinite }`}
          </div>
          <div className="absolute top-1/3 right-20 font-mono text-xs text-coral-200">
            {`if (relationship.status === 'complicated') { ai.help() }`}
          </div>
          <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-pink-200">
            {`return personalized.advice.filter(advice => advice.isRelevant)`}
          </div>
        </div>
      )}

      {/* Navigation */}
      {showMarketingTopBar && (
        <nav className="px-1 py-3 relative z-10 bg-burgundy-900/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white/50 hover:text-white/80 bg-transparent hover:bg-transparent p-1 ml-2 transition-colors duration-200"
                    aria-label="Open menu"
                  >
                    <Menu className="w-3.5 h-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-36 p-1 bg-black/40 backdrop-blur-sm border-0 shadow-none">
                  <div className="flex flex-col">
                    {navItems.map((item) => {
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="text-white/60 hover:text-white transition-colors duration-150 text-sm px-2 py-1.5 font-light"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
              
            </div>
            
            {/* Mobile Get Started */}
            <div className="md:hidden mr-2">
              <Link to="/auth">
                <Button className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:shadow-lg active:scale-[0.98] shadow-md rounded-full font-medium text-xs px-3 py-1.5 transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="#how-it-works" 
                className="text-white/90 hover:text-white transition-colors font-thin px-4 py-2 rounded-full hover:bg-white/5"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it works
              </a>
              <Link 
                to="/auth?mode=signin"
                className="text-white/90 hover:text-white transition-colors font-thin px-4 py-2 rounded-full hover:bg-white/5 text-sm"
              >
                Sign in
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white hover:shadow-lg hover:shadow-pink-500/20 rounded-full font-medium backdrop-blur-sm px-6 py-2 transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section - Locked layout with flame background */}
      <section 
        className="relative overflow-hidden"
        style={{ minHeight: !isEmbedded ? 'calc(100vh - 64px)' : '100vh' }}
      >
        {/* Flame Background */}
        <FlameBackground />
        
        {/* Glassmorphic background layers */}
        {!isEmbedded && (
          <>
            {/* Primary hero section with locked two-column layout */}
            <div className="px-4 sm:px-6 py-2 sm:py-4">
              {/* Accent decoration - floating orbs with glassmorphism */}
              <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-burgundy-400/10 to-coral-400/10 rounded-full blur-xl animate-pulse backdrop-blur-sm"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-coral-400/15 to-burgundy-400/15 rounded-full blur-xl animate-pulse backdrop-blur-sm" style={{ animationDelay: '1s' }}></div>
              
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-start min-h-full">
                  {/* Left Column - Hero Copy (Always Left) */}
                  <div className="text-left max-w-[580px] self-center">
                    <div className="space-y-3 mb-4 md:mb-6">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-normal leading-tight animate-fade-in">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                          Modern love is messy.
                        </span>
                      </h1>
                      
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-normal leading-tight animate-fade-in text-white/90" style={{ animationDelay: '0.8s' }}>
                        <span className="font-brand">heartlines</span> helps you connect.
                      </h3>
                    </div>

                    
                    <Link to="/get-started" className="hidden md:inline-block">
                      <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-4 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Right Column - Mobile Chat Interface (Always Right, Always Visible Above Fold) */}
                  <div className="relative flex justify-center items-start self-start md:-mt-2 -mt-4">
                    <div className="w-full max-w-md md:scale-100 scale-100 origin-top">
                      <HeroPhoneScroll className="animate-fade-in w-full h-full" style={{ animationDelay: '1.6s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Embedded version - horizontal layout with flame background */}
        {isEmbedded && (
          <div className="px-6 py-8 lg:py-12">
            <FlameBackground />
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)]">
                {/* Left - Text Content */}
                <div className="max-w-[580px]">
                  <div className="space-y-4 mb-6">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-playfair font-normal leading-tight animate-fade-in">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 drop-shadow-sm">
                        Modern love is messy.
                      </span>
                    </h1>
                    
                    <h3 className="text-lg lg:text-xl xl:text-2xl font-playfair font-normal leading-tight animate-fade-in text-white/90" style={{ animationDelay: '0.8s' }}>
                      <span className="font-brand">heartlines</span> helps you connect.
                    </h3>
                  </div>

                  <Link to="/get-started">
                    <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-8 py-4 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </Link>
                </div>

                {/* Right - Chat Animation */}
                <div className="relative flex justify-center">
                  <div className="w-full max-w-md" style={{ height: 'min(min(52svh, 52dvh), 500px)' }}>
                    <HeroPhoneScroll className="animate-fade-in w-full h-full" style={{ animationDelay: '1.6s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 mb-6">How It Works</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Quick sign-up to personalized advice in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Join Free",
                description: "Quick sign-up. No card needed.",
                icon: <UserPlus className="w-6 h-6" aria-hidden="true" />
              },
              {
                step: "02", 
                title: "Share Your Story",
                description: "A few answers so Kai gets you.",
                icon: <MessageSquare className="w-6 h-6" aria-hidden="true" />
              },
              {
                step: "03",
                title: "Talk It Out",
                description: "Fresh advice, not recycled tips.",
                icon: <MessageCircleHeart className="w-6 h-6" aria-hidden="true" />
              }
            ].map((item, index) => (
              <article 
                key={index}
                className={`${glassCard} p-5 md:p-6 relative group motion-safe:hover:-translate-y-0.5 motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none`}
                tabIndex={0}
                role="article"
                aria-label={item.title}
              >
                <span className="absolute top-4 left-4 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-coral-400 to-pink-500 text-white/95">
                  {item.step}
                </span>
                
                <div className="mt-8 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-xl flex items-center justify-center mb-4 mx-auto border border-coral-300/30 text-coral-400 group-hover:text-pink-400 motion-safe:transition-colors motion-safe:duration-200">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white/95 mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break with Accent */}
      <section className={`px-6 py-8 relative ${isEmbedded ? 'bg-transparent border-y-0 backdrop-blur-0' : 'bg-gradient-to-r from-pink-900/20 via-coral-900/10 to-pink-900/20 backdrop-blur-sm border-y border-coral-400/10'}`}>
        <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center justify-center">
          {!isEmbedded && (
            <>
              {/* Gradient line with floating dots */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent"></div>
              {/* Accent dots */}
              <div className="absolute left-1/4 w-2 h-2 bg-coral-400/60 rounded-full animate-pulse"></div>
              <div className="absolute right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              {/* Center icon */}
              <div className="absolute bg-gradient-to-r from-coral-900/50 to-pink-900/50 px-6 backdrop-blur-sm rounded-full">
                <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-4 mx-auto border border-coral-300/30">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </>
          )}
        </div>
        </div>
      </section>

      {/* Real Talk Section - Enhanced with combined content */}
      <section className={`px-6 py-20 relative ${isEmbedded ? 'bg-transparent border-y-0 backdrop-blur-0' : 'bg-gradient-to-br from-coral-900/20 via-pink-900/15 to-coral-900/20 backdrop-blur-sm border-y border-coral-400/20'}`}>
        {/* Dramatic Background Effects */}
        {!isEmbedded && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-coral-500/8 via-pink-500/12 to-coral-500/8"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,114,94,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
            
            {/* Accent Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-coral-400/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"></div>
            
            {/* Side Accent Elements */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-coral-400/40 to-pink-400/40"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-pink-400/40 to-coral-400/40"></div>
          </>
        )}
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Problem Setup Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-coral-500/20 to-pink-500/20 backdrop-blur-lg rounded-full px-8 py-3 mb-8 border border-coral-300/30">
              <span className="text-coral-300 font-light tracking-wide">The Real Talk</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-thin text-white mb-8 leading-tight">
              Dating apps taught us how to swipe.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 mt-3 text-4xl lg:text-5xl">
                Now what?
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl text-gray-300 leading-relaxed font-light">
                Nobody prepared us for the actual relationship part. You know—the daily stuff.
              </p>
              <p className="text-xl text-gray-400 leading-relaxed font-light">
                Like how to fight without losing your minds—or expecting mind-reading.
              </p>
            </div>
          </div>

          {/* Visual Separator with Icon */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent"></div>
            <div className="absolute bg-gradient-to-r from-coral-400 to-pink-400 rounded-full p-4 shadow-2xl border border-coral-300/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Solution Section - Balanced Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Better balanced */}
            <div className="space-y-8 flex items-center">
              <div className="bg-gradient-to-br from-coral-500/15 via-pink-500/10 to-coral-500/15 backdrop-blur-xl rounded-3xl p-12 border border-coral-300/20 shadow-2xl flex items-center justify-center min-h-[300px]">
                <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 text-center leading-tight">
                  Enter {BRAND.name}.
                </h3>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8 flex items-center">
              <div className="bg-gradient-to-br from-pink-500/10 via-coral-500/5 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-pink-300/20 shadow-2xl">
                <div className="space-y-6">
                  <p className="text-lg text-gray-200 leading-relaxed font-light">
                    We built this because most relationship tools just tell you what's wrong without teaching you how to actually fix it.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed font-light">
                    Our AI helps you do the real work—having those conversations you've been avoiding, understanding why you both react the way you do, and building new patterns that actually stick.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed font-light">
                    Because great relationships aren't built on hoping things get easier. They're built on two people who get better at doing the hard things together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works */}
      <section className={`px-6 py-20 relative ${isEmbedded ? 'bg-transparent border-b-0 backdrop-blur-0' : 'bg-gradient-to-br from-coral-900/30 via-pink-900/20 to-coral-900/30 backdrop-blur-sm border-b border-coral-400/5'}`}>
        {/* Accent - connecting lines */}
        {!isEmbedded && (
          <>
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-coral-300/30 to-transparent"></div>
              <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-300/30 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-coral-500/5 via-pink-500/10 to-coral-500/5"></div>
          </>
        )}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-6 mx-auto border border-coral-300/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
              How It Actually Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-coral-400/20">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400/20 to-pink-400/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-coral-300/30">
                <Brain className="w-10 h-10 text-coral-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">We Get to Know You (For Real)</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-coral-400/20">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-coral-300/30">
                <Target className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Daily Tips You'll Actually Use</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-coral-400/20">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-coral-300/30">
                <MessageCircle className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Practice Makes Progress</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-coral-400/20">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400/20 to-pink-400/20 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-coral-300/30">
                <Sparkles className="w-10 h-10 text-coral-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Thoughtful Actions Made Easy</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It's Different Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 mb-6">Why It's Different</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "No toxic positivity",
                description: "Real relationships have rough patches, and that's normal",
                icon: <CircleSlash className="w-5 h-5" aria-hidden="true" />
              },
              {
                title: "Actually personalized", 
                description: "Not horoscope-level generic advice",
                icon: <Sparkles className="w-5 h-5" aria-hidden="true" />
              },
              {
                title: "Built for busy",
                description: "Quick daily insights that fit into your actual life",
                icon: <Bolt className="w-5 h-5" aria-hidden="true" />
              },
              {
                title: "Privacy-first",
                description: "Your relationship details stay between you, your partner, and our very secure servers",
                icon: <Shield className="w-5 h-5" aria-hidden="true" />
              }
            ].map((item, index) => (
              <article
                key={index}
                className={`${glassCard} p-5 md:p-6 group motion-safe:hover:-translate-y-0.5 motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out motion-reduce:transform-none motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none text-center sm:text-left`}
                tabIndex={0}
                role="article"
                aria-label={item.title}
              >
                <div className="flex items-center justify-center sm:justify-start mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-lg flex items-center justify-center border border-coral-300/30 text-coral-400">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-white/95 mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
          <div className="border-t border-white/10 pt-16"></div>
          <div className="max-w-prose mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95">
              We believe the best relationships aren't about{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
                perfection
              </span>
              —they're about{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-pink-400">
                two people
              </span>{" "}
              who keep choosing to understand each other better.
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              Not Instagram perfect, but real-life strong. Not conflict-free, but conflict-smart. 
              Not always easy, but always worth it.
            </p>
          </div>
          <div className="border-b border-white/10 pt-16"></div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${glassCard} p-6 md:p-8 max-w-3xl mx-auto text-center`}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-xl flex items-center justify-center border border-coral-300/30 mr-3">
                <Lock className="w-6 h-6 text-coral-400" aria-label="Privacy & Security" />
              </div>
              <h3 className="text-xl font-semibold text-white/95">Privacy & Security</h3>
            </div>
            
            <p className="text-white/80 mb-4 font-medium">
              Locked on your device. Only you can see it. Analytics are optional.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70 mb-4">
              <div className="text-left md:text-right">
                <p>• Encrypted on your device before anything is sent</p>
                <p>• Only your account can access your data</p>
              </div>
              <div className="text-left">
                <p>• Analytics are opt-in (anonymous, off by default)</p>
                <p>• Your conversations stay private</p>
              </div>
            </div>
            
            <Link 
              to="/privacy-and-security" 
              className="text-white/70 hover:text-white/90 underline underline-offset-2 text-sm motion-safe:transition-colors motion-safe:duration-150"
            >
              Read our full privacy policy
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${glassCard} p-8 md:p-12 text-center`}>
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 mb-6">
              Ready to Love Smarter?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands building stronger relationships with personalized AI guidance.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white rounded-full px-5 py-3 text-base md:text-lg font-medium motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/mission">
                <Button 
                  variant="ghost" 
                  className="bg-white/10 border border-white/15 rounded-full text-white/90 hover:bg-white/15 px-5 py-3 text-base md:text-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <BrandMark 
              size="lg"
              className="opacity-90 mx-auto mb-4"
            />
            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
              We're building tools to help you two communicate, not just consume.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/privacy-and-security" 
              className="text-white/70 hover:text-white/90 motion-safe:transition-colors motion-safe:duration-150 focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none rounded px-1"
            >
              Privacy
            </Link>
            <span className="text-white/40">•</span>
            <Link 
              to="/company" 
              className="text-white/70 hover:text-white/90 motion-safe:transition-colors motion-safe:duration-150 focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none rounded px-1"
            >
              Contact
            </Link>
            <span className="text-white/40">•</span>
            <Link 
              to="/company" 
              className="text-white/70 hover:text-white/90 motion-safe:transition-colors motion-safe:duration-150 focus-visible:ring-2 focus-visible:ring-coral-300/60 focus-visible:outline-none rounded px-1"
            >
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
