
import { Sparkles } from "lucide-react";

const RealTalkSection = () => {
  return (
    <section className="px-6 py-20 relative bg-gradient-to-br from-graphite/40 via-dark-gray/30 to-graphite/40 backdrop-blur-sm border-y border-warm-white/10">
      {/* Enhanced Background Effects with Electric Hints */}
      <div className="absolute inset-0 bg-gradient-to-r from-rich-black/8 via-electric-blue/3 to-rich-black/8"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.06),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(128,0,255,0.04),transparent_50%)]"></div>
      
      {/* Enhanced Accent Lines with Electric Colors */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-purple/40 to-transparent"></div>
      
      {/* Enhanced Side Accent Elements */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-blue/30 to-neon-cyan/30"></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-purple/30 to-electric-blue/30"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Problem Setup Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-graphite/40 to-electric-blue/15 backdrop-blur-lg rounded-full px-8 py-3 mb-8 border border-electric-blue/25">
            <span className="text-warm-white font-light tracking-wide">The Real Talk</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-thin text-warm-white mb-8 leading-tight">
            Dating apps taught us how to swipe.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan mt-3 text-4xl lg:text-5xl">
              Now what?
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-2xl text-medium-gray leading-relaxed font-light">
              Nobody prepared us for the actual relationship part. You know—the daily stuff.
            </p>
            <p className="text-xl text-soft-gray leading-relaxed font-light">
              Like how to fight without losing your minds—or expecting mind-reading.
            </p>
          </div>
        </div>

        {/* Enhanced Visual Separator with Electric Icon */}
        <div className="relative flex items-center justify-center mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
          <div className="absolute bg-gradient-to-r from-electric-blue to-electric-purple rounded-full p-4 shadow-elegant border border-electric-blue/40 neon-glow-blue">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Solution Section - Enhanced with Electric Accent */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Better balanced */}
          <div className="space-y-8 flex items-center">
            <div className="bg-gradient-to-br from-graphite/30 via-electric-blue/5 to-graphite/30 backdrop-blur-xl rounded-3xl p-12 border border-electric-blue/20 shadow-elegant flex items-center justify-center min-h-[300px]">
              <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-electric-blue to-electric-purple text-center leading-tight">
                Enter RealTalk.
              </h3>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 flex items-center">
            <div className="bg-gradient-to-br from-dark-gray/20 via-electric-blue/3 to-dark-gray/20 backdrop-blur-xl rounded-3xl p-8 border border-electric-blue/15 shadow-elegant">
              <div className="space-y-6">
                <p className="text-lg text-soft-gray leading-relaxed font-light">
                  We built this because most relationship tools just tell you what's wrong without teaching you how to actually fix it.
                </p>
                <p className="text-lg text-medium-gray leading-relaxed font-light">
                  Our AI helps you do the real work—having those conversations you've been avoiding, understanding why you both react the way you do, and building new patterns that actually stick.
                </p>
                <p className="text-lg text-medium-gray leading-relaxed font-light">
                  Because great relationships aren't built on hoping things get easier. They're built on two people who get better at doing the hard things together.
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
