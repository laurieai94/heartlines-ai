/**
 * Cleanup authentication state from browser storage
 * Removes all Supabase-related keys to prevent auth limbo states
 */
export const cleanupAuthState = () => {
  // Remove all Supabase auth keys and profile data from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      key.startsWith('realtalk_temp_') ||
      key.startsWith('personal_profile_') ||
      key.startsWith('partner_profile_') ||
      key.includes('questionnaire') ||
      key === 'coach_last_seen_at' ||
      key === 'force_new_chat_after_signin'
    ) {
      localStorage.removeItem(key);
    }
  });

  // Remove from sessionStorage if available
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (
        key.startsWith('supabase.auth.') || 
        key.includes('sb-') ||
        key.startsWith('realtalk_temp_') ||
        key.startsWith('personal_profile_') ||
        key.startsWith('partner_profile_')
      ) {
        sessionStorage.removeItem(key);
      }
    });
  }
};