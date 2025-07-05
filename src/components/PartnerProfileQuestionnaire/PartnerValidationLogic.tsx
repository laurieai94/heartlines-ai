
// Partner profile validation logic - all questions are optional
export const validatePartnerSection = (section: number, profileData: any) => {
  // Since all questions are optional, sections are always "valid"
  // We just track completion for progress
  return true;
};

export const getPartnerRequiredCount = (section: number, profileData: any) => {
  // All questions are optional, so required count is 0
  // But we'll use total questions for progress tracking
  switch (section) {
    case 1: return 4; // name, age, pronouns, orientation
    case 2: return 4; // gender, stress response, conflict needs, love language
    case 3: return 4; // stressors, relationship needs, conflict handling, superpower
    case 4: return 4; // understanding better, family background, emotions, values
    default: return 0;
  }
};

export const getPartnerCompletedCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      const fields = ['partnerName', 'partnerAge', 'partnerPronouns', 'partnerOrientation'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 2: {
      const fields = ['partnerGender', 'partnerStressResponse', 'partnerConflictNeeds', 'partnerLoveLanguage'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 3: {
      const fields = ['partnerStressors', 'partnerRelationshipNeeds', 'partnerConflictStyle', 'partnerSuperpower'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    case 4: {
      const fields = ['partnerUnderstandBetter', 'partnerFamilyBackground', 'partnerEmotions', 'partnerValues'];
      return fields.filter(field => {
        const value = profileData[field];
        return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
      }).length;
    }
    default: return 0;
  }
};

// Calculate overall progress from 0-100%
export const calculatePartnerOverallProgress = (profileData: any) => {
  let totalQuestions = 0;
  let totalCompleted = 0;
  
  // Calculate total completed across all sections
  for (let section = 1; section <= 4; section++) {
    const questions = getPartnerRequiredCount(section, profileData);
    const completed = getPartnerCompletedCount(section, profileData);
    
    totalQuestions += questions;
    totalCompleted += completed;
  }
  
  const overallProgress = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;
  
  // Return percentage (0-100)
  return overallProgress;
};
