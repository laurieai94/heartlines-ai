
import { Sparkles } from "lucide-react";

const RealTalkSection = () => {
  return (
    <section className="px-6 py-20 relative bg-black border-y border-white/10">
      {/* Clean background with subtle electric hints */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-electric-blue/2 to-black"></div>
      
      {/* Electric accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-purple/40 to-transparent"></div>
      
      {/* Side accent elements */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-blue/30 to-electric-purple/30"></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-electric-purple/30 to-electric-blue/30"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Problem Setup Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/5 backdrop-blur-lg rounded-full px-8 py-3 mb-8 border border-white/20">
            <span className="text-white font-light tracking-wide">The Real Talk</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-thin text-white mb-8 leading-tight">
            You mastered the swipe.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-electric-blue mt-3 text-4xl lg:text-5xl">
              Now master the relationship.
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-2xl text-gray-100 leading-relaxed font-light">
              Dating apps solved "how do I meet someone?" But they left us hanging on everything that comes after.
            </p>
            <p className="text-xl text-white/80 leading-relaxed font-light">
              Like how to fight without breaking up, or how to keep things interesting when you've seen each other's Netflix queue.
            </p>
          </div>
        </div>

        {/* Visual Separator with Electric Icon */}
        <div className="relative flex items-center justify-center mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent"></div>
          <div className="absolute bg-gradient-to-r from-electric-blue to-electric-purple rounded-full p-4 shadow-lg border border-electric-blue/40">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Solution Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8 flex items-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-lg flex items-center justify-center min-h-[300px]">
              <h3 className="text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-electric-blue to-electric-purple text-center leading-tight">
                Enter RealTalk.
              </h3>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 flex items-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg">
              <div className="space-y-6">
                <p className="text-lg text-white leading-relaxed font-light">
                  We built this because we got tired of relationship advice that sounds like it came from a self-help book written in 1987.
                </p>
                <p className="text-lg text-gray-100 leading-relaxed font-light">
                  Our AI helps you navigate the stuff that actually matters—like figuring out why you both get weird about dishes, or how to talk about money without it turning into World War III.
                </p>
                <p className="text-lg text-gray-100 leading-relaxed font-light">
                  Because good relationships aren't about avoiding problems. They're about two people who get better at solving them together.
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
