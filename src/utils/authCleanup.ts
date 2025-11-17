/**
 * Cleanup authentication state from browser storage
 * Removes all Supabase-related keys to prevent auth limbo states
 */
export const cleanupAuthState = () => {
  // Remove all Supabase auth keys and profile data from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (
      // Supabase auth cleanup
      key.startsWith('supabase.auth.') || 
      key.includes('sb-') ||
      
      // Profile data V2 (both old non-user-specific and new user-specific keys)
      key === 'personal_profile_v2' ||
      key === 'partner_profile_v2' ||
      key === 'personal_profile_v2_migrated' ||
      key === 'partner_profile_v2_migrated' ||
      key.startsWith('personal_profile_v2_') ||  // User-specific keys
      key.startsWith('partner_profile_v2_') ||    // User-specific keys
      
      // Legacy profile keys
      key === 'personal_profile_questionnaire' ||
      key === 'partner_profile_questionnaire' ||
      key === 'newPersonalQuestionnaire' ||
      key === 'newPartnerProfile' ||
      key === 'personalProfile' ||
      key === 'partnerProfile' ||
      
      // Temporary profile data
      key === 'realtalk_temp_profiles' ||
      key === 'realtalk_temp_demographics' ||
      
      // UI state
      key === 'heartlines_profile_welcome_dismissed' ||
      key === 'profile_completed' ||
      
      // User-specific flags (contain user IDs)
      key.startsWith('profileAutoOpenedOnce_') ||
      key.startsWith('welcomeDialogShown_') ||
      
      // Onboarding state
      key === 'onboarding_status' ||
      
      // Chat-related data
      key === 'coach_last_seen_at'
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
        key.includes('profile')
      ) {
        sessionStorage.removeItem(key);
      }
    });
  }
};