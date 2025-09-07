import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft, Mail, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '@/utils/analytics';

const Auth = () => {
  const { user, loading, signIn, signUp, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check for mode parameter on mount
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signin') {
      setIsSignUp(false);
    }
  }, [searchParams]);

  // Check if we should show progress steps (hide for direct sign-in)
  const showProgressSteps = searchParams.get('mode') !== 'signin';

  // Redirect if already authenticated
  if (user && !loading) {
    const mode = searchParams.get('mode');
    const redirectTarget = mode === 'signin' ? '/coach' : '/profile';
    return <Navigate to={redirectTarget} replace />;
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

  const getErrorMessage = (error: any) => {
    const message = error.message || 'An error occurred';
    
    if (message.includes('User already registered')) {
      return 'This email is already registered. Try signing in instead, or use a different email.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please check your email and click the verification link before signing in.';
    }
    
    return message;
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
        logEvent('auth_signup_started');
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          if (error.message?.includes('User already registered')) {
            // Suggest switching to sign in
            setFormErrors([getErrorMessage(error)]);
            setTimeout(() => setIsSignUp(false), 3000);
          } else {
            throw error;
          }
        } else {
          logEvent('auth_signup_completed');
          // Check if user is immediately signed in (no email verification required)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // User is signed in immediately, redirect to profile
            navigate('/profile');
          } else {
            // No session, show email verification
            setShowEmailVerification(true);
          }
        }
      } else {
        logEvent('auth_signin_started');
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        logEvent('auth_signin_completed');
        // Navigate to coach page for sign-in
        navigate('/coach');
      }
    } catch (error: any) {
      setFormErrors([getErrorMessage(error)]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !formData.email) return;
    
    setIsResendingVerification(true);
    try {
      const { error } = await resendVerification(formData.email);
      if (error) throw error;
      
      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      setFormErrors([getErrorMessage(error)]);
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-2 max-w-md min-h-screen flex flex-col">
        {/* Progress Header - Only show for sign-up flow */}
        {showProgressSteps && (
          <div className="mb-3 p-3 rounded-xl bg-white/3 backdrop-blur-md border border-white/5 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-center mb-2 overflow-x-auto">
              <div className="flex items-center space-x-1.5 flex-nowrap min-w-max">
                <div className="flex items-center whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-coral-400 flex items-center justify-center text-white text-xs font-semibold shadow-sm">1</div>
                  <span className="ml-1.5 text-white font-medium text-xs">Join Free</span>
                </div>
                <div className="w-3 h-px bg-white/15"></div>
                <div className="flex items-center whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/50 text-xs font-semibold">2</div>
                  <span className="ml-1.5 text-white/50 text-xs">Build Profiles (You & Partner)</span>
                </div>
                <div className="w-3 h-px bg-white/15"></div>
                <div className="flex items-center whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/50 text-xs font-semibold">3</div>
                  <span className="ml-1.5 text-white/50 text-xs">Talk to Kai</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-1 mb-2">
              <div className="bg-coral-400 h-1 rounded-full w-1/3 transition-all duration-300"></div>
            </div>
            
            <p className="text-white/60 text-xs text-center tracking-wide">~2 MINUTES personalized relationship INSIGHTS</p>
          </div>
        )}

        <div className="questionnaire-card p-3 sm:p-4 animate-fade-in max-w-sm mx-auto flex-1 flex flex-col min-h-0 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {showEmailVerification ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-coral-500/20 rounded-full flex items-center justify-center mb-3">
                <Mail className="h-6 w-6 text-coral-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
                <p className="text-white/70 mb-3 text-sm">
                  We sent a verification link to <span className="text-coral-400 font-medium">{formData.email}</span>
                </p>
                <p className="text-white/60 text-xs">
                  Click the link in your inbox to activate your account and continue to your profile.
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-coral-500/10 border border-coral-400/20">
                <p className="text-coral-300 text-xs mb-2">Didn't receive the email?</p>
                <Button
                  onClick={handleResendVerification}
                  disabled={isResendingVerification || resendCooldown > 0}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isResendingVerification ? (
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : 'Resend verification email'
                  }
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEmailVerification(false);
                    setFormData({ email: '', password: '', confirmPassword: '' });
                  }}
                  className="text-white/60 hover:text-white"
                >
                  ← Try a different email
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Create Your Free Account' : 'We missed you'}
                </h1>
                <p className="text-white/70 mb-3 text-sm">
                  {isSignUp ? 'Next, we\'ll guide you through your profile to unlock Kai.' : 'Tap in to keep leveling up'}
                </p>
              </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white text-sm">
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

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white text-sm">
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
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-white text-sm">
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
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                {formErrors.map((error, index) => (
                  <p key={index} className="text-red-300 text-xs">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full questionnaire-button-primary py-2 text-sm"
            >
              {isSubmitting 
                ? 'Processing...' 
                : isSignUp ? 'Create Account' : 'Sign In'
              }
            </Button>
          </form>

              {/* Toggle between sign up and sign in */}
              <div className="mt-4 text-center">
                <p className="text-white/70 text-xs">
                  {isSignUp ? 'Already have an account?' : 'Need an account?'}
                  {' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormErrors([]);
                      setFormData({ email: '', password: '', confirmPassword: '' });
                    }}
                    className="text-coral-400 hover:text-coral-300 underline font-medium"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
                
                {/* Back to Home button */}
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-white/60 hover:text-white/80 hover:bg-white/5 text-xs py-1 h-auto mt-3"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;