
import { Card } from "@/components/ui/card";
import { Target, Brain, MessageCircle, Sparkles } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="px-6 py-20 relative bg-black border-b border-white/5">
      {/* Clean connecting lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-purple/30 to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-6 mx-auto electric-border shadow-elegant">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
            How It Actually Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-0 shadow-elegant bg-black/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group electric-border">
            <div className="w-20 h-20 bg-electric-blue/20 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform electric-border">
              <Brain className="w-10 h-10 text-electric-blue" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">We Get to Know You (For Real)</h3>
            <p className="text-gray-300 leading-relaxed font-light">
              Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help.
            </p>
          </Card>

          <Card className="p-8 border-0 shadow-elegant bg-black/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-electric-purple/30">
            <div className="w-20 h-20 bg-electric-purple/20 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform border border-electric-purple/40">
              <Target className="w-10 h-10 text-electric-purple" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Daily Tips You'll Actually Use</h3>
            <p className="text-gray-300 leading-relaxed font-light">
              Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now.
            </p>
          </Card>
          
          <Card className="p-8 border-0 shadow-elegant bg-black/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-white/20">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform border border-white/30">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Practice Makes Progress</h3>
            <p className="text-gray-300 leading-relaxed font-light">
              Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama.
            </p>
          </Card>
          
          <Card className="p-8 border-0 shadow-elegant bg-black/60 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group electric-border">
            <div className="w-20 h-20 bg-gradient-to-r from-electric-blue/20 to-electric-purple/20 rounded-full flex items-center justify-center mb-6 shadow-elegant group-hover:scale-110 transition-transform electric-border">
              <Sparkles className="w-10 h-10 text-electric-blue" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Thoughtful Actions Made Easy</h3>
            <p className="text-gray-300 leading-relaxed font-light">
              Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic."
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
