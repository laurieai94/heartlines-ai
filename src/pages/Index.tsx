import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Phone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentProfile, setCurrentProfile] = useState(0);

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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rich-black via-graphite to-dark-gray relative overflow-hidden">
      {/* Enhanced Background with Electric Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-graphite/60 via-dark-gray/40 to-rich-black/80 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/3 via-soft-gray/5 to-electric-purple/4 animate-gradient" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-dark-gray/20 via-neon-cyan/2 to-rich-black/30 animate-gradient" style={{ animationDelay: '2s' }}></div>

      {/* Enhanced Floating Particles with Electric Colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 6 === 0 ? 'bg-electric-blue/40 animate-electric-pulse' : 
              i % 6 === 1 ? 'bg-neon-cyan/30 animate-electric-pulse' :
              i % 6 === 2 ? 'bg-electric-purple/35 animate-electric-pulse' :
              i % 6 === 3 ? 'bg-lavender/30 animate-lavender-pulse' : 
              'bg-warm-white/20 animate-monochrome-pulse'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Geometric Shapes with Electric Borders */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-20 h-20 rounded-lg animate-spin ${
              i % 5 === 0 ? 'border border-electric-blue/25' :
              i % 5 === 1 ? 'border border-neon-cyan/20' :
              i % 5 === 2 ? 'border border-electric-purple/25' :
              i % 5 === 3 ? 'border border-lavender/20' : 
              'border border-warm-white/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Code-like Background Elements - Enhanced with Electric Colors */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 font-mono text-xs text-electric-blue">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-neon-cyan">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-electric-purple">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>

      {/* Enhanced Navigation with Electric Blue Accents */}
      <nav className="px-6 py-4 relative z-10 bg-gradient-to-r from-rich-black/40 via-graphite/20 to-rich-black/40 backdrop-blur-sm border-b border-electric-blue/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-xl flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/30 neon-glow-blue">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-warm-white font-sans">RealTalk</span>
          </div>
          <div className="flex items-center">
            <Link to="/dashboard">
              <Button variant="outline" className="border-electric-blue/50 text-warm-white hover:bg-electric-blue/15 hover:border-electric-blue/70 hover:text-electric-blue rounded-full font-thin backdrop-blur-sm transition-all duration-300">
                Get Started - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with Electric Blue Accents */}
      <section className="relative px-6 py-20 lg:py-28 bg-gradient-to-br from-rich-black/60 via-graphite/40 to-dark-gray/60 backdrop-blur-sm">
        {/* Enhanced accent decoration with electric colors */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-electric-blue/15 to-electric-purple/20 rounded-full blur-xl animate-electric-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-neon-cyan/12 to-electric-blue/15 rounded-full blur-xl animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-graphite/5 via-electric-blue/2 to-graphite/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-warm-white/5 to-electric-blue/12 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-electric-blue/25 shadow-elegant transition-transform duration-300 hover:neon-glow-blue"
                style={{
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full animate-electric-pulse"></div>
                <span className="text-sm font-light text-warm-white/90 tracking-wide">Finally, an app that gets your relationship</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-thin text-warm-white mb-8 leading-tight">
                Your relationship isn't a rom-com.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan">
                  Real growth needs real tools.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-medium-gray mb-12 leading-relaxed font-light">
                We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
              </p>
              
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-10 py-7 text-lg rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-electric-blue/40 font-light backdrop-blur-sm hover:neon-glow-blue">
                  Get Started - It's Free
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            {/* Phone with Dating App - Enhanced with Electric Accents */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Phone Frame with Electric Border */}
                <div className="relative w-80 h-[600px] bg-rich-black rounded-[2.5rem] p-3 shadow-3xl border border-electric-blue/25">
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-gradient-to-b from-graphite to-rich-black rounded-[2rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-warm-white text-sm">
                      <span>9:41 AM</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-electric-blue/80 rounded-sm"></div>
                        <div className="w-4 h-2 bg-electric-blue/60 rounded-sm"></div>
                        <div className="w-4 h-2 bg-warm-white/40 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header with Electric Accent */}
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-electric-blue to-neon-cyan">RealSwipe</h2>
                        <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center neon-glow-blue">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Dating Profile Card */}
                    <div className="px-6 pb-6 flex-1">
                      <div 
                        key={currentProfile}
                        className="bg-gradient-to-b from-warm-white/10 to-warm-white/5 backdrop-blur-md rounded-3xl p-6 h-96 relative border border-electric-blue/20 animate-fade-in"
                      >
                        {/* Profile Photo */}
                        <div className="w-full h-48 bg-gradient-to-br from-medium-gray/20 to-graphite/20 rounded-2xl overflow-hidden mb-4 border border-electric-blue/15">
                          <img 
                            src={datingProfiles[currentProfile].photo} 
                            alt={datingProfiles[currentProfile].name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Profile Info */}
                        <div className="text-warm-white">
                          <h3 className="text-2xl font-light mb-1">
                            {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                          </h3>
                          <p className="text-medium-gray text-sm mb-4">{datingProfiles[currentProfile].bio}</p>
                        </div>

                        {/* Action Buttons with Electric Colors */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4">
                          <div className="w-12 h-12 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/30">
                            <span className="text-red-400 text-xl">✕</span>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-electric-blue/30 to-electric-purple/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-electric-blue/50 neon-glow-blue">
                            <Heart className="w-5 h-5 text-electric-blue" />
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan/20 to-electric-blue/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-neon-cyan/40">
                            <MessageCircle className="w-5 h-5 text-neon-cyan" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Dots with Electric Active State */}
                    <div className="flex justify-center gap-2 pb-6">
                      {datingProfiles.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentProfile ? 'bg-electric-blue neon-glow-blue' : 'bg-warm-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phone Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-electric-blue/40 rounded-full"></div>
                </div>

                {/* Enhanced Floating Elements with Electric Colors */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-electric-blue/25 to-electric-purple/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-electric-blue/40 animate-electric-pulse neon-glow-blue">
                  <Heart className="w-6 h-6 text-electric-blue" />
                </div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-neon-cyan/20 to-electric-blue/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-neon-cyan/30 animate-electric-pulse" style={{ animationDelay: '1s' }}>
                  <MessageCircle className="w-6 h-6 text-neon-cyan" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Visual Break with Electric Accent */}
      <section className="px-6 py-8 relative bg-gradient-to-r from-graphite/40 via-electric-blue/8 to-graphite/40 backdrop-blur-sm border-y border-electric-blue/15">
        <div className="max-w-6xl mx-auto">
          <div className="relative flex items-center justify-center">
            {/* Enhanced gradient line with electric colors */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent"></div>
            {/* Electric accent dots */}
            <div className="absolute left-1/4 w-2 h-2 bg-electric-blue/80 rounded-full animate-electric-pulse neon-glow-blue"></div>
            <div className="absolute right-1/4 w-2 h-2 bg-neon-cyan/80 rounded-full animate-electric-pulse" style={{ animationDelay: '0.5s' }}></div>
            {/* Enhanced center icon */}
            <div className="absolute bg-gradient-to-r from-rich-black/50 to-graphite/50 px-6 backdrop-blur-sm rounded-full">
              <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-4 mx-auto border border-electric-blue/40 neon-glow-blue">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section - Enhanced with Electric Accents */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-graphite/40 via-dark-gray/30 to-graphite/40 backdrop-blur-sm border-y border-warm-white/10">
        {/* Enhanced Background Effects with Electric Hints */}
        <div className="absolute inset-0 bg-gradient-to-r from-rich-black/8 via-electric-blue/3 to-rich-black/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.06),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(128,0,255,0.04),transparent_50%)]"></div>
        
        {/* Enhanced Accent Lines with Electric Colors */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-purple/40 to-transparent"></div>
        
        {/* Enhanced Side Accent Elements */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-blue/30 to-neon-cyan/30"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-purple/30 to-electric-blue/30"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Problem Setup Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-graphite/40 to-electric-blue/15 backdrop-blur-lg rounded-full px-8 py-3 mb-8 border border-electric-blue/25">
              <span className="text-warm-white font-light tracking-wide">The Real Talk</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-thin text-warm-white mb-8 leading-tight">
              Dating apps taught us how to swipe.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan mt-3 text-4xl lg:text-5xl">
                Now what?
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl text-medium-gray leading-relaxed font-light">
                Nobody prepared us for the actual relationship part. You know—the daily stuff.
              </p>
              <p className="text-xl text-soft-gray leading-relaxed font-light">
                Like how to fight without losing your minds—or expecting mind-reading.
              </p>
            </div>
          </div>

          {/* Enhanced Visual Separator with Electric Icon */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
            <div className="absolute bg-gradient-to-r from-electric-blue to-electric-purple rounded-full p-4 shadow-elegant border border-electric-blue/40 neon-glow-blue">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Solution Section - Enhanced with Electric Accent */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Better balanced */}
            <div className="space-y-8 flex items-center">
              <div className="bg-gradient-to-br from-graphite/30 via-electric-blue/5 to-graphite/30 backdrop-blur-xl rounded-3xl p-12 border border-electric-blue/20 shadow-elegant flex items-center justify-center min-h-[300px]">
                <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-electric-blue to-electric-purple text-center leading-tight">
                  Enter RealTalk.
                </h3>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8 flex items-center">
              <div className="bg-gradient-to-br from-dark-gray/20 via-electric-blue/3 to-dark-gray/20 backdrop-blur-xl rounded-3xl p-8 border border-electric-blue/15 shadow-elegant">
                <div className="space-y-6">
                  <p className="text-lg text-soft-gray leading-relaxed font-light">
                    We built this because most relationship tools just tell you what's wrong without teaching you how to actually fix it.
                  </p>
                  <p className="text-lg text-medium-gray leading-relaxed font-light">
                    Our AI helps you do the real work—having those conversations you've been avoiding, understanding why you both react the way you do, and building new patterns that actually stick.
                  </p>
                  <p className="text-lg text-medium-gray leading-relaxed font-light">
                    Because great relationships aren't built on hoping things get easier. They're built on two people who get better at doing the hard things together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works - Enhanced with Electric Blue Icons */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-rich-black/60 via-graphite/40 to-rich-black/60 backdrop-blur-sm border-b border-warm-white/5">
        {/* Enhanced accent - connecting lines with electric colors */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-purple/30 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-graphite/5 via-electric-blue/4 to-graphite/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-blue/40 neon-glow-blue">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-warm-white mb-6">
              How It Actually Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-electric-blue/15 hover:border-electric-blue/25">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40 group-hover:neon-glow-blue">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">We Get to Know You (For Real)</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-electric-purple/15 hover:border-electric-purple/25">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-purple/40 to-neon-cyan/40 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-purple/40 group-hover:neon-glow-purple">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">Daily Tips You'll Actually Use</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-neon-cyan/15 hover:border-neon-cyan/25">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-cyan/40 to-electric-blue/40 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-neon-cyan/40 group-hover:neon-glow-cyan">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">Practice Makes Progress</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-electric-blue/15 hover:border-electric-blue/25">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40 group-hover:neon-glow-blue">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">Thoughtful Actions Made Easy</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Different Section - Enhanced with Electric Sparkles */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-graphite/60 via-dark-gray/40 to-graphite/60 backdrop-blur-sm border-b border-warm-white/5">
        {/* Enhanced accent - grid pattern with electric hints */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-rich-black/5 via-electric-blue/3 to-rich-black/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-blue/40 neon-glow-blue">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-warm-white mb-8">
              Why This Isn't Just Another App
            </h2>
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan mb-12">
              We're Built Different
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-center border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/15 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:border-electric-blue/25">
              <h4 className="text-xl font-light text-warm-white mb-3">No toxic positivity</h4>
              <p className="text-medium-gray leading-relaxed font-light">Real relationships have rough patches, and that's normal</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-purple/15 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:border-electric-purple/25">
              <h4 className="text-xl font-light text-warm-white mb-3">Actually personalized</h4>
              <p className="text-medium-gray leading-relaxed font-light">Not horoscope-level generic advice</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-neon-cyan/15 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:border-neon-cyan/25">
              <h4 className="text-xl font-light text-warm-white mb-3">Designed for busy humans</h4>
              <p className="text-medium-gray leading-relaxed font-light">Quick daily insights that fit into your actual life</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/15 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:border-electric-blue/25">
              <h4 className="text-xl font-light text-warm-white mb-3">Privacy first</h4>
              <p className="text-medium-gray leading-relaxed font-light">Your relationship details stay between you, your partner, and our very secure servers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced Electric Heart */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-dark-gray/40 via-graphite/40 to-dark-gray/40 backdrop-blur-sm">
        {/* Enhanced accent - radiating circles with electric colors */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 border border-electric-blue/30 rounded-full animate-electric-pulse"></div>
          <div className="absolute w-80 h-80 border border-electric-purple/20 rounded-full animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-64 h-64 border border-neon-cyan/15 rounded-full animate-electric-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-graphite/5 via-electric-blue/3 to-graphite/5"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Enhanced Header with Electric Heart Icon */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40 shadow-elegant neon-glow-blue">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-warm-white mb-8 leading-tight">
              For People Who Actually Want to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan"> Get Better at Love</span>
            </h2>
          </div>

          {/* Enhanced Main Content in Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Card - Reality Check */}
            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/15 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 hover:border-electric-blue/25">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-blue/40">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">The Reality</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                Let's be honest. Relationships today are <strong className="text-warm-white">complicated as hell</strong>. We're dealing with <strong className="text-warm-white">dating apps</strong> that make everyone feel replaceable, <strong className="text-warm-white">social media</strong> that shows us everyone else's highlight reel, and a world that moves so fast we barely have time to actually connect. Add in different <strong className="text-warm-white">love languages</strong>, <strong className="text-warm-white">attachment styles</strong>, and the fact that <strong className="text-warm-white">nobody taught us</strong> how to actually do relationships, and it's no wonder so many couples feel lost.
              </p>
            </Card>

            {/* Right Card - What We Believe */}
            <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-purple/15 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 hover:border-electric-purple/25">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-purple/40 to-neon-cyan/40 rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-purple/40">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-warm-white mb-4">Our Philosophy</h3>
              <p className="text-medium-gray leading-relaxed font-light">
                We believe the best relationships aren't about <strong className="text-warm-white">perfection</strong>—they're about <strong className="text-warm-white">two people</strong> who keep choosing to understand each other better while building something that works for your actual lives. Not <strong className="text-warm-white">Instagram perfect</strong>, but <strong className="text-warm-white">real-life strong</strong>. Not <strong className="text-warm-white">conflict-free</strong>, but <strong className="text-warm-white">conflict-smart</strong>. Not always easy, but always <strong className="text-warm-white">worth it</strong>.
              </p>
            </Card>
          </div>

          {/* Enhanced CTA Section with Electric Button */}
          <div className="mb-12">
            <h3 className="text-3xl font-light text-warm-white mb-8">Ready to Love Smarter?</h3>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-12 py-8 text-xl rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-electric-blue/40 mb-6 font-light neon-glow-blue">
                Create Your Profile
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          {/* Enhanced Fine Print Section with Electric Accents */}
          <div className="bg-gradient-to-r from-graphite/20 via-electric-blue/8 to-graphite/20 backdrop-blur-lg p-8 rounded-3xl border border-electric-blue/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-electric-blue/50 to-electric-purple/50 rounded-full flex items-center justify-center border border-electric-blue/40">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-light text-warm-white">The Fine Print (But Make It Friendly)</h4>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-electric-blue/15 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-blue/25">
                  <span className="text-electric-blue font-bold">$</span>
                </div>
                <p className="text-medium-gray font-light">Free to start, always</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-purple/20 to-electric-blue/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-purple/30">
                  <Sparkles className="w-5 h-5 text-electric-purple" />
                </div>
                <p className="text-medium-gray font-light">Premium features for when you want to go deeper</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-neon-cyan/15 rounded-full flex items-center justify-center mb-3 mx-auto border border-neon-cyan/25">
                  <Users className="w-5 h-5 text-neon-cyan" />
                </div>
                <p className="text-medium-gray font-light">Built by people who are also figuring out love</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue/20 to-electric-purple/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-blue/30">
                  <Heart className="w-5 h-5 text-electric-blue" />
                </div>
                <p className="text-medium-gray font-light">No judgment, just better tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Floating Try It Now Button with Electric Colors */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-6 py-4 rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm border border-electric-blue/40 neon-glow-blue">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Enhanced Footer with Electric Heart */}
      <footer className="px-6 py-16 bg-rich-black/70 backdrop-blur-sm relative border-t border-electric-blue/15">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center shadow-elegant backdrop-blur-sm border border-electric-blue/40 neon-glow-blue">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-light text-warm-white">RealTalk</span>
          </div>
          <p className="text-medium-gray font-light text-lg">Finally, an app that gets your relationship.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
