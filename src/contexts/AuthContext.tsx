
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
    // Mobile-optimized auth state management with timeout protection
    let authTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;

    const forceAuthResolution = () => {
      console.warn('Auth: Forcing loading state resolution due to timeout');
      setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        clearTimeout(authTimeout);
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
          
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Get initial session with retry logic for mobile
    const getSessionWithRetry = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error && retryCount < maxRetries) {
          retryCount++;
          console.warn(`Auth: Retry ${retryCount}/${maxRetries} for session fetch`);
          setTimeout(getSessionWithRetry, 1000 * retryCount); // Exponential backoff
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('Auth: Session fetch failed', err);
        setLoading(false);
      }
    };

    // Start timeout for mobile (5 seconds max loading)
    authTimeout = setTimeout(forceAuthResolution, 5000);
    
    getSessionWithRetry();

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/auth/callback?intent=signup`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: name ? { name } : {}
      }
    });
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
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn('Sign out error:', err);
      }
      
      // Force redirect to homepage with clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Still redirect even if cleanup fails
      window.location.href = '/';
    }
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
