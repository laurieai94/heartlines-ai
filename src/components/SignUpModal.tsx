import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff, User, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND } from "@/branding";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { toast } from "sonner";
import { logEvent } from "@/utils/analytics";
import { validatePasswordPolicy, getPasswordPolicyText } from "@/utils/passwordPolicy";
interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockingAction?: string;
  initialMode?: 'signUp' | 'signIn';
}
const SignUpModal = ({
  isOpen,
  onClose,
  blockingAction,
  initialMode = 'signUp'
}: SignUpModalProps) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signUp');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationState, setShowVerificationState] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const {
    signUp,
    signIn,
    resendVerification,
    resetPassword
  } = useAuth();
  const {
    transferToUserAccount
  } = useTemporaryProfile();

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  const getActionMessage = () => {
    switch (blockingAction) {
      case 'chat':
        return "kai's ready when you are. let's create your free account to start coaching with your personalized insights.";
      case 'practice':
        return "ready to practice real conversations? create your free account to unlock conversation simulations.";
      case 'actions':
        return "let's turn insights into action. create your free account to access personalized relationship tools.";
      default:
        return "ready to get started with kai? create your free account to save your profile and unlock your tools.";
    }
  };
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password policy for sign-up only
    if (isSignUp) {
      const passwordValidation = validatePasswordPolicy(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }
    }
    
    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, name);
      } else {
        result = await signIn(email, password);
      }
      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (isSignUp) {
          // Check if user is immediately signed in (no email verification required)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // User is signed in immediately, transfer data and redirect
            await transferToUserAccount();
            onClose();
            window.location.href = '/profile';
          } else {
            // No session, show verification state
            setShowVerificationState(true);
            toast.success("Check your email to verify your account!");
          }
        } else {
          // Transfer temporary profile data and close for sign-ins
          await transferToUserAccount();
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !email) return;
    
    setResendLoading(true);
    try {
      const result = await resendVerification(email);
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Verification email sent!");
        setResendCooldown(60); // 60-second cooldown
        logEvent("Auth:VerificationSent", { email });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification");
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        toast.error(result.error.message);
      } else {
        setResetEmailSent(true);
        toast.success("Password reset email sent!");
        logEvent("Auth:PasswordResetSent", { email });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-w-[92vw] p-0 bg-transparent border-0 shadow-none mx-auto">
        <div className="relative min-h-[500px] flex items-center justify-center">
          {/* Softened background orbs with site colors */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-coral-500/10 to-peach-500/8 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-burgundy-500/12 to-coral-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-peach-400/8 to-coral-400/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute -top-5 -right-8 w-24 h-24 bg-gradient-to-br from-coral-600/8 to-burgundy-600/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-5 -left-8 w-36 h-36 bg-gradient-to-br from-burgundy-500/6 to-coral-500/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Questionnaire modal card */}
          <div className="questionnaire-modal-card overflow-hidden">
            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-semibold questionnaire-text">
                    {showVerificationState ? "Check Your Email" 
                     : showForgotPassword ? (resetEmailSent ? "Check Your Email" : "Reset Password")
                     : isSignUp ? "Create Your Profile" : "Welcome back"}
                  </h2>
                </div>
                <p className="questionnaire-text-muted text-sm">
                  {showVerificationState 
                    ? "We've sent a verification link to your email. Click the link to activate your account."
                    : showForgotPassword
                    ? (resetEmailSent ? "We've sent a password reset link to your email." : "Enter your email to receive a password reset link.")
                     : isSignUp 
                     ? "join thousands improving their relationships with personalized ai coaching."
                     : "pick up right where you left off with kai."}
                </p>
              </div>

              {/* Verification State, Forgot Password, or Email Form */}
              {showVerificationState ? (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm questionnaire-text-muted">
                      Didn't receive the email? Check your spam folder or request a new one.
                    </p>

                    <button
                      onClick={handleResendVerification}
                      disabled={resendCooldown > 0 || resendLoading}
                      className="questionnaire-button-secondary w-full"
                    >
                      {resendLoading ? (
                        "Sending..."
                      ) : resendCooldown > 0 ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Resend in {resendCooldown}s
                        </div>
                      ) : (
                        "Resend verification email"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowVerificationState(false);
                        setIsSignUp(false);
                      }}
                      className="text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              ) : showForgotPassword ? (
                <div className="space-y-4">
                  {resetEmailSent ? (
                    <div className="text-center space-y-4">
                      <p className="text-sm questionnaire-text-muted">
                        Check your email and follow the link to reset your password.
                      </p>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                          setIsSignUp(false);
                        }}
                        className="text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
                      >
                        Back to sign in
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-1">
                        <label htmlFor="reset-email" className="sr-only">Drop your email</label>
                        <input
                          id="reset-email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="questionnaire-input"
                          placeholder="Drop your email"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="questionnaire-button-primary w-full"
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
                      >
                        Back to sign in
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label htmlFor="name" className="sr-only">What should we call you?</label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="questionnaire-input"
                        placeholder="What should we call you?"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="sr-only">Drop your email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="questionnaire-input"
                      placeholder="Drop your email"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="space-y-2">
                      <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete={isSignUp ? "new-password" : "current-password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="questionnaire-input pr-12"
                          placeholder="Password"
                          pattern={isSignUp ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" : undefined}
                          title={isSignUp ? getPasswordPolicyText() : undefined}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 questionnaire-text-muted hover:questionnaire-text transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {isSignUp && (
                        <p className="text-xs questionnaire-text-muted leading-tight">
                          {getPasswordPolicyText()}
                        </p>
                      )}
                    </div>

                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="questionnaire-button-primary w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        "Signing in..." 
                      ) : isSignUp ? (
                        "Create Account"
                      ) : (
                        <>
                          Let's Go <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Toggle Sign In/Up */}
              {!showVerificationState && !showForgotPassword && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm questionnaire-text-muted hover:questionnaire-text transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "New? Create your profile."}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default SignUpModal;