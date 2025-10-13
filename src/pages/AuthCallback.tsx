import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/utils/analytics";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";

const AuthCallback = () => {
  const { transferToUserAccount } = useTemporaryProfile();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange code for session - Supabase handles the URL parsing
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Auth callback error:', error);
          window.location.replace('/');
          return;
        }

        // Get redirect destination from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/profile';

        // Transfer any temporary data to the user's account
        try {
          await transferToUserAccount();
        } catch (error) {
          console.error('Profile transfer error:', error);
        }

        // Log successful login
        logEvent("login_success");
        
        // Redirect to profiles page for email confirmations
        const redirectUrl = redirectPath;
        
        // Redirect with a clean URL
        window.location.replace(redirectUrl);
      } catch (error) {
        console.error('Callback processing error:', error);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/profile';
        window.location.replace(redirectPath);
      }
    };

    handleAuthCallback();
  }, [transferToUserAccount]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-8 text-center">
        <h1 className="text-xl font-medium">Finishing sign in…</h1>
        <p className="text-sm opacity-70 mt-2">You’ll be redirected in a moment.</p>
      </section>
    </main>
  );
};

export default AuthCallback;
