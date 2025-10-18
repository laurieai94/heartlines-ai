/**
 * Cleanup authentication state from browser storage
 * Only call this during explicit sign out - NOT on errors or token refresh failures
 */
export const cleanupAuthState = () => {
  // Only remove auth-specific keys, preserve other Supabase data
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.token') || key === 'sb-relqmhrzyqckoaebscgx-auth-token') {
      localStorage.removeItem(key);
    }
  });

  // Same for sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.token') || key === 'sb-relqmhrzyqckoaebscgx-auth-token') {
        sessionStorage.removeItem(key);
      }
    });
  }
};