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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dramatic Holographic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-copper-800/30 to-emerald-900/40 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-copper-600/15 via-gold-500/15 to-emerald-600/15 animate-gradient" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-gold-600/15 via-copper-500/15 to-emerald-700/15 animate-gradient" style={{ animationDelay: '2s' }}></div>

      {/* Power Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gold-400/40 rounded-full animate-pulse shadow-gold-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Dramatic Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 border border-copper-400/15 rounded-lg animate-spin shadow-copper-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Enhanced Code-like Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-8">
        <div className="absolute top-20 left-10 font-mono text-sm text-gold-300/60">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-sm text-copper-300/60">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-sm text-gold-300/60">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-6 py-4 relative z-10 bg-gradient-to-r from-emerald-900/30 via-copper-900/20 to-emerald-900/30 backdrop-blur-sm border-b border-gold-400/15">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-copper-500 to-gold-500 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-gold-400/30 shadow-copper-glow">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-sans">RealTalk</span>
          </div>
          <div className="flex items-center">
            <Link to="/dashboard">
              <Button variant="outline" className="border-copper-500/60 text-copper-400 hover:bg-copper-500/15 rounded-full font-thin backdrop-blur-sm shadow-lg hover:shadow-copper-glow transition-all duration-300">
                Get Started - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 bg-gradient-to-br from-emerald-900/40 via-copper-900/30 to-gold-900/40 backdrop-blur-sm">
        {/* Power accent decoration - floating orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-copper-500/15 to-gold-500/15 rounded-full blur-2xl animate-pulse shadow-power-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-gold-500/20 to-copper-500/20 rounded-full blur-2xl animate-pulse shadow-power-3xl" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-copper-600/8 via-gold-500/12 to-copper-600/8"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div 
                className="inline-flex items-center gap-3 glass-copper rounded-full px-6 py-3 mb-8 shadow-lg transition-transform duration-300 animate-power-pulse"
                style={{
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full animate-pulse shadow-gold-glow"></div>
                <span className="text-sm font-light text-white/95 tracking-wide">Finally, an app that gets your relationship</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-thin text-white mb-8 leading-tight">
                Your relationship isn't a rom-com.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-500 to-gold-500 text-copper-glow">
                  Real growth needs real tools.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed font-light">
                We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
              </p>
              
              <Link to="/dashboard">
                <Button className="power-button text-white px-12 py-8 text-lg rounded-full font-light backdrop-blur-sm">
                  Get Started - It's Free
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            {/* Phone with Enhanced Dating App */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Phone Frame with Power Glow */}
                <div className="relative w-80 h-[600px] bg-black rounded-[2.5rem] p-3 shadow-power-4xl border border-emerald-700/30 shadow-emerald-glow">
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-gradient-to-b from-emerald-900/80 to-black rounded-[2rem] overflow-hidden relative border border-emerald-600/20">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                      <span>9:41 AM</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white/70 rounded-sm"></div>
                        <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-copper-500">RealSwipe</h2>
                        <div className="w-8 h-8 bg-gradient-to-r from-gold-500 to-copper-500 rounded-full flex items-center justify-center shadow-gold-glow">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Dating Profile Card */}
                    <div className="px-6 pb-6 flex-1">
                      <div 
                        key={currentProfile}
                        className="glass-emerald rounded-3xl p-6 h-96 relative shadow-emerald-glow animate-fade-in"
                      >
                        {/* Profile Photo */}
                        <div className="w-full h-48 bg-gradient-to-br from-gold-500/25 to-copper-500/25 rounded-2xl overflow-hidden mb-4 border border-gold-400/20 shadow-lg">
                          <img 
                            src={datingProfiles[currentProfile].photo} 
                            alt={datingProfiles[currentProfile].name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Profile Info */}
                        <div className="text-white">
                          <h3 className="text-2xl font-light mb-1 text-gold-glow">
                            {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                          </h3>
                          <p className="text-ivory-200 text-sm mb-4">{datingProfiles[currentProfile].bio}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4">
                          <div className="w-12 h-12 bg-red-600/25 glass backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/40 shadow-lg">
                            <span className="text-red-400 text-xl">✕</span>
                          </div>
                          <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center shadow-gold-glow">
                            <Heart className="w-5 h-5 text-gold-400" />
                          </div>
                          <div className="w-12 h-12 bg-blue-600/25 glass backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/40 shadow-lg">
                            <MessageCircle className="w-5 h-5 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 pb-6">
                      {datingProfiles.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentProfile ? 'bg-gold-500 shadow-gold-glow' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phone Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Power Floating Elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 glass-gold rounded-full flex items-center justify-center animate-pulse shadow-gold-glow">
                  <Heart className="w-6 h-6 text-gold-500" />
                </div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 glass-copper rounded-full flex items-center justify-center animate-pulse shadow-copper-glow" style={{ animationDelay: '1s' }}>
                  <MessageCircle className="w-6 h-6 text-copper-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break with Dramatic Accent */}
      <section className="px-6 py-8 relative bg-gradient-to-r from-emerald-900/30 via-copper-900/20 to-emerald-900/30 backdrop-blur-sm border-y border-copper-500/15">
        <div className="max-w-6xl mx-auto">
          <div className="relative flex items-center justify-center">
            {/* Power gradient line with floating dots */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-copper-500/50 to-transparent shadow-copper-glow"></div>
            {/* Accent dots */}
            <div className="absolute left-1/4 w-2 h-2 bg-copper-500/80 rounded-full animate-pulse shadow-copper-glow"></div>
            <div className="absolute right-1/4 w-2 h-2 bg-gold-500/80 rounded-full animate-pulse shadow-gold-glow" style={{ animationDelay: '0.5s' }}></div>
            {/* Center icon */}
            <div className="absolute glass-emerald px-6 backdrop-blur-sm rounded-full">
              <div className="w-12 h-12 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full flex items-center justify-center mb-4 mx-auto border border-copper-400/40 shadow-power-3xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section - Enhanced with Power Colors */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-copper-900/30 via-emerald-900/25 to-copper-900/30 backdrop-blur-sm border-y border-copper-500/20">
        {/* Dramatic Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-copper-600/10 via-gold-500/15 to-copper-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,65,12,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.2),transparent_50%)]"></div>
        
        {/* Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-copper-500/70 to-transparent shadow-copper-glow"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/70 to-transparent shadow-gold-glow"></div>
        
        {/* Side Accent Elements */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-copper-500/50 to-gold-500/50 shadow-power-3xl"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-gold-500/50 to-copper-500/50 shadow-power-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Problem Setup Section */}
          <div className="text-center mb-16">
            <div className="inline-block glass-copper rounded-full px-8 py-3 mb-8 shadow-lg animate-power-pulse">
              <span className="text-copper-300 font-light tracking-wide">The Real Talk</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-thin text-white mb-8 leading-tight">
              Dating apps taught us how to swipe.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-copper-500 to-gold-500 mt-3 text-4xl lg:text-5xl">
                Now what?
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl text-gray-200 leading-relaxed font-light">
                Nobody prepared us for the actual relationship part. You know—the daily stuff.
              </p>
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                Like how to fight without losing your minds—or expecting mind-reading.
              </p>
            </div>
          </div>

          {/* Visual Separator with Power Icon */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-copper-500/50 to-transparent shadow-copper-glow"></div>
            <div className="absolute bg-gradient-to-r from-copper-500 to-gold-500 rounded-full p-4 shadow-power-4xl border border-copper-400/40">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Solution Section - Enhanced with Power Colors */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column */}
            <div className="space-y-8 flex items-center">
              <div className="glass-emerald rounded-3xl p-12 shadow-power-4xl flex items-center justify-center min-h-[300px] animate-power-pulse">
                <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-copper-500 to-gold-500 text-center leading-tight">
                  Enter RealTalk.
                </h3>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8 flex items-center">
              <div className="glass-gold rounded-3xl p-8 shadow-power-3xl">
                <div className="space-y-6">
                  <p className="text-lg text-gray-100 leading-relaxed font-light">
                    We built this because most relationship tools just tell you what's wrong without teaching you how to actually fix it.
                  </p>
                  <p className="text-lg text-gray-200 leading-relaxed font-light">
                    Our AI helps you do the real work—having those conversations you've been avoiding, understanding why you both react the way you do, and building new patterns that actually stick.
                  </p>
                  <p className="text-lg text-gray-200 leading-relaxed font-light">
                    Because great relationships aren't built on hoping things get easier. They're built on two people who get better at doing the hard things together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works - Power Enhanced */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-copper-900/40 via-emerald-900/30 to-copper-900/40 backdrop-blur-sm border-b border-copper-500/10">
        {/* Accent - connecting lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-copper-300/30 to-transparent"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-300/30 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-copper-600/8 via-gold-500/12 to-copper-600/8"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full flex items-center justify-center mb-6 mx-auto border border-copper-400/40 shadow-power-3xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
              How It Actually Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-power-3xl glass-copper hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group">
              <div className="w-20 h-20 glass-copper rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-copper-400/40">
                <Brain className="w-10 h-10 text-copper-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">We Get to Know You (For Real)</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-power-3xl glass-gold hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group">
              <div className="w-20 h-20 glass-gold rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-gold-400/40">
                <Target className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Daily Tips You'll Actually Use</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-power-3xl glass-gold hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group">
              <div className="w-20 h-20 glass-gold rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-gold-400/40">
                <MessageCircle className="w-10 h-10 text-gold-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Practice Makes Progress</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-power-3xl glass-copper hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group">
              <div className="w-20 h-20 glass-copper rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-copper-400/40">
                <Sparkles className="w-10 h-10 text-copper-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Thoughtful Actions Made Easy</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Different Section - Power Enhanced */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-copper-900/45 via-emerald-900/35 to-copper-900/45 backdrop-blur-sm border-b border-copper-500/10">
        {/* Accent - grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-copper-600/8 via-gold-500/12 to-copper-600/8"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full flex items-center justify-center mb-6 mx-auto border border-copper-400/40 shadow-power-3xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8">
              Why This Isn't Just Another App
            </h2>
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-copper-500 to-gold-500 mb-12">
              We're Built Different
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 text-center border-0 shadow-power-3xl glass-copper rounded-3xl hover:shadow-power-4xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">No toxic positivity</h4>
              <p className="text-gray-200 leading-relaxed font-light">Real relationships have rough patches, and that's normal</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-power-3xl glass-copper rounded-3xl hover:shadow-power-4xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Actually personalized</h4>
              <p className="text-gray-200 leading-relaxed font-light">Not horoscope-level generic advice</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-power-3xl glass-copper rounded-3xl hover:shadow-power-4xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Designed for busy humans</h4>
              <p className="text-gray-200 leading-relaxed font-light">Quick daily insights that fit into your actual life</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-power-3xl glass-copper rounded-3xl hover:shadow-power-4xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <h4 className="text-xl font-light text-white mb-3">Privacy first</h4>
              <p className="text-gray-200 leading-relaxed font-light">Your relationship details stay between you, your partner, and our very secure servers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Power Enhanced */}
      <section className="px-6 py-20 relative bg-gradient-to-br from-emerald-900/35 via-copper-900/35 to-emerald-900/35 backdrop-blur-sm">
        {/* Accent - power radiating circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <div className="w-96 h-96 border border-copper-400/40 rounded-full animate-pulse shadow-copper-glow"></div>
          <div className="absolute w-80 h-80 border border-gold-400/30 rounded-full animate-pulse shadow-gold-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-64 h-64 border border-copper-400/20 rounded-full animate-pulse shadow-power-3xl" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600/8 via-copper-600/8 to-gold-600/8"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Header with Power Icon */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full flex items-center justify-center mb-8 mx-auto border border-copper-400/40 shadow-power-4xl animate-power-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8 leading-tight">
              For People Who Actually Want to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-copper-500 to-gold-500"> Get Better at Love</span>
            </h2>
          </div>

          {/* Main Content in Power Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left Card - Reality Check */}
            <Card className="p-8 border-0 shadow-power-3xl glass-copper rounded-3xl hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="w-16 h-16 glass-copper rounded-full flex items-center justify-center mb-6 mx-auto border border-copper-400/40">
                <MessageSquare className="w-8 h-8 text-copper-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">The Reality</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                Let's be honest. Relationships today are <strong>complicated as hell</strong>. We're dealing with <strong>dating apps</strong> that make everyone feel replaceable, <strong>social media</strong> that shows us everyone else's highlight reel, and a world that moves so fast we barely have time to actually connect. Add in different <strong>love languages</strong>, <strong>attachment styles</strong>, and the fact that <strong>nobody taught us</strong> how to actually do relationships, and it's no wonder so many couples feel lost.
              </p>
            </Card>

            {/* Right Card - What We Believe */}
            <Card className="p-8 border-0 shadow-power-3xl glass-gold rounded-3xl hover:shadow-power-4xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
              <div className="w-16 h-16 glass-gold rounded-full flex items-center justify-center mb-6 mx-auto border border-gold-400/40">
                <Users className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Our Philosophy</h3>
              <p className="text-gray-200 leading-relaxed font-light">
                We believe the best relationships aren't about <strong>perfection</strong>—they're about <strong>two people</strong> who keep choosing to understand each other better while building something that works for your actual lives. Not <strong>Instagram perfect</strong>, but <strong>real-life strong</strong>. Not <strong>conflict-free</strong>, but <strong>conflict-smart</strong>. Not always easy, but always <strong>worth it</strong>.
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-light text-white mb-8">Ready to Love Smarter?</h3>
            <Link to="/dashboard">
              <Button className="power-button text-white px-12 py-8 text-xl rounded-full font-light mb-6">
                Create Your Profile
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          {/* Fine Print Section - Power Enhanced */}
          <div className="glass-emerald p-8 rounded-3xl shadow-power-3xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 glass-copper rounded-full flex items-center justify-center border border-copper-400/40">
                <Heart className="w-4 h-4 text-copper-400" />
              </div>
              <h4 className="text-xl font-light text-white">The Fine Print (But Make It Friendly)</h4>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 glass-copper rounded-full flex items-center justify-center mb-3 mx-auto border border-copper-400/40">
                  <span className="text-copper-400 font-bold">$</span>
                </div>
                <p className="text-gray-200 font-light">Free to start, always</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center mb-3 mx-auto border border-gold-400/40">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                </div>
                <p className="text-gray-200 font-light">Premium features for when you want to go deeper</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 glass-copper rounded-full flex items-center justify-center mb-3 mx-auto border border-copper-400/40">
                  <Users className="w-5 h-5 text-copper-400" />
                </div>
                <p className="text-gray-200 font-light">Built by people who are also figuring out love</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center mb-3 mx-auto border border-gold-400/40">
                  <Heart className="w-5 h-5 text-gold-500" />
                </div>
                <p className="text-gray-200 font-light">No judgment, just better tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Try It Now Button - Power Enhanced */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <Link to="/dashboard">
            <Button className="power-button text-white px-6 py-4 rounded-full backdrop-blur-sm border border-gold-400/30">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Footer - Power Enhanced */}
      <footer className="px-6 py-16 bg-black/60 backdrop-blur-sm relative border-t border-copper-400/15">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-copper-500 to-gold-500 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-copper-400/30 shadow-power-3xl">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-light text-white">RealTalk</span>
          </div>
          <p className="text-gray-200 font-light text-lg">Finally, an app that gets your relationship.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
