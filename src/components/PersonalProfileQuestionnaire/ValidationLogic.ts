
// Simplified validation logic with consistent field naming
export const validateSection = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      const required = ['name', 'pronouns', 'age', 'orientation'];
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
      
      // Check conditional requirements based on relationship status
      if (profileData.relationshipStatus) {
        const isSingle = ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(profileData.relationshipStatus);
        const hasRelationship = ['Talking to someone', 'Talking stage', 'In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(profileData.relationshipStatus);
        
        if (isSingle) {
          if (!profileData.datingChallenges || profileData.datingChallenges.length === 0) isValid = false;
        }
        
        if (hasRelationship) {
          if (!profileData.relationshipLength) isValid = false;
          if (!profileData.relationshipChallenges || profileData.relationshipChallenges.length === 0) isValid = false;
        }
      }
      
      return isValid;
    }
    case 3: {
      const required = ['stressResponse', 'loveLanguage'];
      return required.every(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      });
    }
    case 4: {
      const required = ['familyEmotions'];
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
    case 1: return 4;
    case 2: {
      let base = 1;
      if (profileData.relationshipStatus) {
        const isSingle = ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(profileData.relationshipStatus);
        const hasRelationship = ['Talking to someone', 'Talking stage', 'In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(profileData.relationshipStatus);
        
        if (isSingle) base += 1;
        if (hasRelationship) base += 2;
      }
      return base;
    }
    case 3: return 2;
    case 4: return 1;
    default: return 0;
  }
};

export const getCompletedCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      const fields = ['name', 'pronouns', 'age', 'orientation'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 2: {
      let completed = 0;
      if (profileData.relationshipStatus) completed++;
      
      const isSingle = profileData.relationshipStatus && ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(profileData.relationshipStatus);
      const hasRelationship = profileData.relationshipStatus && ['Talking to someone', 'Talking stage', 'In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(profileData.relationshipStatus);
      
      if (isSingle && profileData.datingChallenges && profileData.datingChallenges.length > 0) completed++;
      if (hasRelationship) {
        if (profileData.relationshipLength) completed++;
        if (profileData.relationshipChallenges && profileData.relationshipChallenges.length > 0) completed++;
      }
      
      return completed;
    }
    case 3: {
      const fields = ['stressResponse', 'loveLanguage'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 4: {
      const fields = ['familyEmotions'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    default: return 0;
  }
};

export const calculateOverallProgress = (profileData: any) => {
  let totalRequired = 0;
  let totalCompleted = 0;
  
  for (let section = 1; section <= 4; section++) {
    const required = getRequiredCount(section, profileData);
    const completed = getCompletedCount(section, profileData);
    
    totalRequired += required;
    totalCompleted += completed;
  }
  
  return totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
};
