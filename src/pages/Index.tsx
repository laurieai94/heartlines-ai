
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 relative overflow-hidden">
      {/* Floating gradient orbs for depth */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-orange-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-10 border border-pink-200/50 shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-rose-700 tracking-wide">An AI that truly knows you both</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight font-sans">
            Become more
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 animate-gradient"> thoughtful</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600"> emotionally intelligent</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500"> partners</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Our AI learns who you are—your love languages, communication style, daily rhythms, and what makes you feel loved. 
            It understands your partner too, then guides you both toward deeper connection through personalized insights and thoughtful actions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0">
              Start Growing Together
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" className="border-2 border-pink-300/50 text-rose-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 px-10 py-7 text-lg rounded-full backdrop-blur-sm bg-white/40 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-sans">
              An AI that knows you, understands your partner,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> and guides you both</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Through detailed profiles and continuous learning, our AI provides personalized guidance that's uniquely yours—because no two relationships are the same.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl hover:bg-white/70">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Deep Understanding</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Build rich profiles that capture who you really are—your love languages, stress triggers, communication preferences, and what makes you feel most loved and supported.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl hover:bg-white/70">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Target className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Personalized Guidance</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Receive daily suggestions tailored specifically to your partner's needs today—whether they're stressed about work, celebrating a win, or just need quality time.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl hover:bg-white/70">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <MessageCircle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Conversation Coaching</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Practice difficult conversations with AI that knows both of your communication styles, helping you approach sensitive topics with empathy and understanding.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-xl bg-white/60 backdrop-blur-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-3xl hover:bg-white/70">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Sparkles className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sans">Thoughtful Actions</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Get specific, meaningful suggestions based on your partner's current mood, schedule, and preferences—from the perfect text to send to how to support them tonight.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-sans leading-tight">
                It's like having a relationship coach who 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> knows you both intimately</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                Our AI doesn't give generic advice. It learns your unique communication patterns, what makes each of you feel loved, 
                and how you both handle stress—then provides guidance that actually fits your relationship.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mt-1 shadow-lg">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg font-sans">Understands your love languages</h4>
                    <p className="text-gray-600 font-light">Suggests actions that truly resonate with how your partner receives love</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mt-1 shadow-lg">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg font-sans">Knows your communication styles</h4>
                    <p className="text-gray-600 font-light">Helps you approach conversations in ways that work for both of your personalities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full flex items-center justify-center mt-1 shadow-lg">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg font-sans">Adapts to your daily rhythms</h4>
                    <p className="text-gray-600 font-light">Considers work schedules, stress levels, and energy patterns for perfectly timed suggestions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-200/80 via-rose-200/80 to-orange-200/80 rounded-3xl p-10 shadow-2xl backdrop-blur-sm">
                <div className="bg-white/80 rounded-2xl p-8 shadow-xl mb-6 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                  <h4 className="font-bold text-gray-900 mb-4 font-sans text-lg">Personal Insight</h4>
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed font-light">
                    "Based on Sarah's profile, she processes stress by talking things through and feels most supported when you listen without trying to fix. 
                    Since she mentioned a difficult client meeting today, ask how it went and give her space to share."
                  </p>
                  <div className="flex items-center gap-3 text-xs text-purple-600">
                    <Brain className="w-4 h-4" />
                    <span className="font-medium">Personalized for Sarah • Acts of Service</span>
                  </div>
                </div>
                <div className="bg-white/80 rounded-2xl p-8 shadow-xl backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                  <h4 className="font-bold text-gray-900 mb-4 font-sans text-lg">Conversation Practice</h4>
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed font-light">
                    "Remember, Alex prefers direct communication and appreciates when you start with your feelings rather than the problem. 
                    Try: 'I've been feeling disconnected lately and I'd love to talk about how we can spend more quality time together.'"
                  </p>
                  <div className="flex items-center gap-3 text-xs text-rose-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">Tailored for Alex's Communication Style</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-12 shadow-2xl">
            <blockquote className="text-2xl lg:text-4xl font-medium text-gray-900 mb-10 leading-relaxed font-light">
              "It's incredible how well the app understands us. The suggestions aren't generic—they're so specific to who we are and what we need. 
              It's like having a therapist who's been studying our relationship for years."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-lg font-sans">Maya & James</p>
                <p className="text-gray-600 font-light">Together 4 years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-sans leading-tight">
            Ready for an AI that truly 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> understands your relationship?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Start building your profiles today. The more we learn about you both, the better we can help you love each other with intention and care.
          </p>
          
          <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 mb-8">
            Begin Your Journey Together
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <p className="text-sm text-gray-500 font-light">Free to start • The more you share, the better it gets</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gradient-to-r from-pink-100/50 to-rose-100/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 font-sans">LoveBetter</span>
          </div>
          <p className="text-gray-600 font-light text-lg">An AI that understands you, knows your partner, and helps you both grow together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
