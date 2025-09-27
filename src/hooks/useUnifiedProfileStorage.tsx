import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { profileSyncDiagnostics } from '@/utils/profileSyncDiagnostics';
import { logger } from '@/utils/logger';

export type ProfileType = 'personal' | 'partner';

interface ProfileData {
  [key: string]: any;
}

export const useUnifiedProfileStorage = (profileType: ProfileType) => {
  // DISABLED: This hook has been replaced by useOptimizedProfileStore for performance
  console.warn('⚠️ useUnifiedProfileStorage is disabled and replaced by useOptimizedProfileStore');
  
  // Return empty/disabled state to prevent conflicts
  return {
    profileData: {},
    isLoading: false,
    isReady: false,
    saveData: async () => {
      console.warn('useUnifiedProfileStorage.saveData is disabled. Use useOptimizedProfileStore instead.');
    },
    updateField: () => {
      console.warn('useUnifiedProfileStorage.updateField is disabled. Use useOptimizedProfileStore instead.');
    },
    handleMultiSelect: () => {
      console.warn('useUnifiedProfileStorage.handleMultiSelect is disabled. Use useOptimizedProfileStore instead.');
    },
    lastSaved: null,
    recoverFromDatabase: async () => {
      console.warn('useUnifiedProfileStorage.recoverFromDatabase is disabled. Use useOptimizedProfileStore instead.');
    }
  };
};