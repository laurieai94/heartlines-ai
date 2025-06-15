
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-rose-200">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-700">For couples who want to grow together</span>
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
            Transform your relationship through daily reflection, thoughtful actions, and emotional growth. 
            Navigate difficult conversations with confidence, and build deeper understanding of each other's hearts and minds.
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
              Four ways to deepen your emotional connection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Small, intentional actions and thoughtful communication create lasting change in how you understand and love each other.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Reflection</h3>
              <p className="text-gray-600 leading-relaxed">
                Take a few minutes each day to reflect on your interactions, feelings, and ways you can show up better for your partner.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Living Profiles</h3>
              <p className="text-gray-600 leading-relaxed">
                Build rich profiles of each other including love languages, preferences, and daily routines to understand what matters most.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversation Practice</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice difficult conversations with AI guidance, learning to approach sensitive topics with empathy, clarity, and care.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thoughtful Actions</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive gentle suggestions for meaningful gestures and conversations based on your partner's unique profile and current needs.
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
                No one wants conversations that take you backward
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Hard conversations don't have to damage your relationship. With AI-powered practice, you can learn to navigate 
                sensitive topics with confidence, showing up with the emotional intelligence your partner deserves.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Navigate conflicts with grace</h4>
                    <p className="text-gray-600">Practice approaching difficult topics before they become bigger issues</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deeper emotional understanding</h4>
                    <p className="text-gray-600">Learn to recognize and respond to your partner's emotional needs with intention</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">More meaningful daily interactions</h4>
                    <p className="text-gray-600">Transform ordinary moments into opportunities for connection and growth</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-200 via-pink-200 to-orange-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Conversation Practice</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    "I want to talk about our different spending habits without it turning into an argument. 
                    How can I bring this up in a way that feels collaborative rather than accusatory?"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-violet-600">
                    <MessageCircle className="w-3 h-3" />
                    <span>AI Conversation Coach</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Today's reflection</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    "I noticed Sarah seemed stressed about work. Instead of offering solutions right away, 
                    I could ask if she wants to talk about it or just needs some quiet time together."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-rose-600">
                    <Heart className="w-3 h-3" />
                    <span>Quality Time • Emotional Support</span>
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
            "This app didn't just teach us to communicate better—it helped us become the partners we always wanted to be. 
            We approach challenges as a team now, with more patience and genuine understanding."
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
            Ready to become more emotionally intelligent partners?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join couples who are choosing to grow together, one thoughtful conversation and meaningful moment at a time.
          </p>
          
          <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Begin Your Journey Together
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-6">Free to start • No commitment required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <span className="text-xl font-bold text-gray-900">LoveBetter</span>
          </div>
          <p className="text-gray-600">Helping couples grow together with intention and emotional intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
