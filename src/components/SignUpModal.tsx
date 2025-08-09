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
const SignUpModal = ({
  isOpen,
  onClose,
  blockingAction
}: SignUpModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    signUp,
    signIn
  } = useAuth();
  const {
    transferToUserAccount
  } = useTemporaryProfile();
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
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] max-w-[92vw] p-0 bg-transparent border-0 shadow-none mx-auto">
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-violet-500 via-orange-500 to-violet-600 shadow-2xl">
          <div className="text-center space-y-5 p-5 rounded-2xl bg-white/95 supports-[backdrop-filter]:backdrop-blur-xl border border-white/30 shadow-inner">
          {/* Kai Avatar */}
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-400/40 via-orange-400/40 to-violet-500/40 blur-xl opacity-80 animate-pulse"></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-orange-500 text-white flex items-center justify-center shadow-xl relative z-10 border border-white/20">
              <Heart className="w-8 h-8" />
            </div>
          </div>

          {/* Dynamic Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? "You're Almost There!" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Create your free account for personalized coaching and insights.
            </p>
          </div>


          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-12 text-base bg-white/80 border-gray-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 focus-visible:border-violet-500" placeholder="Enter your email" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-left block text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="pr-10 h-12 text-base bg-white/80 border-gray-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 focus-visible:border-violet-500" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-lg transition-all duration-200">
              {loading ? "Creating Account..." : isSignUp ? "Create Free Account" : "Sign In"}
            </Button>
          </form>

          {/* Toggle Sign In/Up */}
          <div className="text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>

          {/* Trust Indicators */}
          
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default SignUpModal;