
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-red-50 relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-300/30 to-red-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Navigation */}
      <nav className="px-6 py-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-sans">LoveBetter</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="text-gray-700 hover:text-orange-600 transition-colors cursor-pointer">Home</span>
            <span className="text-gray-700 hover:text-orange-600 transition-colors cursor-pointer">About</span>
            <span className="text-gray-700 hover:text-orange-600 transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-orange-200/50 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700 tracking-wide">01 Purpose</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight font-sans">
                Where Understanding
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Meets Connection</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed font-light">
                The relationship companion that learns who you are, understands your partner, and guides you both toward deeper emotional intelligence.
              </p>
              
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0">
                Request Access
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
            
            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-sans">
              Built on Deep Understanding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Our AI creates detailed profiles that capture your communication style, love languages, and emotional patterns—then provides guidance that's uniquely yours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Profile Building</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Create rich profiles capturing your love languages, communication preferences, and what makes you feel most supported.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Personalized Insights</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Receive daily suggestions tailored to your partner's needs, mood, and current life circumstances.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Conversation Practice</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Practice difficult conversations with AI that understands both your communication styles.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Thoughtful Actions</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Get specific, meaningful suggestions based on your partner's current mood and preferences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6 font-sans">
                    Personal AI Guidance
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                    See how our AI provides insights based on your unique relationship profiles.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200/50">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">For Sarah (Words of Affirmation)</h4>
                      <p className="text-gray-700 leading-relaxed">
                        "Since Sarah mentioned her big presentation today, she'd appreciate hearing specific praise about her preparation and hard work. Try: 'I'm so proud of how thoroughly you prepared for today.'"
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200/50">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">For Alex (Quality Time)</h4>
                      <p className="text-gray-700 leading-relaxed">
                        "Alex has been working late this week. Tonight, suggest a phone-free dinner together. Even 30 minutes of undivided attention will help them feel connected."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 shadow-xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Relationship Intelligence</h3>
                      <p className="text-gray-700 leading-relaxed">
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
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-sans leading-tight">
            Ready for AI that truly
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> understands your relationship?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Start building your profiles today. The more we learn about you both, the better we can help you love with intention.
          </p>
          
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 mb-8">
            Begin Your Journey
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <p className="text-sm text-gray-500 font-light">Free to start • Built for real relationships</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gradient-to-r from-orange-100/50 to-red-100/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-sans">LoveBetter</span>
          </div>
          <p className="text-gray-600 font-light text-lg">Where understanding meets connection.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
