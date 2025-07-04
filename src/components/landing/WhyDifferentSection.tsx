
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const WhyDifferentSection = () => {
  return (
    <section className="px-6 py-24 relative bg-gradient-to-br from-graphite/80 via-dark-gray/60 to-graphite/80">
      {/* Simplified background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-gradient-to-r from-electric-blue/80 to-electric-purple/80 rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40 shadow-elegant animate-subtle-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-strong">
            Why We're Different
          </h2>
          <h3 className="text-2xl lg:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan mb-8 text-shadow-electric">
            No BS. Just Better Love.
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 lg:p-10 text-center border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/20 hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-electric-blue/30 group">
            <h4 className="text-xl lg:text-2xl font-bold text-white mb-4 text-shadow-electric">Zero Toxic Positivity</h4>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">Real relationships have rough patches. We help you work through them, not pretend they don't exist.</p>
          </Card>
          
          <Card className="p-8 lg:p-10 text-center border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-purple/20 hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-electric-purple/30 group">
            <h4 className="text-xl lg:text-2xl font-bold text-white mb-4 text-shadow-electric">Actually Personalized</h4>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">Skip horoscope-level generic advice. Get tools built for your actual relationship.</p>
          </Card>
          
          <Card className="p-8 lg:p-10 text-center border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-neon-cyan/20 hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-neon-cyan/30 group">
            <h4 className="text-xl lg:text-2xl font-bold text-white mb-4 text-shadow-electric">Built for Busy Humans</h4>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">Quick daily insights that fit your real life. No hour-long therapy sessions required.</p>
          </Card>
          
          <Card className="p-8 lg:p-10 text-center border-0 shadow-elegant bg-gradient-to-br from-warm-white/8 to-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/20 hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:border-electric-blue/30 group">
            <h4 className="text-xl lg:text-2xl font-bold text-white mb-4 text-shadow-electric">Privacy First</h4>
            <p className="text-warm-white/85 leading-relaxed font-normal text-lg">Your relationship details stay between you, your partner, and our secure servers. Period.</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
