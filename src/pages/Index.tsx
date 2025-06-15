
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Target, Sparkles, ArrowRight } from "lucide-react";

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
            Show up with more
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600"> love</span>,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">intention</span>, and
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500"> care</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your relationship through daily reflection, thoughtful actions, and emotional growth. 
            Build living profiles of each other to understand and support one another with deeper intention.
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
              Three simple ways to deepen your connection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Small, intentional actions create lasting change in how you understand and love each other.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                <Sparkles className="w-8 h-8 text-orange-600" />
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
                Love grows in the everyday moments
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Real intimacy isn't built in grand gestures—it's cultivated in how we show up for each other daily. 
                Our app helps you notice the small things that matter most to your partner and respond with intention.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deeper emotional connection</h4>
                    <p className="text-gray-600">Understand your partner's inner world and respond with empathy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">More meaningful communication</h4>
                    <p className="text-gray-600">Learn to speak each other's love language fluently</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <Heart className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reduced relationship stress</h4>
                    <p className="text-gray-600">Navigate conflicts with greater understanding and compassion</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-200 via-pink-200 to-orange-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Today's reflection</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    "I noticed Sarah seemed tired after work. Instead of asking about dinner right away, 
                    I could offer to make tea and just sit with her for a few minutes."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-rose-600">
                    <Heart className="w-3 h-3" />
                    <span>Acts of Service • Quality Time</span>
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
            "This app didn't fix our relationship—it helped us remember why we fell in love in the first place. 
            We're more curious about each other, more patient, more intentional."
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
            Ready to love more intentionally?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join couples who are choosing to grow together, one thoughtful moment at a time.
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
          <p className="text-gray-600">Helping couples grow together with intention and care.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
