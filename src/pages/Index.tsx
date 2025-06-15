
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-coral-50 to-pink-100 relative overflow-hidden">
      {/* Floating warm gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-200/40 to-coral-300/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-coral-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-peach-200/25 to-coral-200/25 rounded-full blur-2xl animate-pulse delay-500"></div>

      {/* Navigation */}
      <nav className="px-6 py-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-coral-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-serif">LoveBetter ❤️</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className="text-gray-700 hover:text-coral-600 transition-colors cursor-pointer font-serif">Home</span>
            <span className="text-gray-700 hover:text-coral-600 transition-colors cursor-pointer font-serif">About</span>
            <span className="text-gray-700 hover:text-coral-600 transition-colors cursor-pointer font-serif">Contact</span>
            <Link to="/dashboard">
              <Button variant="outline" className="border-coral-200 text-coral-600 hover:bg-coral-50 rounded-full font-serif">
                Get Started - It's Free 💕
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-coral-200/60 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-coral-700 tracking-wide font-serif">Finally, an app that gets your relationship 💖</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight font-serif">
                Relationships are hard.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-pink-500"> You don't have to wing it.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed font-light font-serif">
                We're tired of relationship advice that sounds like it was written in 1995. LoveBetter gets it—modern love is complicated, you're both busy AF, and sometimes you need help figuring out how to show up for each other. 💕
              </p>
              
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-serif">
                  Get Started - It's Free ✨
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
            
            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-coral-400 via-pink-400 to-orange-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-12 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-serif">AI That Actually Gets You 🧠</h3>
                    <p className="text-white/90 text-lg leading-relaxed font-serif">
                      No more generic advice that doesn't fit real people ❤️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
              Dating apps taught us how to swipe. Now what? 📱💕
            </h2>
            <div className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light space-y-6 font-serif">
              <p>
                Nobody prepared us for the actual relationship part. You know—the daily stuff. Like how to fight without losing your minds, or remembering that your partner's love language isn't mind-reading. 💭
              </p>
              <p className="font-medium text-gray-900">That's where we come in. 🌟</p>
              <p>
                We built LoveBetter because we got tired of generic advice that doesn't fit real people. Our AI actually learns who you are (both of you) and gives you the kind of personalized insights your therapist would—if you could afford to see them twice a week. 💖
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
              How It Actually Works ✨
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-xl bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-100 to-pink-100 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-10 h-10 text-coral-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">🧠 We Get to Know You (For Real)</h3>
              <p className="text-gray-600 leading-relaxed font-light font-serif">
                Not just "what's your sign?" but the real stuff—how you communicate when you're stressed, what makes you feel loved, and yes, even your weird quirks. The more honest you are, the better we can help. 💕
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-xl bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">💡 Daily Insights That Don't Suck</h3>
              <p className="text-gray-600 leading-relaxed font-light font-serif">
                Instead of "just communicate better" (thanks, very helpful), you get specific, actionable suggestions based on what's actually happening in your lives right now. ✨
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-coral-100 to-orange-100 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="w-10 h-10 text-coral-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">🗣️ Practice Makes Progress</h3>
              <p className="text-gray-600 leading-relaxed font-light font-serif">
                Scared to bring up that thing? Practice the conversation with our AI first. It knows both your communication styles, so you can figure out the best approach without the drama. 💬
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">💝 Thoughtful Actions, Zero Effort</h3>
              <p className="text-gray-600 leading-relaxed font-light font-serif">
                Get specific ideas for how to make your partner's day better—based on their actual preferences, not some random blog post about "50 ways to be romantic." 🌹
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Real Examples Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-coral-400 via-pink-400 to-orange-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                  Real Examples (Because We're Not About That Vague Life) 💯
                </h2>
              </div>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-coral-50 to-pink-50 p-8 rounded-2xl border border-coral-200/50">
                  <h4 className="font-bold text-gray-900 mb-4 text-xl font-serif">For Sarah (who thrives on words of affirmation) 💬❤️</h4>
                  <p className="text-gray-700 leading-relaxed text-lg font-serif">
                    "Sarah's been anxious about her presentation all week. Instead of just saying 'you'll do great,' try something specific: 'I love watching you tackle challenges—you always find creative solutions I never would have thought of.' ✨"
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-coral-50 p-8 rounded-2xl border border-pink-200/50">
                  <h4 className="font-bold text-gray-900 mb-4 text-xl font-serif">For Jamie (quality time is their jam) ⏰💕</h4>
                  <p className="text-gray-700 leading-relaxed text-lg font-serif">
                    "Jamie mentioned feeling disconnected this week. Tonight, suggest putting phones in another room and just existing together. Even 20 minutes of actual attention will help them feel seen. 📱➡️❤️"
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-serif">
              Why This Isn't Just Another App 🌟
            </h2>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-pink-500 mb-12 font-serif">
              We're Built Different ✨
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif">No toxic positivity 🚫✨</h4>
              <p className="text-gray-600 leading-relaxed font-serif">Real relationships have rough patches, and that's normal 💕</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif">Actually personalized 🎯</h4>
              <p className="text-gray-600 leading-relaxed font-serif">Not horoscope-level generic advice 🔮❌</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif">Designed for busy humans ⏰</h4>
              <p className="text-gray-600 leading-relaxed font-serif">Quick daily insights that fit into your actual life 🏃‍♀️💨</p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif">Privacy first 🔒</h4>
              <p className="text-gray-600 leading-relaxed font-serif">Your relationship details stay between you, your partner, and our very secure servers 💕🛡️</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-serif leading-tight">
            For People Who Actually Want to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-pink-500"> Get Better at Love 💕</span>
          </h2>
          <div className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light space-y-4 font-serif">
            <p>
              Look, we could promise you'll never fight again or that this will "save your relationship." But that's not real life. 🤷‍♀️
            </p>
            <p>
              What we will do is help you understand each other better, communicate more clearly, and show love in ways that actually land. ✨
            </p>
            <p className="font-medium text-gray-900">
              Because the best relationships aren't perfect—they're just two people who keep choosing to understand each other better. 💖
            </p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Ready to Stop Guessing? 🎯</h3>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 mb-6 font-serif">
                Create Your Profile ✨
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <p className="text-lg text-gray-600 font-light font-serif">
              The basic stuff is always free because good relationships shouldn't be a luxury. Ready to see what happens when an app actually understands your relationship? 💕
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-coral-50 to-pink-50 p-8 rounded-3xl border border-coral-200/50">
            <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif">The Fine Print (But Make It Friendly) 📝💕</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600 font-serif">
              <p>✓ Free to start, always 🆓</p>
              <p>✓ Premium features for when you want to go deeper 💎</p>
              <p>✓ Built by people who are also figuring out love 💕</p>
              <p>✓ No judgment, just better tools 🛠️❤️</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gradient-to-r from-coral-100/60 to-pink-100/60 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-coral-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-serif">LoveBetter ❤️</span>
          </div>
          <p className="text-gray-600 font-light text-lg font-serif">Finally, an app that gets your relationship. 💕</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
