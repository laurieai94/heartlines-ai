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
      const required = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
      return required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 4: {
      const optionalFields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences'];
      return optionalFields.some(field => {
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
    case 3: return 4;
    case 4: return 1;
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
      const fields = ['stressResponse', 'conflictNeeds', 'feelLovedWhen', 'attachmentStyle'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 4: {
      const fields = ['familyDynamics', 'parentConflictStyle', 'loveMessages', 'loveInfluences'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    default: return 0;
  }
};

export const getOverallProgress = (profileData: any) => {
  const totalRequired = [1, 2, 3, 4].reduce((sum, section) => sum + getRequiredCount(section, profileData), 0);
  const totalCompleted = [1, 2, 3, 4].reduce((sum, section) => sum + getCompletedCount(section, profileData), 0);
  
  return Math.round((totalCompleted / totalRequired) * 100);
};

export const getMotivationalMessage = (progress: number, currentSection: number) => {
  if (progress === 100) return "🎉 Complete!";
  if (progress >= 75) return "🔥 Almost there!";
  if (progress >= 50) return "💪 Great progress!";
  if (progress >= 25) return "✨ You're doing great!";
  return "🚀 Let's get started!";
};

export const getTimeEstimation = (progress: number) => {
  const remainingProgress = 100 - progress;
  const estimatedMinutes = Math.ceil((remainingProgress / 100) * 5); // Assume 5 minutes total
  
  if (estimatedMinutes <= 1) return "Less than 1 minute left";
  if (estimatedMinutes === 2) return "About 2 minutes remaining";
  return `About ${estimatedMinutes} minutes remaining`;
};

export const getSectionCompletionRate = (section: number, profileData: any) => {
  const required = getRequiredCount(section, profileData);
  const completed = getCompletedCount(section, profileData);
  return required > 0 ? Math.round((completed / required) * 100) : 0;
};
