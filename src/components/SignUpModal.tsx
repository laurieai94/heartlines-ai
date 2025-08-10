import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Eye, EyeOff, User, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const {
    signUp,
    signIn,
    resendVerification
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
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] max-w-[92vw] p-0 bg-transparent border-0 shadow-none mx-auto">
        <div className="relative">
          {/* Colorful frosty glows */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-gradient-to-br from-coral-400 to-peach-200 blur-3xl opacity-40 animate-float" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-peach-200 to-coral-400 blur-3xl opacity-40 animate-float" />

          {/* Gradient border wrapper */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-coral-400 to-peach-200 shadow-3xl shadow-coral-200/50 animate-gradient">
            <div className="questionnaire-modal-card text-center space-y-5 p-5 rounded-2xl">
              {/* Kai Avatar */}
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-coral-400 to-peach-200 blur-xl opacity-80 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-coral-500 to-peach-400 text-white flex items-center justify-center shadow-xl relative z-10 border border-white/20">
                  <Heart className="w-8 h-8" />
                </div>
              </div>

              {/* Dynamic Message */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--coral-600))] to-[hsl(var(--peach-400))] bg-clip-text text-transparent">
                  {showVerificationState ? "Check Your Email" : isSignUp ? "You're Almost There!" : "Welcome Back"}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {showVerificationState 
                    ? "We've sent a verification link to your email. Click the link to activate your account."
                    : isSignUp 
                    ? "Create your free account for personalized coaching and insights."
                    : "Access your profiles and customized coaching with Kai."}
                </p>
              </div>

              {/* Verification State or Email Form */}
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
                      className="w-full h-12 text-base font-medium border-coral-200 text-coral-700 hover:bg-coral-50"
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
                      className="text-sm text-muted-foreground hover:text-coral-600 transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-left block text-sm font-medium text-coral-700">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-coral-600" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="pl-10 h-12 text-base border-coral-200 focus:border-coral-300 focus:ring-coral-200/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-left block text-sm font-medium text-coral-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-coral-600" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="pl-10 h-12 text-base border-coral-200 focus:border-coral-300 focus:ring-coral-200/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-left block text-sm font-medium text-coral-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pr-10 h-12 text-base border-coral-200 focus:border-coral-300 focus:ring-coral-200/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-coral-600 hover:text-coral-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="questionnaire-button-primary w-full h-12 text-base font-semibold rounded-xl shadow-neon transition-transform duration-200 hover:scale-[1.02]"
                  >
                    {loading ? "Creating Account..." : isSignUp ? "Create Free Account" : "Sign In"}
                  </Button>
                </form>
              )}

              {/* Toggle Sign In/Up */}
              {!showVerificationState && (
                <div className="text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-muted-foreground hover:text-coral-600 transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                  </button>
                </div>
              )}

              {/* Trust Indicators */}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default SignUpModal;