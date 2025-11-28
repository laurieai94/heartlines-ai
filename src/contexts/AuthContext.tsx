
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logError, logWarn } from '@/utils/productionLogger';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    // Extended timeout for mobile - slow cellular connections need more time
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const timeoutDuration = isMobile ? 12000 : 10000; // 12s for mobile, 10s for desktop
    
    // Progress logging for mobile
    const progressTimer = isMobile ? setTimeout(() => {
      console.log('[AuthContext] Still loading auth on mobile (5s), please wait...');
    }, 5000) : null;
    
    const timeoutId = setTimeout(() => {
      console.warn(`[AuthContext] Auth initialization timeout after ${timeoutDuration/1000}s - forcing load`);
      setLoading(false);
    }, timeoutDuration);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Check if user has been away from coach for more than 12 hours
          const lastSeenAt = localStorage.getItem('coach_last_seen_at');
          const twelveHoursAgo = Date.now() - (12 * 60 * 60 * 1000);
          
          if (!lastSeenAt || parseInt(lastSeenAt) < twelveHoursAgo) {
            // Set flag to force new conversation after signin
            localStorage.setItem('force_new_chat_after_signin', 'true');
          }
          
          // Force profile reload from database on sign-in
          // Use setTimeout to ensure user state is set first
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('profile:forceReload', {
              detail: { profileType: 'all', source: 'signin' }
            }));
          }, 100);
          
          clearTimeout(timeoutId);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    );

    // Get initial session - prioritize fast resolution for unauthenticated users
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Clear timeout and resolve loading immediately
      clearTimeout(timeoutId);
      if (progressTimer) clearTimeout(progressTimer);
      setLoading(false);
    }).catch((error) => {
      logError('Failed to get session', error);
      clearTimeout(timeoutId);
      if (progressTimer) clearTimeout(progressTimer);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      if (progressTimer) clearTimeout(progressTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/auth/callback#redirect=/profile`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: name ? { name } : {}
      }
    });
    
    // Check for signup cap error
    if (error?.message?.includes('SIGNUP_CAP_REACHED')) {
      return { 
        error: { 
          message: 'We\'re at capacity for our private preview! We\'re currently at 50 users. Check back soon or contact us for early access.',
          name: 'SignupCapReached',
          status: 429
        } as any
      };
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  // Aliases for convenience
  const signInWithEmail = signIn;
  const signUpWithEmail = (email: string, password: string, name?: string) => signUp(email, password, name);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?intent=signin`
      }
    });
    return { error };
  };

  const signOut = async () => {
    // Clean up auth state first
    cleanupAuthState();
    
    // Fire and forget - don't wait for Supabase response
    supabase.auth.signOut({ scope: 'global' }).catch(() => {
      // Ignore errors - we're already redirecting
    });
    
    // Immediately redirect without waiting
    window.location.href = '/';
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signUpWithEmail,
    signIn,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resendVerification,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
