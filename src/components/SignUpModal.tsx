
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { toast } from "sonner";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockingAction?: string;
}

const SignUpModal = ({ isOpen, onClose, blockingAction }: SignUpModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const { transferToUserAccount } = useTemporaryProfile();

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
        result = await signUp(email, password);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Transfer temporary profile data
        await transferToUserAccount();
        toast.success(isSignUp ? "Welcome to RealTalk!" : "Welcome back!");
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
      }
      // Successful sign-in will redirect to the OAuth callback
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] glass bg-background/80 border border-border shadow-3xl mx-auto">
        <div className="text-center space-y-6 p-4 lg:p-6">
          {/* Kai Avatar */}
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse shadow-glow"></div>
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow relative z-10 border border-border">
              <Heart className="w-8 h-8" />
            </div>
          </div>

          {/* Dynamic Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? "You're Almost There!" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {getActionMessage()}
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 text-base font-medium bg-background border border-border text-foreground/90 hover:bg-accent/50 shadow-3xl"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-left block text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-left block text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-12 text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold shadow-glow"
            >
              {loading ? "Creating Account..." : (isSignUp ? "Create Free Account" : "Sign In")}
            </Button>
          </form>

          {/* Toggle Sign In/Up */}
          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Free forever • No email confirmation needed</p>
            <p>• Your profile stays private to you</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
