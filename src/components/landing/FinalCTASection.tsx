
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowRight, MessageSquare, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="px-6 py-20 relative bg-gradient-to-br from-dark-gray/40 via-graphite/40 to-dark-gray/40 backdrop-blur-sm">
      {/* Enhanced accent - radiating circles with electric colors */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border border-electric-blue/30 rounded-full animate-electric-pulse"></div>
        <div className="absolute w-80 h-80 border border-electric-purple/20 rounded-full animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 border border-neon-cyan/15 rounded-full animate-electric-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/5 via-electric-blue/3 to-graphite/5"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Enhanced Header with Electric Heart Icon */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center mb-8 mx-auto border border-electric-blue/40 shadow-elegant neon-glow-blue">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-thin text-warm-white mb-8 leading-tight">
            For People Who Actually Want to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-electric-purple to-neon-cyan"> Get Better at Love</span>
          </h2>
        </div>

        {/* Enhanced Main Content in Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Card - Reality Check */}
          <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-blue/15 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 hover:border-electric-blue/25">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue/40 to-electric-purple/40 rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-blue/40">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-light text-warm-white mb-4">The Reality</h3>
            <p className="text-medium-gray leading-relaxed font-light">
              Let's be honest. Relationships today are <strong className="text-warm-white">complicated as hell</strong>. We're dealing with <strong className="text-warm-white">dating apps</strong> that make everyone feel replaceable, <strong className="text-warm-white">social media</strong> that shows us everyone else's highlight reel, and a world that moves so fast we barely have time to actually connect. Add in different <strong className="text-warm-white">love languages</strong>, <strong className="text-warm-white">attachment styles</strong>, and the fact that <strong className="text-warm-white">nobody taught us</strong> how to actually do relationships, and it's no wonder so many couples feel lost.
            </p>
          </Card>

          {/* Right Card - What We Believe */}
          <Card className="p-8 border-0 shadow-elegant bg-warm-white/5 backdrop-blur-lg rounded-3xl border border-electric-purple/15 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 hover:border-electric-purple/25">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-purple/40 to-neon-cyan/40 rounded-full flex items-center justify-center mb-6 mx-auto border border-electric-purple/40">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-light text-warm-white mb-4">Our Philosophy</h3>
            <p className="text-medium-gray leading-relaxed font-light">
              We believe the best relationships aren't about <strong className="text-warm-white">perfection</strong>—they're about <strong className="text-warm-white">two people</strong> who keep choosing to understand each other better while building something that works for your actual lives. Not <strong className="text-warm-white">Instagram perfect</strong>, but <strong className="text-warm-white">real-life strong</strong>. Not <strong className="text-warm-white">conflict-free</strong>, but <strong className="text-warm-white">conflict-smart</strong>. Not always easy, but always <strong className="text-warm-white">worth it</strong>.
            </p>
          </Card>
        </div>

        {/* Enhanced CTA Section with Electric Button */}
        <div className="mb-12">
          <h3 className="text-3xl font-light text-warm-white mb-8">Ready to Love Smarter?</h3>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-neon-blue hover:to-electric-purple text-white px-12 py-8 text-xl rounded-full shadow-elegant hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-electric-blue/40 mb-6 font-light neon-glow-blue">
              Create Your Profile
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
        
        {/* Enhanced Fine Print Section with Electric Accents */}
        <div className="bg-gradient-to-r from-graphite/20 via-electric-blue/8 to-graphite/20 backdrop-blur-lg p-8 rounded-3xl border border-electric-blue/20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue/50 to-electric-purple/50 rounded-full flex items-center justify-center border border-electric-blue/40">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-light text-warm-white">The Fine Print (But Make It Friendly)</h4>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-blue/15 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-blue/25">
                <span className="text-electric-blue font-bold">$</span>
              </div>
              <p className="text-medium-gray font-light">Free to start, always</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-electric-purple/20 to-electric-blue/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-purple/30">
                <Sparkles className="w-5 h-5 text-electric-purple" />
              </div>
              <p className="text-medium-gray font-light">Premium features for when you want to go deeper</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-neon-cyan/15 rounded-full flex items-center justify-center mb-3 mx-auto border border-neon-cyan/25">
                <Users className="w-5 h-5 text-neon-cyan" />
              </div>
              <p className="text-medium-gray font-light">Built by people who are also figuring out love</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-electric-blue/20 to-electric-purple/20 rounded-full flex items-center justify-center mb-3 mx-auto border border-electric-blue/30">
                <Heart className="w-5 h-5 text-electric-blue" />
              </div>
              <p className="text-medium-gray font-light">No judgment, just better tools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
