
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
          <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-blue/40">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
            How It Actually Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-0 shadow-lg bg-white/5 backdrop-blur-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">We Learn Your Relationship (For Real)</h3>
            <p className="text-gray-100 leading-relaxed font-light">
              Not just surface-level stuff, but the real dynamics. How do you each handle stress? What makes you feel most loved? What are your actual deal-breakers vs. the ones you think you should have?
            </p>
          </Card>

          <Card className="p-8 border-0 shadow-lg bg-white/5 backdrop-blur-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-electric-purple/40 to-electric-blue/40 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-purple/40">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Daily Insights That Don't Suck</h3>
            <p className="text-gray-100 leading-relaxed font-light">
              No more "just communicate better" advice. Get specific, actionable insights about your actual relationship patterns—plus suggestions for what to try differently.
            </p>
          </Card>
          
          <Card className="p-8 border-0 shadow-lg bg-white/5 backdrop-blur-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-blue/40">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Practice the Hard Conversations</h3>
            <p className="text-gray-100 leading-relaxed font-light">
              Need to talk about something tricky? Practice with our AI first. It knows both your communication styles, so you can figure out the best approach before the actual conversation.
            </p>
          </Card>
          
          <Card className="p-8 border-0 shadow-lg bg-white/5 backdrop-blur-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl group border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-electric-purple/40 to-electric-blue/40 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-electric-purple/40">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">Personalized Relationship Moves</h3>
            <p className="text-gray-100 leading-relaxed font-light">
              Get specific ideas for making your partner's day better—based on their actual love language and preferences, not some generic romance checklist.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
