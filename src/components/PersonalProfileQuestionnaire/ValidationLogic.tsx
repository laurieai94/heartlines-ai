
// Validation logic utility functions
export const validateSection = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      const required = ['name', 'pronouns', 'age', 'gender', 'orientation'];
      return required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 2: {
      const required = ['relationshipStatus'];
      let isValid = required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
      
      const isSingleOrDating = profileData.relationshipStatus && 
        ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
      
      if (isSingleOrDating) {
        if (!profileData.datingChallenges || profileData.datingChallenges.length === 0) {
          isValid = false;
        }
        if (!profileData.datingGoals || profileData.datingGoals.length === 0) {
          isValid = false;
        }
      }
      
      if (profileData.relationshipStatus && 
          !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
        
        if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
          if (!profileData.relationshipLength) {
            isValid = false;
          }
        }
        
        if (!profileData.workingWell || profileData.workingWell.length === 0) {
          isValid = false;
        }
        if (!profileData.feelsDifficult || profileData.feelsDifficult.length === 0) {
          isValid = false;
        }
      }
      
      return isValid;
    }
    case 3: {
      // Updated to handle multi-select fields - stressResponse and loveLanguage are now arrays
      const required = ['stressResponse', 'loveLanguage'];
      return required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 4: {
      // Only require familyEmotionalVibe - now as multi-select array
      const required = ['familyEmotionalVibe'];
      return required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    default:
      return true;
  }
};

export const getRequiredCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: return 5;
    case 2: {
      let base = 1;
      
      const isSingleOrDating = profileData.relationshipStatus && 
        ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
      
      if (isSingleOrDating) {
        base += 2;
      } else if (profileData.relationshipStatus && 
                 !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
        if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
          base += 1;
        }
        base += 2;
      }
      return base;
    }
    case 3: return 2; // stressResponse and loveLanguage (both now multi-select)
    case 4: return 1; // Only familyEmotionalVibe is required (now multi-select)
    default: return 0;
  }
};

export const getCompletedCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      const fields = ['name', 'pronouns', 'age', 'gender', 'orientation'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 2: {
      let fields = ['relationshipStatus'];
      let completed = fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
      
      const isSingleOrDating = profileData.relationshipStatus && 
        ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus);
      
      if (isSingleOrDating) {
        if (profileData.datingChallenges && profileData.datingChallenges.length > 0) completed++;
        if (profileData.datingGoals && profileData.datingGoals.length > 0) completed++;
      } else if (profileData.relationshipStatus && 
                 !['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(profileData.relationshipStatus)) {
        if (!['It\'s complicated'].includes(profileData.relationshipStatus)) {
          if (profileData.relationshipLength) completed++;
        }
        if (profileData.workingWell && profileData.workingWell.length > 0) completed++;
        if (profileData.feelsDifficult && profileData.feelsDifficult.length > 0) completed++;
      }
      
      return completed;
    }
    case 3: {
      // Updated to handle new multi-select fields
      const fields = ['stressResponse', 'loveLanguage'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 4: {
      // Only count familyEmotionalVibe as required for completion (now multi-select)
      const fields = ['familyEmotionalVibe'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    default: return 0;
  }
};

// New function to calculate overall progress from 0-100%
export const calculateOverallProgress = (profileData: any) => {
  let totalRequired = 0;
  let totalCompleted = 0;
  
  // Calculate total required and completed across all sections
  for (let section = 1; section <= 4; section++) {
    const required = getRequiredCount(section, profileData);
    const completed = getCompletedCount(section, profileData);
    
    totalRequired += required;
    totalCompleted += completed;
    
    // Add debugging to track progress calculation
    console.log(`Section ${section}: ${completed}/${required} (${Math.round((completed/required)*100)}%)`);
  }
  
  const overallProgress = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
  console.log(`Overall Progress: ${totalCompleted}/${totalRequired} = ${overallProgress}%`);
  
  // Return percentage (0-100)
  return overallProgress;
};
