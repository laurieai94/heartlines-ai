
import { Card } from "@/components/ui/card";
import { Target, Brain, MessageCircle, Sparkles } from "lucide-react";

const HowItWorksSection = () => {
  return (
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
  );
};

export default HowItWorksSection;
