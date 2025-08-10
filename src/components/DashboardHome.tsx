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
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-400/5 via-pink-500/5 to-purple-500/5" style={{ animationDelay: '1s' }}></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-border/50 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div 
                className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-lg rounded-full px-6 py-3 border border-primary/20 transition-transform duration-300"
                style={{
                  transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground/80">Finally, an app that gets your relationship</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your relationship isn't a rom-com.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Real growth needs real tools.
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
              </p>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started - It's Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Phone Mockup */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="relative w-72 h-96 bg-card rounded-3xl p-3 shadow-2xl border border-border">
                  <div className="w-full h-full bg-gradient-to-b from-background to-muted rounded-2xl overflow-hidden relative">
                    {/* Phone Header */}
                    <div className="flex justify-between items-center px-6 py-3 text-foreground text-sm">
                      <span>9:41 AM</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-foreground rounded-sm"></div>
                        <div className="w-4 h-2 bg-foreground/70 rounded-sm"></div>
                        <div className="w-4 h-2 bg-foreground/40 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">RealTalk</h2>
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Profile Card */}
                    <div className="px-6 pb-6 flex-1">
                      <div 
                        key={currentProfile}
                        className="bg-card/50 backdrop-blur-md rounded-2xl p-4 h-60 relative border border-border/50"
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden mb-3 border border-border/30">
                          <img 
                            src={datingProfiles[currentProfile].photo} 
                            alt={datingProfiles[currentProfile].name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-foreground">
                          <h3 className="text-lg font-medium mb-1">
                            {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">{datingProfiles[currentProfile].bio}</p>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                          <div className="w-10 h-10 bg-destructive/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-destructive/30">
                            <span className="text-destructive text-lg">✕</span>
                          </div>
                          <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30">
                            <Heart className="w-4 h-4 text-primary" />
                          </div>
                          <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 animate-pulse">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-secondary/30 animate-pulse" style={{ animationDelay: '1s' }}>
                  <MessageCircle className="w-5 h-5 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/dashboard/profile')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Build Your Profile</h3>
            <p className="text-muted-foreground text-sm">Create detailed profiles for you and your partner to get personalized insights.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:border-secondary/40 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/dashboard/coach')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Coach</h3>
            <p className="text-muted-foreground text-sm">Get personalized relationship insights and advice tailored to your unique situation.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:border-accent/40 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/dashboard/practice')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Practice Conversations</h3>
            <p className="text-muted-foreground text-sm">Practice difficult conversations in a safe environment before the real thing.</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-br from-coral-400/10 to-pink-500/10 border-coral-400/20 hover:border-coral-400/40 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/dashboard/actions')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Thoughtful Actions</h3>
            <p className="text-muted-foreground text-sm">Discover meaningful ways to show love and strengthen your connection.</p>
          </Card>
        </section>

        {/* Value Proposition */}
        <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-border/50">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Dating apps taught us how to swipe.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
                Now what?
              </span>
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-lg text-muted-foreground">
                Nobody prepared us for the actual relationship part. You know—the daily stuff.
              </p>
              <p className="text-foreground/80">
                Like how to fight without losing your minds—or expecting mind-reading.
              </p>
            </div>

            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;