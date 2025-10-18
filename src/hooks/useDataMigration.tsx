import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useDataMigration = () => {
  const { user } = useAuth();
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  // Migration function to move old localStorage data to new format
  const migrateOldData = () => {
    try {
      // SECURITY: Only migrate if user is logged in to prevent cross-user contamination
      const currentUserId = user?.id;
      if (!currentUserId) {
        console.log('[Migration] Skipping migration - no user logged in');
        return false;
      }

      const migrations: { oldKey: string; newKey: string }[] = [
        { oldKey: 'partner_profile_data', newKey: 'partner_profile_questionnaire' },
        { oldKey: 'personal_profile_data', newKey: 'personal_profile_questionnaire' },
        { oldKey: 'profile_questionnaire_data', newKey: 'personal_profile_questionnaire' }
      ];

      let dataFound = false;

      migrations.forEach(({ oldKey, newKey }) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData && !localStorage.getItem(newKey)) {
          try {
            // Validate the data is JSON
            JSON.parse(oldData);
            localStorage.setItem(newKey, oldData);
            console.log(`Migrated data from ${oldKey} to ${newKey}`);
            dataFound = true;
          } catch (error) {
            console.warn(`Failed to migrate corrupted data from ${oldKey}:`, error);
          }
        }
      });

      // Migrate realtalk temporary data format if needed
      const realtalkProfiles = localStorage.getItem('realtalk_temp_profiles');
      const realtalkDemographics = localStorage.getItem('realtalk_temp_demographics');
      
      if (realtalkProfiles || realtalkDemographics) {
        try {
          const profiles = realtalkProfiles ? JSON.parse(realtalkProfiles) : null;
          const demographics = realtalkDemographics ? JSON.parse(realtalkDemographics) : null;
          
          // Migrate personal profile if exists
          if (profiles?.your && profiles.your[0] && !localStorage.getItem('personal_profile_questionnaire')) {
            localStorage.setItem('personal_profile_questionnaire', JSON.stringify(profiles.your[0]));
            console.log('Migrated personal profile from realtalk format');
            dataFound = true;
          }
          
          // Migrate partner profile if exists
          if (profiles?.partner && profiles.partner[0] && !localStorage.getItem('partner_profile_questionnaire')) {
            localStorage.setItem('partner_profile_questionnaire', JSON.stringify(profiles.partner[0]));
            console.log('Migrated partner profile from realtalk format');
            dataFound = true;
          }
          
          // Migrate demographics if exists
          if (demographics?.your && !localStorage.getItem('personal_profile_questionnaire')) {
            localStorage.setItem('personal_profile_questionnaire', JSON.stringify(demographics.your));
            console.log('Migrated personal demographics from realtalk format');
            dataFound = true;
          }
          
          if (demographics?.partner && !localStorage.getItem('partner_profile_questionnaire')) {
            localStorage.setItem('partner_profile_questionnaire', JSON.stringify(demographics.partner));
            console.log('Migrated partner demographics from realtalk format');
            dataFound = true;
          }
        } catch (error) {
          console.warn('Failed to migrate realtalk data:', error);
        }
      }

      return dataFound;
    } catch (error) {
      console.error('Error during data migration:', error);
      return false;
    }
  };

  // Clean up old localStorage keys after successful migration
  const cleanupOldData = () => {
    const keysToCleanup = [
      'partner_profile_data',
      'personal_profile_data', 
      'profile_questionnaire_data'
    ];

    keysToCleanup.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Cleaned up old data key: ${key}`);
      }
    });
  };

  // Perform migration on mount with performance optimization
  useEffect(() => {
    if (!migrationCompleted) {
      // Defer migration to not block initial render
      const deferredMigration = () => {
        try {
          const migrated = migrateOldData();
          
          if (migrated) {
            // Clean up old data after a longer delay to ensure new system has loaded
            setTimeout(() => {
              cleanupOldData();
            }, 10000); // Increased delay
          }
          
          setMigrationCompleted(true);
        } catch (error) {
          console.error('Migration failed:', error);
          setMigrationCompleted(true); // Still mark as completed to prevent retry loops
        }
      };
      
      // Use requestIdleCallback if available to run during idle time
      if ('requestIdleCallback' in window) {
        requestIdleCallback(deferredMigration, { timeout: 5000 });
      } else {
        // Fallback to setTimeout with delay
        setTimeout(deferredMigration, 100);
      }
    }
  }, [migrationCompleted]);

  return {
    migrationCompleted,
    migrateOldData,
    cleanupOldData
  };
};