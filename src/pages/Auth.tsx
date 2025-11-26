import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft, Mail, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { logEvent } from '@/utils/analytics';
import { validatePasswordPolicy, getPasswordPolicyText } from '@/utils/passwordPolicy';
import { BRAND } from '@/branding';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import PhoneLockup from '@/components/Brand/PhoneLockup';
import { listenForAuthSuccess } from '@/utils/authChannel';
import { toast } from '@/components/ui/sonner';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
import PremiumBackground from '@/components/PremiumBackground';
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
  const location = useLocation();
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
  const [isVerifiedFlow, setIsVerifiedFlow] = useState(false);
  const isKeyboardVisible = useKeyboardDetection();

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
    
    // Check for verified email flow
    const verified = searchParams.get('verified');
    
    if (verified === 'true') {
      setIsVerifiedFlow(true);
      setIsSignUp(false); // We're in sign-in mode
      
      // Auto-focus email field after a brief delay
      setTimeout(() => {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 300);
    } else {
      // Check if user just confirmed their email
      const confirmed = searchParams.get('confirmed');
      const expired = searchParams.get('expired');
      
      if (confirmed === 'true' || expired === 'true') {
        // Focus email input
        const emailInput = document.getElementById('email') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }
    }
  }, [searchParams, location.pathname]);

  // Listen for auth success from other tabs (email verification)
  useEffect(() => {
    const cleanup = listenForAuthSuccess((userId) => {
      console.log('Auth success received from another tab:', userId);
      const redirectPath = searchParams.get("redirect") || "/profile";
      
      // Show success toast
      toast.success("Email confirmed!", {
        description: "Welcome to heartlines. Redirecting to your profile...",
      });
      
      // Redirect this tab
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    });

    return cleanup;
  }, [navigate, searchParams]);

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
    
    // Handle rate limiting
    if (message.includes('For security purposes, you can only request this after')) {
      const match = message.match(/after (\d+) seconds?/);
      const seconds = match ? match[1] : '10';
      return `Please wait ${seconds} seconds before requesting another email.`;
    }
    if (message.includes('over_email_send_rate_limit') || error.status === 429) {
      return 'You just requested an email—please wait about 10 seconds and try again.';
    }
    
    // Existing error messages
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
            toast.success('Welcome to heartlines! 🎉', {
              description: 'Your account has been created successfully.'
            });
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
        
        // Get the current session to access user data
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;

        // Check for return path in localStorage or location state
        const intendedReturn = localStorage.getItem('intended_plan_return');
        const locationState = location.state as { returnTo?: string } | null;

        // Determine if this is the user's first login
        let defaultDestination = '/coach'; // Default for returning users

        if (currentUser) {
          const userCreatedAt = new Date(currentUser.created_at);
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const isBrandNew = userCreatedAt > twentyFourHoursAgo;
          
          const firstLoginKey = `first_login_completed_${currentUser.id}`;
          const hasCompletedFirstLogin = localStorage.getItem(firstLoginKey);
          
          // If brand new user and hasn't completed first login, send to profile
          if (isBrandNew && !hasCompletedFirstLogin) {
            localStorage.setItem(firstLoginKey, 'true');
            defaultDestination = '/profile';
          }
        }

        const returnTo = locationState?.returnTo || intendedReturn || defaultDestination;

        // Navigate to the intended destination
        navigate(returnTo);
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
      
      // Show success toast
      toast.success('Password reset email sent! 📧', {
        description: `Check ${formData.email} for your reset link.`
      });
      setResetEmailSent(true);
    } catch (error: any) {
      setFormErrors([getErrorMessage(error)]);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-burgundy-800 auth-page-scroll relative">
      <PremiumBackground />

      <div className="relative z-10 h-screen max-h-screen flex flex-col items-center justify-center px-4 overflow-y-auto">
        {/* Top section with logo and progress - only during sign-up */}
        {isSignUp && (
          <div className="w-full flex flex-col items-center space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-shrink-0">
            {/* Logo */}
            <div className="text-center">
              <img 
                src={BRAND.signUpLogoSrc}
                alt="heartlines logo"
                className="w-44 sm:w-48 md:w-56 lg:w-60 mx-auto max-w-full h-auto"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-xs sm:max-w-sm px-1">
              <div className="p-1.5 sm:p-2 rounded-xl glass-burgundy shadow-lg">
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5 items-center mb-2">
                  {/* Step 1 - active */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0" style={{
                  background: 'var(--gradient-primary-button)'
                }}>1</div>
                    <span className="text-white text-[12px] sm:text-[13px] leading-tight font-medium whitespace-nowrap">join free</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 text-white/60 text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0">2</div>
                    <span className="text-white/70 text-[12px] sm:text-[13px] leading-tight whitespace-nowrap">build profiles</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 text-white/60 text-[11px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0">3</div>
                    <span className="text-white/70 text-[12px] sm:text-[13px] leading-tight whitespace-nowrap">chat w/ kai</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div className="h-1 rounded-full w-1/3" style={{
                background: 'var(--gradient-primary-button)'
              }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form container - centered and flexible */}
        <div className="w-full flex flex-col items-center flex-shrink-0">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="questionnaire-card p-3 sm:p-4 md:p-5 lg:p-6">
          {showEmailVerification ? <div className="text-center space-y-2 sm:space-y-4">
              <div className="questionnaire-card p-4 sm:p-5 md:p-6">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="questionnaire-text font-semibold mb-1.5 sm:mb-2">check your email!</h3>
                <p className="questionnaire-text-muted text-sm mb-3 sm:mb-4">
                  we've sent you a verification link. click it to activate your account.
                </p>
                
                <Button 
                  onClick={handleResendVerification} 
                  disabled={isResendingVerification || resendCooldown > 0}
                  variant="ghost"
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isResendingVerification ? 'sending...' : resendCooldown > 0 ? `resend in ${resendCooldown}s` : 'resend email'}
                </Button>
              </div>
              <Button onClick={() => navigate('/')} variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm py-1.5 h-auto mb-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                back to home
              </Button>
            </div> : showForgotPassword ? <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {resetEmailSent ? 'check your email' : 'reset password'}
                </h1>
                {resetEmailSent && <p className="text-white/70 text-sm">
                    we've sent a password reset link to <strong>{formData.email}</strong>
                  </p>}
              </div>

              {resetEmailSent ? <div className="text-center space-y-4">
                  
                  <Button onClick={() => {
              setShowForgotPassword(false);
              setResetEmailSent(false);
              setFormErrors([]);
            }} variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    back to sign in
                  </Button>
                </div> : <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reset-email" className="text-white text-sm">
                      email
                    </Label>
                    <Input id="reset-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="drop your email" required />
                  </div>

                  {formErrors.length > 0 && <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                      {formErrors.map((error, index) => <p key={index} className="text-red-300 text-xs">
                          {error}
                        </p>)}
                    </div>}

                  <Button type="submit" disabled={isSubmitting} className="w-full questionnaire-button-primary py-2 text-sm">
                    {isSubmitting ? 'sending...' : 'send reset link'}
                  </Button>

                  <Button onClick={() => {
              setShowForgotPassword(false);
              setFormErrors([]);
            }} variant="ghost" className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    back to sign in
                  </Button>
                </form>}
            </> : <>
          {!isSignUp && <div className="text-center mb-3 sm:mb-4 flex-shrink-0">
            <PhoneLockup 
              size="lg"
              showTagline={true}
              className="mx-auto w-48 sm:w-64 md:w-72 lg:w-80 max-w-full"
            />
          </div>}

          <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white text-sm">
                email
              </Label>
              <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    name="email"
                    autoComplete="email"
                    value={formData.email} 
                    onChange={e => handleInputChange('email', e.target.value)} 
                    placeholder="drop your email" 
                    className={isEmailValid() ? 'pr-12' : ''} 
                    required 
                  />
                {isEmailValid() && <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white text-sm">
                password
              </Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} name={isSignUp ? 'new-password' : 'current-password'} autoComplete={isSignUp ? 'new-password' : 'current-password'} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="keep it secret" pattern={isSignUp ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" : undefined} title={isSignUp ? getPasswordPolicyText() : undefined} className={isPasswordValid() ? 'pr-20' : 'pr-12'} required />
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
                    locked out?
                  </button>
                 </div>}
             </div>

            {isSignUp && validatePasswordPolicy(formData.password).isValid && <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-white text-sm">
                  confirm password
                </Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="new-password" autoComplete="new-password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} placeholder="confirm your password" className={isConfirmPasswordValid() ? 'pr-20' : 'pr-12'} required />
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

            <Button type="submit" disabled={isSubmitting} className="w-full questionnaire-button-primary py-2 text-sm -mb-3">
              {isSubmitting ? 'processing...' : isVerifiedFlow ? 'continue to heartlines' : isSignUp ? 'create account' : 'sign in'}
            </Button>
          </form>

              {/* Toggle between sign up and sign in */}
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-white/70 text-xs">
                  {isSignUp ? 'already have an account?' : 'need an account?'}
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
                    {isSignUp ? 'sign in' : 'sign up'}
                  </button>
                </p>
                
                {/* Back to Home button */}
                <Button variant="ghost" onClick={() => navigate('/')} className="text-white/60 hover:bg-transparent hover:text-white/60 active:text-white/80 text-xs py-1 h-auto -mt-1 sm:-mt-2 md:mt-1.5 mb-1 sm:mb-0 transition-none">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  back to home
                </Button>
              </div>
            </>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;