import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/analytics";
import { useTemporaryProfile } from "@/hooks/useTemporaryProfile";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transferToUserAccount } = useTemporaryProfile();

  useEffect(() => {
    let mounted = true;
    const finalize = async () => {
      try {
        const url = new URL(window.location.href);
        const hasCode = !!url.searchParams.get("code");
        const hasError = url.searchParams.get("error_description");

        if (hasError) {
          // On auth error, just send user to dashboard
          navigate("/dashboard", { replace: true });
          return;
        }

        // Exchange code for a session when returning from OAuth
        if (hasCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href as string);
          if (error) throw error;
          // Clean the URL to remove query params
          window.history.replaceState({}, document.title, "/auth/callback");
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data.session || user) {
          // Transfer any temporary data into the user's account
          try { await transferToUserAccount(); } catch {}
          logEvent("login_success");
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        navigate("/dashboard", { replace: true });
      }
    };
    finalize();
    return () => { mounted = false; };
  }, [navigate, user, transferToUserAccount]);

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
