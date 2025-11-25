import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/utils/analytics";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useToast } from "@/hooks/use-toast";
import { broadcastAuthSuccess } from "@/utils/authChannel";

const AuthCallback = () => {
  const { transferToUserAccount } = useTemporaryProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingMessage, setLoadingMessage] = useState("Verifying your email...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashString = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashString);

        // Determine where to send the user after auth
        const redirectPath = searchParams.get('redirect') || hashParams.get('redirect') || '/profile';
        const code = searchParams.get('code');

        let error: any = null;

        if (code) {
          // PKCE / OAuth flow (e.g. Google sign-in)
          const result = await supabase.auth.exchangeCodeForSession(window.location.href);
          error = result.error;
        } else {
          // Magic link / implicit flow: tokens come back in the URL hash
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const result = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            error = result.error;
          } else {
            // No tokens in URL – see if the user is already authenticated
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
              toast({
                title: "Verification link used or expired",
                description:
                  "Please sign in to continue. If you haven't confirmed your email yet, check your inbox for the verification link.",
                variant: "destructive",
              });

              navigate(`/signin?expired=true&redirect=${encodeURIComponent(redirectPath)}` , { replace: true });
              return;
            }
          }
        }

        if (error) {
          console.error('Auth callback error:', error);
          setLoadingMessage("Verifying your email status...");
          
          // Check if user is actually authenticated despite error
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // User is authenticated, token was already used
            console.log('User already authenticated, redirecting to profile');
            
            // Mark that email was just verified
            sessionStorage.setItem(`first_email_verification_${session.user.id}`, 'true');
            sessionStorage.setItem('email_just_verified', 'true');
            
            navigate(redirectPath, { replace: true });
            return;
          }
          
          // Check if this is a PKCE error (code verifier missing)
          const isPKCEError = error.message?.includes('code verifier') || 
                              error.message?.includes('invalid request');
          
          if (isPKCEError) {
            // PKCE error means the email was likely verified but code verifier is missing
            // (happens when clicking link in different browser/session)
            // Mark that email was just verified (generic flag for fallback)
            sessionStorage.setItem('email_just_verified', 'true');
            
            // Redirect to verified sign-in flow without email (user knows which email they just verified)
            toast({
              title: "Email verified!",
              description: "Please sign in to continue",
            });
            
            navigate(`/signin?verified=true&redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
            return;
          }
          
          // Other errors - redirect to signin with error message
          toast({
            title: "Verification link used or expired",
            description: "Please sign in to continue. If you haven't confirmed your email yet, check your inbox for the verification link.",
            variant: "destructive"
          });
          
          navigate(`/signin?expired=true&redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
          return;
        }

        setLoadingMessage("Setting up your account...");
        
        // Get current session to obtain user ID
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        // Transfer any temporary data to the user's account
        try {
          await transferToUserAccount();
        } catch (error) {
          console.error('Profile transfer error:', error);
        }

        // Log successful login
        logEvent("login_success");
        
        // MULTI-LAYER FLAG SYSTEM: Mark this as a first-time email verification
        if (userId) {
          // Layer 1: User-specific sessionStorage (primary)
          sessionStorage.setItem(`first_email_verification_${userId}`, 'true');
          
          // Layer 2: Generic sessionStorage (fallback for race conditions)
          sessionStorage.setItem('email_just_verified', 'true');
          
          // Layer 3: Timestamp for debugging
          sessionStorage.setItem('verification_timestamp', Date.now().toString());
          
          // Layer 4: LocalStorage backup (survives navigation/tabs)
          localStorage.setItem(`pending_welcome_${userId}`, 'true');
          
          console.log('[AuthCallback] Verification complete for new user:', userId);
        }
        
        // Check if this is a new tab/window (opened from email)
        const isNewTab = window.opener !== null;
        
        if (isNewTab && userId) {
          // Broadcast success to the original tab
          broadcastAuthSuccess(userId);
          
          // Show message to close this tab
          setLoadingMessage("Email verified! You can close this tab and return to the original window.");
          
          // Try to close the tab after a short delay (only works if opened by script)
          setTimeout(() => {
            try {
              window.close();
            } catch (e) {
              // If can't close, user will see the message above
            }
          }, 2000);
          
          return; // Don't navigate in this tab
        }
        
        // FOR NEW USERS: Always force to /profile to ensure welcome dialog triggers
        const userCreatedAt = session?.user?.created_at ? new Date(session.user.created_at) : null;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isNewUser = userCreatedAt && userCreatedAt > fiveMinutesAgo;
        
        const finalRedirect = isNewUser ? '/profile' : redirectPath;
        
        console.log('[AuthCallback] Redirecting:', { 
          isNewUser, 
          userCreatedAt, 
          finalRedirect,
          originalRedirect: redirectPath 
        });
        
        // Original tab flow - show success message and navigate
        toast({
          title: "Email confirmed!",
          description: "Welcome to heartlines. Let's build your profile.",
        });
        
        // Redirect with a clean URL
        navigate(finalRedirect, { replace: true });
      } catch (error) {
        console.error('Callback processing error:', error);
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get('redirect') || '/profile';
        navigate(redirectPath, { replace: true });
      }
    };

    handleAuthCallback();
  }, [transferToUserAccount, navigate, toast]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-8 text-center">
        <h1 className="text-xl font-medium">{loadingMessage}</h1>
        <p className="text-sm opacity-70 mt-2">You'll be redirected in a moment.</p>
      </section>
    </main>
  );
};

export default AuthCallback;
