
import { Sparkles } from "lucide-react";

const RealTalkSection = () => {
  return (
    <section className="px-6 py-24 relative bg-gradient-to-br from-graphite/60 via-dark-gray/40 to-graphite/60">
      {/* Reduced background complexity */}
      <div className="absolute inset-0 bg-gradient-to-r from-rich-black/10 via-electric-blue/5 to-rich-black/10"></div>
      
      {/* Simplified accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-purple/30 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Problem Setup Section with better hierarchy */}
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-electric-blue/20 to-electric-purple/20 backdrop-blur-lg rounded-full px-8 py-4 mb-8 border border-electric-blue/30">
            <span className="text-white font-semibold tracking-wide text-lg">The Reality Check</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight text-shadow-strong">
            You mastered the swipe.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan mt-4 text-4xl lg:text-6xl text-shadow-electric">
              Now what?
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-2xl lg:text-3xl text-white/90 leading-relaxed font-medium text-shadow-electric">
              Nobody prepared you for the actual relationship part.
            </p>
            <p className="text-xl lg:text-2xl text-warm-white/80 leading-relaxed font-normal">
              The daily conversations. The real conflicts. The mind-reading expectations.
            </p>
          </div>
        </div>

        {/* Enhanced Visual Separator */}
        <div className="relative flex items-center justify-center mb-20">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
          <div className="absolute bg-gradient-to-r from-electric-blue to-electric-purple rounded-full p-6 shadow-elegant border border-electric-blue/40 animate-subtle-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Solution Section with improved contrast */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column */}
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-electric-blue/15 via-electric-purple/10 to-electric-blue/15 backdrop-blur-xl rounded-3xl p-12 border border-electric-blue/25 shadow-elegant min-h-[300px] flex items-center justify-center">
              <h3 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-electric-blue to-electric-purple text-center leading-tight text-shadow-electric">
                Enter RealTalk.
              </h3>
            </div>
          </div>

          {/* Right Column with punchy copy */}
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-graphite/30 via-electric-blue/8 to-graphite/30 backdrop-blur-xl rounded-3xl p-10 border border-electric-blue/20 shadow-elegant">
              <div className="space-y-8">
                <p className="text-xl text-white/90 leading-relaxed font-medium text-shadow-electric">
                  Most relationship tools tell you what's wrong. We teach you how to fix it.
                </p>
                <p className="text-lg text-warm-white/85 leading-relaxed font-normal">
                  Our AI helps you master the conversations you've been avoiding and build patterns that actually stick.
                </p>
                <p className="text-lg text-warm-white/85 leading-relaxed font-normal">
                  Because great relationships aren't built on hope. They're built on two people who get better at love together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTalkSection;
