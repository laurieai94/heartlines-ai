import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import PremiumBackground from "@/components/PremiumBackground";

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get('token_hash');
        const type = params.get('type');
        const next = params.get('next');

        if (!token_hash || !type) {
          setStatus('error');
          setErrorMessage('Invalid verification link. Please try again or request a new verification email.');
          return;
        }

        console.log('[AuthConfirm] Verifying token...');
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          console.error('[AuthConfirm] Verification error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Verification failed. Please try again.');
          return;
        }

        if (data?.session) {
          console.log('[AuthConfirm] Verification successful!');
          setStatus('success');
          
          // Mark as new user for welcome dialog
          if (type === 'signup' || type === 'email') {
            const userId = data.session.user.id;
            sessionStorage.setItem(`new_user_welcome_${userId}`, 'true');
            sessionStorage.setItem('new_user_welcome_generic', 'true');
            localStorage.setItem(`shown_welcome_${userId}`, 'false');
          }
          
          // Redirect after brief success message
          setTimeout(() => {
            navigate(next || '/profile', { replace: true });
          }, 1000);
        }
      } catch (err) {
        console.error('[AuthConfirm] Unexpected error:', err);
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-burgundy-800 relative overflow-hidden">
      <PremiumBackground />
      
      <div className="relative z-10 text-center px-4">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-coral-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Verifying your email...</h1>
            <p className="text-white/70">Just a moment while we confirm your account</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Email verified!</h1>
            <p className="text-white/70">Redirecting you to your profile...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Verification failed</h1>
            <p className="text-white/70 mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate('/signin')}
              className="px-6 py-3 bg-coral-400 text-white rounded-lg hover:bg-coral-500 transition-colors"
            >
              Return to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthConfirm;
