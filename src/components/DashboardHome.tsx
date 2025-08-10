import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain, Lightbulb } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { useState, useEffect } from "react";

const DashboardHome = () => {
  const { goToProfile, goToCoach } = useNavigation();
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

    const profileTimer = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % datingProfiles.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(profileTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full bg-gradient-to-br from-background via-background/95 to-background/90 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 animate-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/3 via-primary/3 to-accent/3 animate-gradient" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
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

        <div className="relative z-10 px-6 py-12">
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div 
                  className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-primary/20 shadow-lg transition-transform duration-300"
                  style={{
                    transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`
                  }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                  <span className="text-sm font-light text-foreground/80 tracking-wide">Welcome back to RealTalk</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-thin text-foreground mb-6 leading-tight">
                  Your relationship isn't a rom-com.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Real growth needs real tools.
                  </span>
                </h1>
                
                <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed font-light">
                  We're tired of relationship advice that sounds like it was written in 1995. RealTalk gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={goToProfile}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Build Your Profile
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                  
                  <Button 
                    onClick={goToCoach}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    Get AI Coach
                    <Brain className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </div>
              
              {/* Phone with Dating App */}
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-64 h-[480px] bg-background rounded-[2rem] p-2 shadow-2xl border border-border">
                    {/* Phone Screen */}
                    <div className="w-full h-full bg-gradient-to-b from-muted/50 to-background rounded-[1.5rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-4 py-2 text-foreground text-xs">
                        <span>9:41 AM</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-1.5 bg-foreground rounded-sm"></div>
                          <div className="w-3 h-1.5 bg-foreground/70 rounded-sm"></div>
                          <div className="w-3 h-1.5 bg-foreground/40 rounded-sm"></div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="px-4 pb-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">RealTalk</h2>
                          <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Dating Profile Card */}
                      <div className="px-4 pb-4 flex-1">
                        <div 
                          key={currentProfile}
                          className="bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md rounded-2xl p-4 h-72 relative border border-border/60 animate-fade-in"
                        >
                          {/* Profile Photo */}
                          <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden mb-3 border border-border/40">
                            <img 
                              src={datingProfiles[currentProfile].photo} 
                              alt={datingProfiles[currentProfile].name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Profile Info */}
                          <div className="text-foreground">
                            <h3 className="text-lg font-light mb-1">
                              {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                            </h3>
                            <p className="text-muted-foreground text-xs mb-3">{datingProfiles[currentProfile].bio}</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                            <div className="w-8 h-8 bg-destructive/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-destructive/30">
                              <span className="text-destructive text-sm">✕</span>
                            </div>
                            <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30">
                              <Heart className="w-3 h-3 text-primary" />
                            </div>
                            <div className="w-8 h-8 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-accent/30">
                              <MessageCircle className="w-3 h-3 text-accent" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Dots */}
                      <div className="flex justify-center gap-1 pb-4">
                        {datingProfiles.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              index === currentProfile ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Phone Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-foreground/20 rounded-full"></div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 animate-pulse">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-accent/30 animate-pulse" style={{ animationDelay: '1s' }}>
                    <MessageCircle className="w-4 h-4 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-12">
              <div className="inline-block bg-primary/10 backdrop-blur-lg rounded-full px-6 py-2 mb-6 border border-primary/20">
                <span className="text-primary font-light tracking-wide">What makes us different</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-thin text-foreground mb-4 leading-tight">
                Dating apps taught us how to swipe.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2 text-2xl lg:text-3xl">
                  Now what?
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/60 hover:bg-card/90 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Real Relationship Dynamics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We analyze both partners' personalities, communication styles, and attachment patterns to give you personalized advice that actually works.
                </p>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/60 hover:bg-card/90 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">AI That Gets Context</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI coach understands your unique situation, relationship history, and communication patterns to provide relevant, actionable guidance.
                </p>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/60 hover:bg-card/90 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Practice Real Conversations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rehearse difficult conversations, practice vulnerability, and build confidence with scenarios tailored to your relationship challenges.
                </p>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-lg rounded-3xl p-12 border border-primary/20 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-thin text-foreground mb-6 leading-tight">
                Ready to level up your relationship?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light max-w-2xl mx-auto">
                Start with your profile to get personalized insights, or jump straight into practicing conversations. Your relationship deserves better than generic advice.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={goToProfile}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 text-lg rounded-full shadow-xl transition-all duration-300"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  onClick={goToCoach}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  Talk to AI Coach
                  <Lightbulb className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;