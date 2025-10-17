import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/utils/analytics";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const { transferToUserAccount } = useTemporaryProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingMessage, setLoadingMessage] = useState("Verifying your email...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange code for session - Supabase handles the URL parsing
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Auth callback error:', error);
          setLoadingMessage("Checking your account status...");
          
          // Check if user is actually authenticated despite error
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // User is authenticated, token was already used
            console.log('User already authenticated, redirecting to profile');
            
            // Get redirect destination from URL
            const hash = window.location.hash.substring(1);
            const hashParams = new URLSearchParams(hash);
            const redirectPath = hashParams.get('redirect') || '/profile';
            
            navigate(redirectPath, { replace: true });
            return;
          }
          
          // No session - check if email is already verified
          const urlParams = new URLSearchParams(window.location.search);
          const hash = window.location.hash.substring(1);
          const hashParams = new URLSearchParams(hash);
          const redirectPath = hashParams.get('redirect') || urlParams.get('redirect') || '/profile';
          
          // Redirect to signin with helpful message
          toast({
            title: "Verification link used or expired",
            description: "Please sign in to continue. If you haven't confirmed your email yet, check your inbox for the verification link.",
            variant: "destructive"
          });
          
          navigate(`/signin?expired=true&redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
          return;
        }

        setLoadingMessage("Setting up your account...");
        
        // Get redirect destination from URL hash (more reliable than query params)
        const hash = window.location.hash.substring(1); // Remove the '#'
        const hashParams = new URLSearchParams(hash);
        const redirectPath = hashParams.get('redirect') || '/profile';

        // Transfer any temporary data to the user's account
        try {
          await transferToUserAccount();
        } catch (error) {
          console.error('Profile transfer error:', error);
        }

        // Log successful login
        logEvent("login_success");
        
        // Show success message
        toast({
          title: "Email confirmed!",
          description: "Welcome to heartlines. Let's build your profile.",
        });
        
        // Redirect with a clean URL
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Callback processing error:', error);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/profile';
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
