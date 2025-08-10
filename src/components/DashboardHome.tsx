import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DashboardHome = () => {
  const navigate = useNavigate();
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
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Rotate profiles every 3 seconds
    const profileTimer = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % datingProfiles.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(profileTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div className="min-h-full bg-black relative overflow-hidden">
      {/* Animated Holographic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-coral-500/20 to-purple-900/30 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-400/10 via-pink-500/10 to-purple-500/10 animate-gradient" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-600/10 via-coral-400/10 to-purple-600/10 animate-gradient" style={{ animationDelay: '2s' }}></div>

      {/* Floating Particles */}
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

      {/* Floating Geometric Shapes */}
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

      {/* Code-like Background Elements */}
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

      <div className="relative z-10 p-6 space-y-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-coral-900/30 via-pink-900/20 to-purple-900/30 rounded-3xl p-8 border border-coral-300/20 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div 
                className="inline-flex items-center gap-3 bg-coral-500/10 backdrop-blur-lg rounded-full px-6 py-3 border border-coral-300/30 transition-transform duration-300"
                style={{
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-light text-white/90 tracking-wide">Finally, an app that gets your relationship</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-thin text-white leading-tight">
                Your relationship isn't a rom-com.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                  Real growth needs real tools.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed font-light">
                We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
              </p>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm"
              >
                Get Started - It's Free
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
            
            {/* Phone Mockup */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-80 h-[600px] bg-black rounded-[2.5rem] p-3 shadow-2xl border border-gray-700">
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[2rem] overflow-hidden relative">
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
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-coral-400">RealSwipe</h2>
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-coral-400 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Dating Profile Card */}
                    <div className="px-6 pb-6 flex-1">
                      <div 
                        key={currentProfile}
                        className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 h-96 relative border border-white/20 animate-fade-in"
                      >
                        {/* Profile Photo */}
                        <div className="w-full h-48 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-2xl overflow-hidden mb-4 border border-white/10">
                          <img 
                            src={datingProfiles[currentProfile].photo} 
                            alt={datingProfiles[currentProfile].name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Profile Info */}
                        <div className="text-white">
                          <h3 className="text-2xl font-light mb-1">
                            {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4">{datingProfiles[currentProfile].bio}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4">
                          <div className="w-12 h-12 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/30">
                            <span className="text-red-400 text-xl">✕</span>
                          </div>
                          <div className="w-12 h-12 bg-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-pink-400/30">
                            <Heart className="w-5 h-5 text-pink-400" />
                          </div>
                          <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
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
                            index === currentProfile ? 'bg-pink-400' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phone Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-pink-400/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-pink-300/30 animate-pulse">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-coral-400/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-coral-300/30 animate-pulse" style={{ animationDelay: '1s' }}>
                  <MessageCircle className="w-6 h-6 text-coral-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="p-6 bg-gradient-to-b from-white/10 to-white/5 border-white/20 hover:border-coral-400/40 transition-all duration-300 cursor-pointer group backdrop-blur-md"
            onClick={() => navigate('/dashboard/profile')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Build Your Profile</h3>
            <p className="text-gray-300 text-sm">Create detailed profiles for you and your partner to get personalized insights.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-b from-white/10 to-white/5 border-white/20 hover:border-pink-400/40 transition-all duration-300 cursor-pointer group backdrop-blur-md"
            onClick={() => navigate('/dashboard/coach')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-coral-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">AI Coach</h3>
            <p className="text-gray-300 text-sm">Get personalized relationship insights and advice tailored to your unique situation.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-b from-white/10 to-white/5 border-white/20 hover:border-coral-400/40 transition-all duration-300 cursor-pointer group backdrop-blur-md"
            onClick={() => navigate('/dashboard/practice')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Practice Conversations</h3>
            <p className="text-gray-300 text-sm">Practice difficult conversations in a safe environment before the real thing.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-b from-white/10 to-white/5 border-white/20 hover:border-pink-400/40 transition-all duration-300 cursor-pointer group backdrop-blur-md"
            onClick={() => navigate('/dashboard/actions')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-coral-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Thoughtful Actions</h3>
            <p className="text-gray-300 text-sm">Discover meaningful ways to show love and strengthen your connection.</p>
          </Card>
        </section>

        {/* Value Proposition */}
        <section className="bg-gradient-to-r from-coral-500/8 via-pink-500/12 to-coral-500/8 rounded-3xl p-8 border border-coral-300/20 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-5xl lg:text-6xl font-thin text-white leading-tight">
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

            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm"
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;