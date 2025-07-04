
import { Sparkles } from "lucide-react";

const RealTalkSection = () => {
  return (
    <section className="px-6 py-20 relative bg-black border-y border-white/10">
      {/* Clean background with subtle electric accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-electric-blue/2 to-black"></div>
      
      {/* Clean accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-purple/40 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Problem Setup Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-black/80 backdrop-blur-sm rounded-full px-8 py-3 mb-8 electric-border">
            <span className="text-white font-light tracking-wide">The Real Talk</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-thin text-white mb-8 leading-tight">
            You mastered the swipe.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple mt-3 text-4xl lg:text-5xl">
              Now master the relationship.
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-2xl text-gray-300 leading-relaxed font-light">
              Nobody prepared us for the actual relationship part. You know—the daily stuff.
            </p>
            <p className="text-xl text-white/80 leading-relaxed font-light">
              Like how to fight without losing your minds. Or communicate without expecting mind-reading.
            </p>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="relative flex items-center justify-center mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
          <div className="absolute bg-gradient-to-r from-electric-blue to-electric-purple rounded-full p-4 shadow-elegant electric-border">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Solution Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8 flex items-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-12 electric-border shadow-elegant flex items-center justify-center min-h-[300px]">
              <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-electric-blue to-electric-purple text-center leading-tight">
                Enter RealTalk.
              </h3>
            </div>
          </div>

          <div className="space-y-8 flex items-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-elegant">
              <div className="space-y-6">
                <p className="text-lg text-white leading-relaxed font-light">
                  We built this because most relationship tools just tell you what's wrong without teaching you how to actually fix it.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  Our AI helps you do the real work—having those conversations you've been avoiding, understanding why you both react the way you do, and building new patterns that actually stick.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
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
