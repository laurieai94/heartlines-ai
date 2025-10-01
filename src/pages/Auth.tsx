import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft, Mail, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '@/utils/analytics';
import { validatePasswordPolicy, getPasswordPolicyText } from '@/utils/passwordPolicy';
import HeartlinesWordmark from '@/components/Brand/HeartlinesWordmark';
const Auth = () => {
  const {
    user,
    loading,
    signIn,
    signUp,
    resendVerification,
    resetPassword
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Check for mode parameter and route path on mount
  useEffect(() => {
    // Check route path first
    if (location.pathname === '/signin') {
      setIsSignUp(false);
    } else if (location.pathname === '/signup') {
      setIsSignUp(true);
    } else {
      // Fallback to URL parameters for /auth route
      const mode = searchParams.get('mode');
      if (mode === 'signin') {
        setIsSignUp(false);
      }
    }
  }, [searchParams, location.pathname]);

  // Redirect if already authenticated
  if (user && !loading) {
    const mode = searchParams.get('mode');
    const redirectTarget = mode === 'signin' ? '/coach' : '/profile';
    return <Navigate to={redirectTarget} replace />;
  }

  // Show loading state
  if (loading) {
    return <div className="min-h-screen questionnaire-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>;
  }
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };
  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.email || !formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }
    if (isSignUp) {
      // Use strong password policy for sign-up
      const passwordValidation = validatePasswordPolicy(formData.password);
      if (!passwordValidation.isValid) {
        errors.push(passwordValidation.message);
      }
    } else {
      // Basic validation for sign-in
      if (!formData.password || formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
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
        const {
          error
        } = await signUp(formData.email, formData.password);
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
          const {
            data: {
              session
            }
          } = await supabase.auth.getSession();
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
        const {
          error
        } = await signIn(formData.email, formData.password);
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
      const {
        error
      } = await resendVerification(formData.email);
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

  // Helper functions for validation checks
  const isEmailValid = () => {
    return formData.email && formData.email.includes('@') && formData.email.length > 0;
  };
  const isPasswordValid = () => {
    if (isSignUp) {
      return validatePasswordPolicy(formData.password).isValid;
    } else {
      return formData.password && formData.password.length >= 6;
    }
  };
  const isConfirmPasswordValid = () => {
    return isSignUp && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setFormErrors(['Please enter your email address']);
      return;
    }
    setIsSubmitting(true);
    setFormErrors([]);
    try {
      const {
        error
      } = await resetPassword(formData.email);
      if (error) throw error;
      setResetEmailSent(true);
    } catch (error: any) {
      setFormErrors([getErrorMessage(error)]);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen questionnaire-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-coral-400/20 rounded-full blur-3xl animate-gradient-shift"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-coral-500/15 to-peach-400/15 rounded-full blur-3xl animate-gradient-shift-reverse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-safe pb-safe min-h-screen flex flex-col justify-center max-w-md">
        {/* Header - Only show during sign-up */}
        {isSignUp && <div className="text-center mb-6">
            <HeartlinesWordmark 
              className="text-white mx-auto" 
              size="lg"
            />
          </div>}

        {/* Progress Header - Only show during sign-up */}
        {isSignUp && <div className="mb-8 p-4 sm:p-5 rounded-xl glass-burgundy shadow-lg sticky top-4 z-20 max-w-sm mx-auto w-full">
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 items-center mb-2">
              {/* Step 1 - active */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0" style={{
              background: 'var(--gradient-primary-button)'
            }}>1</div>
                <span className="text-white text-[12px] sm:text-[13px] leading-tight font-medium whitespace-nowrap">Join Free</span>
              </div>
              {/* Step 2 */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 text-white/60 text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0">2</div>
                <span className="text-white/70 text-[12px] sm:text-[13px] leading-tight whitespace-nowrap">Build Profiles</span>
              </div>
              {/* Step 3 */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 text-white/60 text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0">3</div>
                <span className="text-white/70 text-[12px] sm:text-[13px] leading-tight whitespace-nowrap">Chat w/ Kai</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="h-1 rounded-full w-1/3" style={{
            background: 'var(--gradient-primary-button)'
          }}></div>
            </div>
          </div>}

      <div className="questionnaire-card p-4 sm:p-5 animate-fade-in max-w-sm mx-auto w-full">
          {showEmailVerification ? <div className="text-center space-y-4">
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Check your email!</h3>
                
                <div className="flex gap-2 justify-center mt-4">
                  <Button onClick={handleResendVerification} disabled={isResendingVerification || resendCooldown > 0} variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Mail className="w-4 h-4 mr-2" />
                    {isResendingVerification ? 'Sending...' : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}
                  </Button>
                </div>
              </div>
              <Button onClick={() => navigate('/')} variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div> : showForgotPassword ? <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {resetEmailSent ? 'Check your email' : 'Reset password'}
                </h1>
                {resetEmailSent && <p className="text-white/70 text-sm">
                    We've sent a password reset link to <strong>{formData.email}</strong>
                  </p>}
              </div>

              {resetEmailSent ? <div className="text-center space-y-4">
                  
                  <Button onClick={() => {
              setShowForgotPassword(false);
              setResetEmailSent(false);
              setFormErrors([]);
            }} variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div> : <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reset-email" className="text-white text-sm">
                      Email
                    </Label>
                    <Input id="reset-email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Drop your email" required />
                  </div>

                  {formErrors.length > 0 && <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                      {formErrors.map((error, index) => <p key={index} className="text-red-300 text-xs">
                          {error}
                        </p>)}
                    </div>}

                  <Button type="submit" disabled={isSubmitting} className="w-full questionnaire-button-primary py-2 text-sm">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <Button onClick={() => {
              setShowForgotPassword(false);
              setFormErrors([]);
            }} variant="ghost" className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                </form>}
            </> : <>
              {!isSignUp && <div className="text-center mb-4">
                  <HeartlinesWordmark size="lg" className="text-white font-brand mx-auto whitespace-nowrap" />
                </div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <div className="relative">
                  <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Drop your email" className={isEmailValid() ? 'pr-12' : ''} required />
                {isEmailValid() && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="Keep it secret" pattern={isSignUp ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" : undefined} title={isSignUp ? getPasswordPolicyText() : undefined} className={isPasswordValid() ? 'pr-20' : 'pr-12'} required />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {isPasswordValid() && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />}
                </div>
                 {isSignUp && <p className="text-xs text-white/60 leading-tight">
                     {getPasswordPolicyText()}
                   </p>}
               </div>
               {!isSignUp && <div className="text-left">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-coral-400 hover:text-coral-300 underline">
                    Locked out?
                  </button>
                 </div>}
             </div>

            {isSignUp && validatePasswordPolicy(formData.password).isValid && <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm your password" className={isConfirmPasswordValid() ? 'pr-20' : 'pr-12'} required />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-8 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-transparent">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {isConfirmPasswordValid() && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />}
                </div>
              </div>}

            {formErrors.length > 0 && <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                {formErrors.map((error, index) => <p key={index} className="text-red-300 text-xs">
                    {error}
                  </p>)}
              </div>}

            <Button type="submit" disabled={isSubmitting} className="w-full questionnaire-button-primary py-2 text-sm">
              {isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

              {/* Toggle between sign up and sign in */}
              <div className="mt-6 text-center">
                <p className="text-white/70 text-xs">
                  {isSignUp ? 'Already have an account?' : 'Need an account?'}
                  {' '}
                  <button type="button" onClick={() => {
                setIsSignUp(!isSignUp);
                setFormErrors([]);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }} className="text-coral-400 hover:text-coral-300 underline font-medium">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
                
                {/* Back to Home button */}
                <Button variant="ghost" onClick={() => navigate('/')} className="text-white/60 hover:text-white/80 hover:bg-white/5 text-xs py-1 h-auto mt-3">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Home
                </Button>
              </div>
            </>}
        </div>
      </div>
    </div>;
};
export default Auth;