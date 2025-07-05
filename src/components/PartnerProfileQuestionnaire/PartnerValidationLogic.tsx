
// Partner profile validation logic utility functions
export const validatePartnerSection = (section: number, profileData: any) => {
  // No validation requirements - allow free navigation through all sections
  return true;
};

export const getPartnerRequiredCount = (section: number, profileData: any) => {
  // No required fields - all sections are optional
  return 0;
};

export const getPartnerTotalCount = (section: number) => {
  // Return total available fields per section for meaningful progress indicators
  switch (section) {
    case 1: return 4; // name, age, gender, pronouns
    case 2: return 3; // stress response, conflict needs, love language
    case 3: return 4; // stressors, relationship needs, conflict style, superpower
    case 4: return 3; // family background, emotions, values (removed understanding better)
    default: return 0;
  }
};

export const getPartnerCompletedCount = (section: number, profileData: any) => {
  switch (section) {
    case 1: {
      let count = 0;
      if (profileData.partnerName && profileData.partnerName.trim() !== '') count++;
      if (profileData.partnerAge && profileData.partnerAge.trim() !== '') count++;
      if (profileData.partnerGender && profileData.partnerGender.length > 0) count++;
      if (profileData.partnerPronouns && profileData.partnerPronouns.trim() !== '') count++;
      return count;
    }
    case 2: {
      let count = 0;
      if (profileData.partnerStressResponse && profileData.partnerStressResponse.length > 0) count++;
      if (profileData.partnerConflictNeeds && profileData.partnerConflictNeeds.length > 0) count++;
      if (profileData.partnerLoveLanguage && profileData.partnerLoveLanguage.length > 0) count++;
      return count;
    }
    case 3: {
      let count = 0;
      if (profileData.partnerStressors && profileData.partnerStressors.trim() !== '') count++;
      if (profileData.partnerRelationshipNeeds && profileData.partnerRelationshipNeeds.length > 0) count++;
      if (profileData.partnerConflictStyle && profileData.partnerConflictStyle.trim() !== '') count++;
      if (profileData.partnerSuperpower && profileData.partnerSuperpower.trim() !== '') count++;
      return count;
    }
    case 4: {
      let count = 0;
      // Removed partnerUnderstandBetter - that field no longer exists
      if (profileData.partnerFamilyBackground && profileData.partnerFamilyBackground.length > 0) count++;
      if (profileData.partnerEmotions && profileData.partnerEmotions.length > 0) count++;
      if (profileData.partnerValues && profileData.partnerValues.length > 0) count++;
      return count;
    }
    default: return 0;
  }
};

// Calculate overall progress from 0-100%
export const calculatePartnerOverallProgress = (profileData: any) => {
  let totalCompleted = 0;
  
  // Count all completed fields across all sections
  for (let section = 1; section <= 4; section++) {
    totalCompleted += getPartnerCompletedCount(section, profileData);
  }
  
  // Updated total to 14 fields (removed 1 field from section 4)
  const estimatedTotal = 14;
  const overallProgress = Math.min(Math.round((totalCompleted / estimatedTotal) * 100), 100);
  
  console.log(`Partner Overall Progress: ${totalCompleted} fields completed = ${overallProgress}%`);
  
  return overallProgress;
};
