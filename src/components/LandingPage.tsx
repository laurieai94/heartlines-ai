import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BRAND } from "@/branding";
import BrandMark from "./BrandMark";
import ProductPhoneDemo from "./ProductPhoneDemo";
import HeroPhoneScroll from "./HeroPhoneScroll";
import FlameBackground from "./FlameBackground";

const LandingPage = ({ showMarketingTopBar = true }: { showMarketingTopBar?: boolean }) => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isEmbedded = !showMarketingTopBar;

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
        <nav className="px-6 py-4 relative z-10 bg-burgundy-900 border-b border-pink-300/10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 transition-colors"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-burgundy-900/95 backdrop-blur-xl border-pink-300/20">
                  <div className="flex flex-col gap-6 mt-8">
                    <a 
                      href="#how-it-works" 
                      className="text-white/80 hover:text-white transition-colors font-light text-lg px-4 py-3 rounded-lg hover:bg-white/5"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                        setIsMenuOpen(false);
                      }}
                    >
                      How it works
                    </a>
                    <Link 
                      to="/privacy-and-security"
                      className="text-white/80 hover:text-white transition-colors font-light text-lg px-4 py-3 rounded-lg hover:bg-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Privacy & Security
                    </Link>
                    <Link 
                      to="/auth"
                      className="text-coral-400 hover:text-coral-300 transition-colors font-light text-lg px-4 py-3 rounded-lg hover:bg-coral-400/10 border border-coral-400/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Link to="/">
                <BrandMark 
                  size="md"
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            
            {/* Mobile Get Started */}
            <div className="md:hidden">
              <Link to="/auth">
                <Button variant="ghost" className="bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white hover:bg-white/15 hover:shadow-xl hover:shadow-black/40 hover:ring-1 hover:ring-white/35 active:scale-[0.98] shadow-lg shadow-black/30 rounded-full font-thin text-sm px-4 py-2 transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="#how-it-works" 
                className="text-white/80 hover:text-white transition-colors font-thin px-4 py-2 rounded-full hover:bg-white/5"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it works
              </a>
              <Link 
                to="/auth?mode=signin"
                className="text-white/70 hover:text-white transition-colors font-thin px-4 py-2 rounded-full hover:bg-white/5 text-sm"
              >
                Sign in
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-coral-400/50 text-coral-400 hover:bg-coral-400/10 rounded-full font-thin backdrop-blur-sm">
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
                        Kai helps you actually connect.
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
                      Kai helps you actually connect.
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
      <section id="how-it-works" className="px-6 py-20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/5 backdrop-blur-xl rounded-full px-8 py-3 mb-8 border border-white/15 shadow-xl">
              <span className="text-coral-300 font-light tracking-wide text-lg">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-playfair text-white mb-6">
              Three steps to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                better relationships
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              No generic advice. No outdated relationship rules. Just personalized guidance for your unique situation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your free account in seconds. No credit card required.",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "2", 
                title: "Complete Your Profile",
                description: "Answer thoughtful questions to help Kai understand your relationship dynamics.",
                icon: <Target className="w-8 h-8" />
              },
              {
                step: "3",
                title: "Talk to Kai",
                description: "Get personalized relationship coaching tailored to your unique situation.",
                icon: <Brain className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/15 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-coral-400/30 hover:ring-1 hover:ring-coral-400/20 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-coral-400 to-pink-500 rounded-2xl mb-6 mx-auto group-hover:shadow-lg group-hover:shadow-coral-400/25 transition-shadow duration-300">
                  <div className="text-white font-bold text-xl">{item.step}</div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-light text-white mb-4 group-hover:text-coral-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 font-light leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm">
                Try It Now - It's Free
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
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

      {/* Why Different Section */}
      <section className={`px-6 py-20 relative ${isEmbedded ? 'bg-transparent border-b-0 backdrop-blur-0' : 'bg-gradient-to-br from-coral-900/35 via-pink-900/25 to-coral-900/35 backdrop-blur-sm border-b border-coral-400/5'}`}>
        {/* Accent - grid pattern */}
        {!isEmbedded && (
          <>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-coral-500/5 via-pink-500/10 to-coral-500/5"></div>
          </>
        )}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-6 mx-auto border border-coral-300/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8">
              Why This Isn't Just Another App
            </h2>
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400 mb-12">
              We're Built Different
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-center border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg rounded-3xl border border-coral-400/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">No toxic positivity</h4>
              <p className="text-gray-300 leading-relaxed font-light">Real relationships have rough patches, and that's normal</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg rounded-3xl border border-coral-400/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Actually personalized</h4>
              <p className="text-gray-300 leading-relaxed font-light">Not horoscope-level generic advice</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg rounded-3xl border border-coral-400/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Designed for busy humans</h4>
              <p className="text-gray-300 leading-relaxed font-light">Quick daily insights that fit into your actual life</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg rounded-3xl border border-coral-400/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Privacy first</h4>
              <p className="text-gray-300 leading-relaxed font-light">Your relationship details stay between you, your partner, and our very secure servers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Reorganized with Better Visual Flow */}
      <section className={`px-6 py-20 relative ${isEmbedded ? 'bg-transparent backdrop-blur-0' : 'bg-gradient-to-br from-pink-900/25 via-coral-900/25 to-pink-900/25 backdrop-blur-sm'}`}>
        {/* Accent - radiating circles */}
        {!isEmbedded && (
          <>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-96 h-96 border border-coral-300/30 rounded-full animate-pulse"></div>
              <div className="absolute w-80 h-80 border border-pink-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-64 h-64 border border-coral-300/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-coral-500/5 to-pink-500/5"></div>
          </>
        )}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Header with Icon */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-8 mx-auto border border-coral-300/30 shadow-2xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8 leading-tight">
              For People Who Actually Want to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400"> Get Better at Love</span>
            </h2>
          </div>

          {/* Main Content in Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Card - Reality Check */}
            <Card className="p-8 border-0 shadow-xl bg-coral-500/10 backdrop-blur-lg rounded-3xl border border-coral-400/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-coral-400/20 to-pink-400/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-coral-300/30">
                <MessageSquare className="w-8 h-8 text-coral-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">The Reality</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Let's be honest. Relationships today are <strong>complicated as hell</strong>. We're dealing with <strong>dating apps</strong> that make everyone feel replaceable, <strong>social media</strong> that shows us everyone else's highlight reel, and a world that moves so fast we barely have time to actually connect. Add in different <strong>love languages</strong>, <strong>attachment styles</strong>, and the fact that <strong>nobody taught us</strong> how to actually do relationships, and it's no wonder so many couples feel lost.
              </p>
            </Card>

            {/* Right Card - What We Believe */}
            <Card className="p-8 border-0 shadow-xl bg-pink-500/10 backdrop-blur-lg rounded-3xl border border-pink-400/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400/20 to-coral-400/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-pink-300/30">
                <Users className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Our Philosophy</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                We believe the best relationships aren't about <strong>perfection</strong>—they're about <strong>two people</strong> who keep choosing to understand each other better while building something that works for your actual lives. Not <strong>Instagram perfect</strong>, but <strong>real-life strong</strong>. Not <strong>conflict-free</strong>, but <strong>conflict-smart</strong>. Not always easy, but always <strong>worth it</strong>.
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-light text-white mb-8">Ready to Love Smarter?</h3>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 mb-6 font-light">
                Create Your Profile
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          {/* Fine Print Section - Visual Grid */}
          <div className="bg-gradient-to-r from-coral-500/10 to-pink-500/10 backdrop-blur-lg p-8 rounded-3xl border border-coral-300/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-coral-400/30 to-pink-400/30 rounded-full flex items-center justify-center border border-coral-300/30">
                <Heart className="w-4 h-4 text-coral-400" />
              </div>
              <h4 className="text-xl font-light text-white">The Fine Print (But Make It Friendly)</h4>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-400/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-coral-300/30">
                  <span className="text-coral-400 font-bold">$</span>
                </div>
                <p className="text-gray-300 font-light">Free to start, always</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-400/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-pink-300/30">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-gray-300 font-light">Premium features for when you want to go deeper</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-400/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-coral-300/30">
                  <Users className="w-5 h-5 text-coral-400" />
                </div>
                <p className="text-gray-300 font-light">Built by people who are also figuring out love</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-400/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-pink-300/30">
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-gray-300 font-light">No judgment, just better tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="px-6 py-16 bg-black/50 backdrop-blur-sm relative border-t border-coral-300/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <BrandMark 
              size="lg"
              className="opacity-90"
            />
          </div>
          <p className="text-gray-300 font-light text-lg">Finally, an app that gets your relationship.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
