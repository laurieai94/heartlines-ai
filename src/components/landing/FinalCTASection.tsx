
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowRight, MessageSquare, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="px-6 py-24 relative bg-gradient-to-br from-dark-gray/60 via-graphite/60 to-dark-gray/60">
      {/* Simplified background effects */}
      <div className="absolute inset-0 flex items-center justify-center opacity-8">
        <div className="w-80 h-80 border border-electric-blue/20 rounded-full animate-electric-pulse"></div>
        <div className="absolute w-64 h-64 border border-electric-purple/15 rounded-full animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Enhanced Header */}
        <div className="mb-16">
          <div className="w-24 h-24 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40 shadow-elegant animate-subtle-glow">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight text-shadow-strong">
            Ready to Love
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan text-shadow-electric"> Smarter?</span>
          </h2>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Card - Reality Check */}
          <Card className="p-10 lg:p-12 border-0 shadow-elegant bg-gradient-to-br from-warm-white/10 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:border-electric-blue/30">
            <div className="w-20 h-20 bg-gradient-to-r from-electric-blue/30 to-electric-purple/30 rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">The Reality</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              Modern love is <strong className="text-white font-semibold">complicated</strong>. Dating apps made everyone feel replaceable. Social media shows highlight reels. We move too fast to actually connect. Nobody taught us how relationships actually work.
            </p>
          </Card>

          {/* Right Card - Our Philosophy */}
          <Card className="p-10 lg:p-12 border-0 shadow-elegant bg-gradient-to-br from-warm-white/10 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-purple/20 hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:border-electric-purple/30">
            <div className="w-20 h-20 bg-gradient-to-r from-electric-purple/30 to-neon-cyan/30 rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-purple/40">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">Our Promise</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              Great relationships aren't <strong className="text-white font-semibold">perfect</strong>—they're <strong className="text-white font-semibold">real</strong>. Two people choosing to understand each other better. Not Instagram perfect, but real-life strong.
            </p>
          </Card>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mb-16">
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/90 hover:to-electric-purple/90 text-white px-16 py-10 text-2xl font-bold rounded-full shadow-elegant hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-electric-blue/40 animate-subtle-glow">
              Start Your Journey
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </Link>
        </div>
        
        {/* Enhanced Fine Print */}
        <div className="bg-gradient-to-r from-electric-blue/10 via-electric-purple/8 to-electric-blue/10 backdrop-blur-lg p-10 rounded-3xl border border-electric-blue/25">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-electric-blue/50 to-electric-purple/50 rounded-full flex items-center justify-center border border-electric-blue/40">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white text-shadow-electric">No BS, Just Better Love</h4>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto border border-electric-blue/30">
                <span className="text-electric-blue font-bold text-2xl">$</span>
              </div>
              <p className="text-white/90 font-medium text-lg">Free to start</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-purple/25 to-electric-blue/25 rounded-full flex items-center justify-center mb-4 mx-auto border border-electric-purple/35">
                <Sparkles className="w-7 h-7 text-electric-purple" />
              </div>
              <p className="text-white/90 font-medium text-lg">Premium for deeper work</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mb-4 mx-auto border border-neon-cyan/30">
                <Users className="w-7 h-7 text-neon-cyan" />
              </div>
              <p className="text-white/90 font-medium text-lg">Built by real humans</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-electric-blue/25 to-electric-purple/25 rounded-full flex items-center justify-center mb-4 mx-auto border border-electric-blue/35">
                <Heart className="w-7 h-7 text-electric-blue" />
              </div>
              <p className="text-white/90 font-medium text-lg">Zero judgment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
