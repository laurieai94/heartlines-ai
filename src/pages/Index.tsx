
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, Shield, MessageCircle, Users, ArrowRight } from "lucide-react";
import BubbleBackground from "@/components/BubbleBackground";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-peach-50 to-purple-50 relative">
      <BubbleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-coral-500 animate-pulse" />
            <h1 className="text-5xl font-bold text-gray-900">RealTalk</h1>
          </div>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your AI relationship coach built on real psychology. Get personalized advice that actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-coral-400 to-pink-400 hover:from-coral-500 hover:to-pink-500 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="px-8 py-4 text-lg font-semibold border-2 border-coral-300 text-coral-700 hover:bg-coral-50"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg">
            <MessageCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Conversations</h3>
            <p className="text-gray-600">
              Chat with Kai, your AI coach trained on 15+ years of clinical psychology expertise
            </p>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg">
            <Users className="w-12 h-12 text-coral-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Profiles</h3>
            <p className="text-gray-600">
              Build detailed profiles for both you and your partner for truly personalized advice
            </p>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg">
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Private & Secure</h3>
            <p className="text-gray-600">
              Your relationship details stay between you, your partner, and our very secure servers
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to improve your relationship?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Join thousands of couples getting real, personalized relationship advice
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-purple-400 to-coral-400 hover:from-purple-500 hover:to-coral-500 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Journey
            <Heart className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
