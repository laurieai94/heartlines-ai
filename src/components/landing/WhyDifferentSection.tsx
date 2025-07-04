
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const WhyDifferentSection = () => {
  return (
    <section className="px-6 py-20 relative bg-black border-b border-white/5">
      {/* Clean grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-6 mx-auto electric-border electric-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8">
            Why This Isn't Just Another App
          </h2>
          <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple mb-12">
            We're Built Different
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 text-center border-0 shadow-elegant bg-black/60 backdrop-blur-sm rounded-3xl electric-border hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <h4 className="text-xl font-light text-white mb-3">No toxic positivity</h4>
            <p className="text-gray-300 leading-relaxed font-light">Real relationships have rough patches, and that's normal</p>
          </Card>
          
          <Card className="p-6 text-center border-0 shadow-elegant bg-black/60 backdrop-blur-sm rounded-3xl border border-electric-purple/30 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <h4 className="text-xl font-light text-white mb-3">Actually personalized</h4>
            <p className="text-gray-300 leading-relaxed font-light">Not horoscope-level generic advice</p>
          </Card>
          
          <Card className="p-6 text-center border-0 shadow-elegant bg-black/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <h4 className="text-xl font-light text-white mb-3">Designed for busy humans</h4>
            <p className="text-gray-300 leading-relaxed font-light">Quick daily insights that fit into your actual life</p>
          </Card>
          
          <Card className="p-6 text-center border-0 shadow-elegant bg-black/60 backdrop-blur-sm rounded-3xl electric-border hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            <h4 className="text-xl font-light text-white mb-3">Privacy first</h4>
            <p className="text-gray-300 leading-relaxed font-light">Your relationship details stay between you, your partner, and our very secure servers</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
