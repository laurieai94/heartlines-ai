import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/profile" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.email || !formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password);
        if (error) throw error;
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
    } catch (error: any) {
      setFormErrors([error.message || 'An error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Progress Header */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-coral-400 flex items-center justify-center text-white text-sm font-semibold">1</div>
                <span className="ml-2 text-white font-medium">Sign Up</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/60 text-sm font-semibold">2</div>
                <span className="ml-2 text-white/60">Profile</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/60 text-sm font-semibold">3</div>
                <span className="ml-2 text-white/60">Talk to Kai</span>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm">✨ Takes just 2-3 minutes to get your personalized AI relationship coach</p>
        </div>
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="questionnaire-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Your Free Account' : 'We missed you'}
            </h1>
            <p className="text-white/70">
              {isSignUp ? 'Next, we\'ll guide you through your profile to unlock Kai.' : 'Tap in to keep leveling up'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Drop your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-400/50 focus:ring-pink-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Keep it secret"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-400/50 focus:ring-pink-400/20 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-400/50 focus:ring-pink-400/20"
                  required
                />
              </div>
            )}

            {formErrors.length > 0 && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30">
                {formErrors.map((error, index) => (
                  <p key={index} className="text-red-300 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full questionnaire-button-primary"
            >
              {isSubmitting 
                ? 'Processing...' 
                : isSignUp ? 'Create Account' : 'Sign In'
              }
            </Button>
          </form>

          {/* Toggle between sign up and sign in */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
              {' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-coral-400 hover:text-coral-300 underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;