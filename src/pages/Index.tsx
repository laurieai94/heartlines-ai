
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingButton(true);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Holographic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-coral-500/20 to-purple-900/30 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-400/10 via-pink-500/10 to-purple-500/10 animate-gradient" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-600/10 via-coral-400/10 to-purple-600/10 animate-gradient" style={{ animationDelay: '2s' }}></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 border border-pink-300/10 rounded-lg animate-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Code-like Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 font-mono text-xs text-pink-200">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-coral-200">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-pink-200">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-6 py-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-coral-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-pink-300/20">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-sans">LoveBetter</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="text-gray-300 hover:text-coral-400 transition-colors cursor-pointer font-thin">Home</span>
            <span className="text-gray-300 hover:text-coral-400 transition-colors cursor-pointer font-thin">About</span>
            <span className="text-gray-300 hover:text-coral-400 transition-colors cursor-pointer font-thin">Contact</span>
            <Link to="/dashboard">
              <Button variant="outline" className="border-coral-400/50 text-coral-400 hover:bg-coral-400/10 rounded-full font-thin backdrop-blur-sm">
                Get Started - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div 
                className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-pink-300/20 shadow-lg transition-transform duration-300"
                style={{
                  transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-light text-white/90 tracking-wide">Finally, an app that gets your relationship</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-thin text-white mb-8 leading-tight">
                Relationships are hard.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                  You don't have to wing it.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed font-light">
                We're tired of relationship advice that sounds like it was written in 1995. LoveBetter gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other.
              </p>
              
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm">
                  Get Started - It's Free
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            {/* Neural Network Animation */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-96 h-96">
                {/* Central Brain Node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-coral-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-pink-300/30 hover:scale-110 transition-transform duration-300 cursor-pointer group">
                  <Brain className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>

                {/* Neural Network Nodes */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45) * (Math.PI / 180);
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-pink-300/20 rounded-full animate-pulse backdrop-blur-sm"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        animationDelay: `${i * 0.2}s`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  );
                })}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180);
                    const radius = 120;
                    const x = 192 + Math.cos(angle) * radius;
                    const y = 192 + Math.sin(angle) * radius;
                    
                    return (
                      <line
                        key={i}
                        x1="192"
                        y1="192"
                        x2={x}
                        y2={y}
                        stroke="url(#gradientPink)"
                        strokeWidth="1"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section */}
      <section className="px-6 py-24 relative">
        <div 
          className="max-w-6xl mx-auto transition-transform duration-300"
          style={{
            transform: `translateY(${mousePosition.y * -0.02}px)`
          }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
              Dating apps taught us how to swipe. Now what?
            </h2>
            <div className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light space-y-6">
              <p>
                Nobody prepared us for the actual relationship part. You know—the daily stuff. Like how to fight without losing your minds, or remembering that your partner's love language isn't mind-reading.
              </p>
              <p className="font-medium text-white">That's where we come in.</p>
              <p>
                We built LoveBetter because we got tired of generic advice that doesn't fit real people. Our AI actually learns who you are (both of you) and gives you the kind of personalized insights your therapist would—if you could afford to see them twice a week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6">
              How It Actually Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-xl bg-white/5 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                <Brain className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">We Get to Know You (For Real)</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-xl bg-white/5 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                <Target className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Daily Insights That Don't Suck</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-white/5 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                <MessageCircle className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Practice Makes Progress</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-white/5 backdrop-blur-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                <Sparkles className="w-10 h-10 text-coral-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Thoughtful Actions, Zero Effort</h3>
              <p className="text-gray-300 leading-relaxed font-light">
                Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Real Examples Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-1 shadow-2xl border border-white/20">
            <div className="bg-black/50 backdrop-blur-md rounded-3xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-white mb-6">
                  Real Examples (Because Generic Advice Is Trash)
                </h2>
              </div>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-light text-white mb-4 text-xl">For Maya (words of affirmation)</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    "Maya texted you at 11:47 PM: 'Do you think I talked too much at dinner tonight? I feel like I was being weird.' Don't just say 'no you weren't.' Try: 'Babe, you literally made that whole table laugh when you told the story about your landlord. You have this gift for making people feel comfortable—I watched everyone relax the second you started talking.'"
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-light text-white mb-4 text-xl">For Alex (acts of service)</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    "Alex has been working 12-hour days trying to get their freelance business off the ground while their washing machine has been broken for two weeks. They keep saying 'I'll figure it out' when you ask what they need. Stop asking. Show up Saturday morning with quarters and detergent. Text: 'Laundromat date? I'm buying coffee and we're getting your life together.'"
                  </p>
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-coral-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-light text-white mb-4 text-xl">For River (quality time)</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    "River's been different since their best friend moved across the country last month. They keep saying they're 'adjusting fine' but they've been rewatching The Office for the third time and ordering way too much takeout. Don't suggest they 'get out more.' Instead: 'Want to sit in my car and eat gas station snacks while we figure out why we're both avoiding being adults right now?'"
                  </p>
                </div>

                <div className="bg-gradient-to-r from-coral-500/10 to-cyan-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-light text-white mb-4 text-xl">For Jordan (physical touch)</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    "Jordan's anxiety has been through the roof since they started the new job. They're not sleeping well and keep apologizing for being 'clingy.' Stop telling them they're not clingy. Next time you're watching Netflix, just pull them over so their head's on your chest. Don't make it A Thing. Just let them exist in your space until their breathing slows down."
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-light text-white mb-4 text-xl">For Casey (gifts)</h4>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    "Casey mentioned their therapist told them to start journaling but they hate the idea of writing in some basic notebook. You remember they're obsessed with that one pen at Target they always test but never buy. Get the pen. Get a notebook that doesn't look like homework. Leave it on their kitchen counter with a note: 'For all the thoughts that keep you up at night.'"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8">
              Why This Isn't Just Another App
            </h2>
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-12">
              We're Built Different
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <h4 className="text-xl font-light text-white mb-4">No toxic positivity</h4>
              <p className="text-gray-300 leading-relaxed font-light">Real relationships have rough patches, and that's normal</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <h4 className="text-xl font-light text-white mb-4">Actually personalized</h4>
              <p className="text-gray-300 leading-relaxed font-light">Not horoscope-level generic advice</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <h4 className="text-xl font-light text-white mb-4">Designed for busy humans</h4>
              <p className="text-gray-300 leading-relaxed font-light">Quick daily insights that fit into your actual life</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
              <h4 className="text-xl font-light text-white mb-4">Privacy first</h4>
              <p className="text-gray-300 leading-relaxed font-light">Your relationship details stay between you, your partner, and our very secure servers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-thin text-white mb-8 leading-tight">
            For People Who Actually Want to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"> Get Better at Love</span>
          </h2>
          <div className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light space-y-4">
            <p>
              Look, we could promise you'll never fight again or that this will "save your relationship." But that's not real life.
            </p>
            <p>
              What we will do is help you understand each other better, communicate more clearly, and show love in ways that actually land.
            </p>
            <p className="font-medium text-white">
              Because the best relationships aren't perfect—they're just two people who keep choosing to understand each other better.
            </p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-3xl font-light text-white mb-6">Ready to Stop Guessing?</h3>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 mb-6 font-light">
                Create Your Profile
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <p className="text-lg text-gray-300 font-light">
              The basic stuff is always free because good relationships shouldn't be a luxury. Ready to see what happens when an app actually understands your relationship?
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
            <h4 className="text-xl font-light text-white mb-4">The Fine Print (But Make It Friendly)</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300 font-light">
              <p>Free to start, always</p>
              <p>Premium features for when you want to go deeper</p>
              <p>Built by people who are also figuring out love</p>
              <p>No judgment, just better tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Try It Now Button */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm border border-pink-300/20">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-16 bg-black/50 backdrop-blur-sm relative border-t border-pink-300/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-pink-300/20">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-light text-white">LoveBetter</span>
          </div>
          <p className="text-gray-300 font-light text-lg">Finally, an app that gets your relationship.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
