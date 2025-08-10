import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff, User, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BrandLogo from "@/components/BrandLogo";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { toast } from "sonner";
import { logEvent } from "@/utils/analytics";
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
        return "Kai's ready when you are. Let's create your free account to start coaching with your personalized insights.";
      case 'practice':
        return "Ready to practice real conversations? Create your free account to unlock conversation simulations.";
      case 'actions':
        return "Let's turn insights into action. Create your free account to access personalized relationship tools.";
      default:
        return "Ready to get started with Kai? Create your free account to save your profile and unlock your tools.";
    }
  };
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
          // Show verification state for new signups
          setShowVerificationState(true);
          toast.success("Check your email to verify your account!");
        } else {
          // Transfer temporary profile data and close for sign-ins
          await transferToUserAccount();
          toast.success("Welcome back!");
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
          {/* Warm burgundy animated background orbs */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-rose-500/40 to-pink-400/30 rounded-full blur-2xl animate-float"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/35 to-rose-400/25 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-pink-500/30 to-purple-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute -top-5 -right-8 w-24 h-24 bg-gradient-to-br from-red-400/25 to-rose-500/15 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-5 -left-8 w-36 h-36 bg-gradient-to-br from-pink-400/20 to-red-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Glassmorphism card with warm tints */}
          <div className="relative glass rounded-3xl bg-gradient-to-br from-white/95 via-coral-50/80 to-peach-50/70 backdrop-blur-xl border border-white/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_40px_rgba(251,146,60,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-coral-400/5 via-transparent to-peach-400/5"></div>
            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex flex-col items-center justify-center gap-3">
                  <BrandLogo 
                    className="w-10 h-10" 
                    variant="bare"
                    imgSrc="/lovable-uploads/45c63ee1-bb0c-4f21-9969-0652ac0ba1c9.png"
                    imgAlt="RealTalk logo"
                  />
                  <h2 className="text-2xl font-semibold text-foreground">
                    {showVerificationState ? "Check Your Email" 
                     : showForgotPassword ? (resetEmailSent ? "Check Your Email" : "Reset Password")
                     : isSignUp ? "Create Your Profile" : "Welcome back"}
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  {showVerificationState 
                    ? "We've sent a verification link to your email. Click the link to activate your account."
                    : showForgotPassword
                    ? (resetEmailSent ? "We've sent a password reset link to your email." : "Enter your email to receive a password reset link.")
                    : isSignUp 
                    ? "Join thousands improving their relationships with personalized AI coaching."
                    : "Pick up right where you left off with Kai."}
                </p>
              </div>

              {/* Verification State, Forgot Password, or Email Form */}
              {showVerificationState ? (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or request a new one.
                    </p>

                    <Button
                      onClick={handleResendVerification}
                      disabled={resendCooldown > 0 || resendLoading}
                      variant="outline"
                      className="w-full h-11 text-base font-medium rounded-xl bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 hover:border-coral-300 transition-all duration-200"
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
                    </Button>

                    <button
                      onClick={() => {
                        setShowVerificationState(false);
                        setIsSignUp(false);
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              ) : showForgotPassword ? (
                <div className="space-y-4">
                  {resetEmailSent ? (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Check your email and follow the link to reset your password.
                      </p>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                          setIsSignUp(false);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Back to sign in
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-1">
                        <Input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="h-11 text-base rounded-xl border-white/20 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-coral-300 transition-all duration-200 placeholder:text-muted-foreground/70"
                          placeholder="Drop your email"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
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
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-11 text-base rounded-xl border-white/20 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-coral-300 transition-all duration-200 placeholder:text-muted-foreground/70"
                        placeholder="What should we call you?"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="h-11 text-base rounded-xl border-white/20 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-coral-300 transition-all duration-200 placeholder:text-muted-foreground/70"
                      placeholder="Drop your email"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pr-10 h-11 text-base rounded-xl border-white/20 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-coral-300 transition-all duration-200 placeholder:text-muted-foreground/70"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-muted-foreground hover:text-coral-500 transition-colors"
                      >
                        Oops, blanking rn
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                    </Button>
                  </div>
                </form>
              )}

              {/* Toggle Sign In/Up */}
              {!showVerificationState && !showForgotPassword && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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