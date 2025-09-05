import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackAuthFlow } from '@/utils/analytics';

const GetStarted = () => {
  const handleGetStartedClick = () => {
    trackAuthFlow.signUpStarted();
  };

  return (
    <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to level up your
            <span className="block bg-gradient-to-r from-coral-400 via-pink-400 to-peach-400 bg-clip-text text-transparent">
              relationship game?
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Join thousands who've transformed their relationships with personalized AI coaching
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid gap-6 mb-12">
          <div className="flex items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-coral-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Create Your Account</h3>
              <p className="text-white/70">Quick sign-up with just your email</p>
            </div>
            <Clock className="w-5 h-5 text-white/40 ml-auto" />
            <span className="text-white/60 text-sm ml-1">30s</span>
          </div>

          <div className="flex items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Build Your Profile</h3>
              <p className="text-white/70">Share your relationship context so Kai understands you</p>
            </div>
            <Clock className="w-5 h-5 text-white/40 ml-auto" />
            <span className="text-white/60 text-sm ml-1">2min</span>
          </div>

          <div className="flex items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-peach-400 flex items-center justify-center mr-4">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Start Chatting with Kai</h3>
              <p className="text-white/70">Get personalized advice for your unique situation</p>
            </div>
            <Users className="w-5 h-5 text-white/40 ml-auto" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="flex items-center justify-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-white/80 text-sm">Free to start</span>
          </div>
          <div className="flex items-center justify-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-white/80 text-sm">Private & secure</span>
          </div>
          <div className="flex items-center justify-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-white/80 text-sm">No commitment</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth" onClick={handleGetStartedClick}>
            <Button className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 font-light backdrop-blur-sm mb-4">
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
          
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <Link to="/auth" className="text-coral-400 hover:text-coral-300 underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;