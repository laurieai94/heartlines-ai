/**
 * Cleanup authentication state from browser storage
 * Removes all Supabase-related keys AND profile data to prevent auth limbo states
 * and data contamination when accounts are deleted/recreated
 */
export const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (
      // Supabase auth keys
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      
      // Profile data keys (current V2 format)
      key.includes('_personal_profile_v2') ||
      key.includes('_partner_profile_v2') ||
      
      // Legacy profile keys
      key === 'personal_profile_questionnaire' ||
      key === 'partner_profile_questionnaire' ||
      key === 'personal_profile_v2' ||
      key === 'partner_profile_v2' ||
      
      // Legacy migration keys
      key === 'realtalk_temp_profiles' ||
      key === 'realtalk_temp_demographics' ||
      key.startsWith('realtalk_') ||
      
      // App state keys
      key === 'heartlines_profile_welcome_dismissed' ||
      key === 'coach_last_seen_at' ||
      key === 'force_new_chat_after_signin' ||
      key === 'profile_completed' ||
      key === 'focusChatInputAfterAuth' ||
      
      // First login tracking
      key.includes('_first_login_completed') ||
      key.includes('_auto_opened_welcome') ||
      
      // User ID tracking
      key === 'heartlines_last_user_id' ||
      
      // Intended plan/pricing state
      key === 'intended_plan_tier' ||
      key === 'intended_plan_return'
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
        key.includes('profile') ||
        key.includes('heartlines')
      ) {
        sessionStorage.removeItem(key);
      }
    });
  }

  // Clear the batched storage cache to prevent write-backs
  if (typeof window !== 'undefined' && (window as any).batchedStorage) {
    try {
      (window as any).batchedStorage.clearCache();
    } catch (err) {
      // Silent fail if batched storage not available
    }
  }
};