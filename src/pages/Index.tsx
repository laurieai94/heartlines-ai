
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-rose-200">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-700">An AI that truly knows you both</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Become more
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600"> thoughtful</span>,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">emotionally intelligent</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">partners</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Our AI learns who you are—your love languages, communication style, daily rhythms, and what makes you feel loved. 
            It understands your partner too, then guides you both toward deeper connection through personalized insights and thoughtful actions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Start Growing Together
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50 px-8 py-6 text-lg rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              An AI that knows you, understands your partner, and guides you both
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Through detailed profiles and continuous learning, our AI provides personalized guidance that's uniquely yours—because no two relationships are the same.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deep Understanding</h3>
              <p className="text-gray-600 leading-relaxed">
                Build rich profiles that capture who you really are—your love languages, stress triggers, communication preferences, and what makes you feel most loved and supported.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive daily suggestions tailored specifically to your partner's needs today—whether they're stressed about work, celebrating a win, or just need quality time.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversation Coaching</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice difficult conversations with AI that knows both of your communication styles, helping you approach sensitive topics with empathy and understanding.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thoughtful Actions</h3>
              <p className="text-gray-600 leading-relaxed">
                Get specific, meaningful suggestions based on your partner's current mood, schedule, and preferences—from the perfect text to send to how to support them tonight.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                It's like having a relationship coach who knows you both intimately
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI doesn't give generic advice. It learns your unique communication patterns, what makes each of you feel loved, 
                and how you both handle stress—then provides guidance that actually fits your relationship.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Understands your love languages</h4>
                    <p className="text-gray-600">Suggests actions that truly resonate with how your partner receives love</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Knows your communication styles</h4>
                    <p className="text-gray-600">Helps you approach conversations in ways that work for both of your personalities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adapts to your daily rhythms</h4>
                    <p className="text-gray-600">Considers work schedules, stress levels, and energy patterns for perfectly timed suggestions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-200 via-pink-200 to-orange-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Insight</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    "Based on Sarah's profile, she processes stress by talking things through and feels most supported when you listen without trying to fix. 
                    Since she mentioned a difficult client meeting today, ask how it went and give her space to share."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-violet-600">
                    <Brain className="w-3 h-3" />
                    <span>Personalized for Sarah • Acts of Service</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Conversation Practice</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    "Remember, Alex prefers direct communication and appreciates when you start with your feelings rather than the problem. 
                    Try: 'I've been feeling disconnected lately and I'd love to talk about how we can spend more quality time together.'"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-rose-600">
                    <MessageCircle className="w-3 h-3" />
                    <span>Tailored for Alex's Communication Style</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
            "It's incredible how well the app understands us. The suggestions aren't generic—they're so specific to who we are and what we need. 
            It's like having a therapist who's been studying our relationship for years."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Maya & James</p>
              <p className="text-gray-600 text-sm">Together 4 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready for an AI that truly understands your relationship?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Start building your profiles today. The more we learn about you both, the better we can help you love each other with intention and care.
          </p>
          
          <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Begin Your Journey Together
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-6">Free to start • The more you share, the better it gets</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <span className="text-xl font-bold text-gray-900">LoveBetter</span>
          </div>
          <p className="text-gray-600">An AI that understands you, knows your partner, and helps you both grow together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
