
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 relative overflow-hidden">
      {/* Floating organic shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-60">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full blur-xl"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-40">
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-full blur-2xl"></div>
      </div>

      {/* Flowing line decorations */}
      <div className="absolute top-32 left-20 w-96 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
      <div className="absolute bottom-40 right-32 w-80 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>

      {/* Navigation */}
      <nav className="px-6 py-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-4 h-4 text-pink-600" />
            </div>
            <span className="text-xl font-bold text-white font-sans">LoveBetter</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">Home</span>
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">About</span>
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">Product</span>
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">Service</span>
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">Contact</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/90 hover:text-white transition-colors cursor-pointer font-medium">Sign Up</span>
            <Button className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 px-6 py-2 rounded-full">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight font-sans">
                Where Understanding
                <span className="block"> Meets Connection</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed font-light max-w-lg">
                The relationship companion that learns who you are, understands your partner, and guides you both toward deeper emotional intelligence and meaningful connection.
              </p>
              
              <Button className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 px-10 py-7 text-lg rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
                Read more
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
            
            {/* Visual Element */}
            <div className="relative">
              <div className="relative">
                {/* Flowing decorative lines */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 400 400">
                  <path
                    d="M50,200 Q200,50 350,200 Q200,350 50,200"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="10,5"
                  />
                  <path
                    d="M100,150 Q250,100 300,250"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                </svg>
                
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 h-96 flex items-center justify-center border border-white/20">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">AI That Knows You</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Personalized insights based on your unique relationship profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-sans">
              Built on Deep Understanding
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Our AI creates detailed profiles that capture your communication style, love languages, and emotional patterns—then provides guidance that's uniquely yours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/20">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-sans">Profile Building</h3>
              <p className="text-white/80 leading-relaxed font-light">
                Create rich profiles capturing your love languages, communication preferences, and what makes you feel most supported.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/20">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-sans">Personalized Insights</h3>
              <p className="text-white/80 leading-relaxed font-light">
                Receive daily suggestions tailored to your partner's needs, mood, and current life circumstances.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/20">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-sans">Conversation Practice</h3>
              <p className="text-white/80 leading-relaxed font-light">
                Practice difficult conversations with AI that understands both your communication styles.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/20">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform border border-white/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-sans">Thoughtful Actions</h3>
              <p className="text-white/80 leading-relaxed font-light">
                Get specific, meaningful suggestions based on your partner's current mood and preferences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-1 shadow-2xl border border-white/20">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6 font-sans">
                    Personal AI Guidance
                  </h2>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed font-light">
                    See how our AI provides insights based on your unique relationship profiles.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <h4 className="font-bold text-white mb-3 text-lg">For Sarah (Words of Affirmation)</h4>
                      <p className="text-white/80 leading-relaxed">
                        "Since Sarah mentioned her big presentation today, she'd appreciate hearing specific praise about her preparation and hard work. Try: 'I'm so proud of how thoroughly you prepared for today.'"
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                      <h4 className="font-bold text-white mb-3 text-lg">For Alex (Quality Time)</h4>
                      <p className="text-white/80 leading-relaxed">
                        "Alex has been working late this week. Tonight, suggest a phone-free dinner together. Even 30 minutes of undivided attention will help them feel connected."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Relationship Intelligence</h3>
                      <p className="text-white/80 leading-relaxed">
                        Every suggestion is personalized based on your detailed profiles, current circumstances, and relationship history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-sans leading-tight">
            Ready for AI that truly
            <span className="block"> understands your relationship?</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Start building your profiles today. The more we learn about you both, the better we can help you love with intention.
          </p>
          
          <Button className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 px-12 py-8 text-xl rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 mb-8">
            Begin Your Journey
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <p className="text-sm text-white/70 font-light">Free to start • Built for real relationships</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-white/5 backdrop-blur-sm relative border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-sans">LoveBetter</span>
          </div>
          <p className="text-white/80 font-light text-lg">Where understanding meets connection.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
