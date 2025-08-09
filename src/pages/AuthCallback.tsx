import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/utils/analytics";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const finalize = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data.session || user) {
          logEvent("login_success");
          // Go back to dashboard; ChatInputSection will refocus if requested
          navigate("/dashboard", { replace: true });
        }
      } catch {
        navigate("/dashboard", { replace: true });
      }
    };
    finalize();
    return () => { mounted = false; };
  }, [navigate, user]);

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
