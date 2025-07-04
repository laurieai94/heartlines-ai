
import { Card } from "@/components/ui/card";
import { Target, Brain, MessageCircle, Sparkles } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="px-6 py-24 relative bg-gradient-to-br from-rich-black/80 via-graphite/60 to-rich-black/80">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/8 via-electric-blue/4 to-graphite/8"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40 shadow-elegant animate-subtle-glow">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 text-shadow-strong">
            How It Actually Works
          </h2>
          <p className="text-xl text-warm-white/80 max-w-3xl mx-auto">
            No fluff. No generic advice. Just personalized tools that work.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-10 border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-3xl group border border-electric-blue/20 hover:border-electric-blue/30">
            <div className="w-24 h-24 bg-gradient-to-br from-electric-blue/30 to-electric-purple/30 rounded-full flex items-center justify-center mb-8 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">We Get to Know You (Actually)</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              How you communicate under stress, what makes you feel loved, your actual quirks. The more real you are, the better we help.
            </p>
          </Card>

          <Card className="p-10 border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-3xl group border border-electric-purple/20 hover:border-electric-purple/30">
            <div className="w-24 h-24 bg-gradient-to-br from-electric-purple/30 to-neon-cyan/30 rounded-full flex items-center justify-center mb-8 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-purple/40">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">Daily Actions That Matter</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              Skip "just communicate better." Get specific moves based on what's happening in your relationship right now.
            </p>
          </Card>
          
          <Card className="p-10 border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-3xl group border border-neon-cyan/20 hover:border-neon-cyan/30">
            <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan/30 to-electric-blue/30 rounded-full flex items-center justify-center mb-8 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-neon-cyan/40">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">Practice Hard Conversations</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              Scared to bring up that thing? Practice first. Know both your styles, nail the approach, skip the drama.
            </p>
          </Card>
          
          <Card className="p-10 border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-3xl group border border-electric-blue/20 hover:border-electric-blue/30">
            <div className="w-24 h-24 bg-gradient-to-br from-electric-blue/30 to-electric-purple/30 rounded-full flex items-center justify-center mb-8 shadow-elegant group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-shadow-electric">Thoughtful Actions Made Simple</h3>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">
              Get ideas that actually matter to your partner—based on their preferences, not random blog posts.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
